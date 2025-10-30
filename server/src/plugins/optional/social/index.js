const PluginBase = require('../../PluginBase');
const { DataTypes } = require('sequelize');

class SocialPlugin extends PluginBase {
  constructor() {
    super('social', '1.0.0');
    this.dependencies = ['products', 'email'];
  }

  async initialize(app, db) {
    super.initialize(app, db);
    this.SocialShare = this.createSocialShareModel(db);
    this.SocialAccount = this.createSocialAccountModel(db);
    this.SocialPost = this.createSocialPostModel(db);
    
    await this.SocialShare.sync();
    await this.SocialAccount.sync();
    await this.SocialPost.sync();
    
    const socialRoutes = require('./routes');
    app.use('/api/social', socialRoutes);
    
    console.log('Social Plugin initialized');
  }

  createSocialShareModel(db) {
    return db.define('SocialShare', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      platform: {
        type: DataTypes.ENUM('facebook', 'twitter', 'instagram', 'linkedin', 'pinterest', 'whatsapp'),
        allowNull: false
      },
      contentType: {
        type: DataTypes.ENUM('product', 'category', 'post', 'page'),
        allowNull: false
      },
      contentId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      shareUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      shareCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'social_shares',
      timestamps: true,
      indexes: [
        {
          fields: ['platform', 'contentType', 'contentId']
        }
      ]
    });
  }

  createSocialAccountModel(db) {
    return db.define('SocialAccount', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      platform: {
        type: DataTypes.ENUM('facebook', 'twitter', 'instagram', 'linkedin', 'pinterest', 'youtube'),
        allowNull: false
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      accountUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tokenExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      settings: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Platform-specific settings'
      }
    }, {
      tableName: 'social_accounts',
      timestamps: true,
      indexes: [
        {
          fields: ['platform']
        }
      ]
    });
  }

  createSocialPostModel(db) {
    return db.define('SocialPost', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      platform: {
        type: DataTypes.ENUM('facebook', 'twitter', 'instagram', 'linkedin', 'pinterest'),
        allowNull: false
      },
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'social_accounts',
          key: 'id'
        }
      },
      contentType: {
        type: DataTypes.ENUM('product', 'category', 'post', 'page'),
        allowNull: false
      },
      contentId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      externalPostId: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'ID from the social platform'
      },
      externalPostUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('pending', 'published', 'failed', 'scheduled'),
        defaultValue: 'pending'
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      engagement: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Likes, shares, comments, etc.'
      }
    }, {
      tableName: 'social_posts',
      timestamps: true,
      indexes: [
        {
          fields: ['platform', 'contentType', 'contentId']
        },
        {
          fields: ['status']
        }
      ]
    });
  }

  async generateShareUrl(platform, contentType, contentId, customData = {}) {
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      let shareUrl = '';
      let message = '';

      switch (contentType) {
        case 'product':
          const product = await this.db.models.Product.findByPk(contentId);
          if (product) {
            shareUrl = `${baseUrl}/product/${product.slug || product.id}`;
            message = `Check out this amazing product: ${product.name}`;
          }
          break;
        
        case 'category':
          const category = await this.db.models.Category.findByPk(contentId);
          if (category) {
            shareUrl = `${baseUrl}/category/${category.slug || category.id}`;
            message = `Browse ${category.name} products`;
          }
          break;
        
        default:
          shareUrl = baseUrl;
          message = 'Check out our amazing products!';
      }

      // Platform-specific URL formatting
      switch (platform) {
        case 'facebook':
          return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`;
        
        case 'twitter':
          return `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`;
        
        case 'linkedin':
          return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        
        case 'pinterest':
          const imageUrl = customData.imageUrl || '';
          return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(message)}&media=${encodeURIComponent(imageUrl)}`;
        
        case 'whatsapp':
          return `https://wa.me/?text=${encodeURIComponent(message + ' ' + shareUrl)}`;
        
        default:
          return shareUrl;
      }
    } catch (error) {
      console.error('Error generating share URL:', error);
      return '';
    }
  }

  async recordShare(platform, contentType, contentId, userId = null) {
    try {
      const shareUrl = await this.generateShareUrl(platform, contentType, contentId);
      
      const [share, created] = await this.SocialShare.findOrCreate({
        where: { platform, contentType, contentId },
        defaults: {
          shareUrl,
          shareCount: 1
        }
      });

      if (!created) {
        await share.increment('shareCount');
      }

      return share;
    } catch (error) {
      console.error('Error recording share:', error);
      throw error;
    }
  }

  async createSocialPost(platform, accountId, contentType, contentId, message, imageUrl = null, scheduledAt = null) {
    try {
      const post = await this.SocialPost.create({
        platform,
        accountId,
        contentType,
        contentId,
        message,
        imageUrl,
        status: scheduledAt ? 'scheduled' : 'pending',
        scheduledAt
      });

      // If not scheduled, attempt to publish immediately
      if (!scheduledAt) {
        await this.publishSocialPost(post.id);
      }

      return post;
    } catch (error) {
      console.error('Error creating social post:', error);
      throw error;
    }
  }

  async publishSocialPost(postId) {
    try {
      const post = await this.SocialPost.findByPk(postId, {
        include: [{ model: this.SocialAccount, as: 'account' }]
      });

      if (!post || post.status === 'published') {
        return post;
      }

      // Get content data
      let contentData = {};
      switch (post.contentType) {
        case 'product':
          const product = await this.db.models.Product.findByPk(post.contentId);
          if (product) {
            contentData = {
              title: product.name,
              description: product.description,
              image: product.images?.[0]?.url,
              url: `${process.env.FRONTEND_URL}/product/${product.slug || product.id}`
            };
          }
          break;
        
        case 'category':
          const category = await this.db.models.Category.findByPk(post.contentId);
          if (category) {
            contentData = {
              title: category.name,
              description: category.description,
              url: `${process.env.FRONTEND_URL}/category/${category.slug || category.id}`
            };
          }
          break;
      }

      // Platform-specific publishing logic
      const result = await this.publishToPlatform(post.platform, post.account, contentData, post.message, post.imageUrl);
      
      if (result.success) {
        await post.update({
          status: 'published',
          publishedAt: new Date(),
          externalPostId: result.externalId,
          externalPostUrl: result.externalUrl
        });
      } else {
        await post.update({ status: 'failed' });
      }

      return post;
    } catch (error) {
      console.error('Error publishing social post:', error);
      throw error;
    }
  }

  async publishToPlatform(platform, account, contentData, message, imageUrl) {
    // This is a placeholder implementation
    // In a real application, you would integrate with actual social media APIs
    console.log(`Publishing to ${platform}:`, { contentData, message, imageUrl });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      externalId: `ext_${Date.now()}`,
      externalUrl: `https://${platform}.com/post/${Date.now()}`
    };
  }

  async getShareStats(contentType, contentId) {
    try {
      const shares = await this.SocialShare.findAll({
        where: { contentType, contentId, isActive: true }
      });

      const stats = {
        totalShares: shares.reduce((sum, share) => sum + share.shareCount, 0),
        platformStats: {}
      };

      shares.forEach(share => {
        if (!stats.platformStats[share.platform]) {
          stats.platformStats[share.platform] = 0;
        }
        stats.platformStats[share.platform] += share.shareCount;
      });

      return stats;
    } catch (error) {
      console.error('Error getting share stats:', error);
      return { totalShares: 0, platformStats: {} };
    }
  }

  async getSocialAccounts(platform = null) {
    try {
      const where = { isActive: true };
      if (platform) {
        where.platform = platform;
      }

      return await this.SocialAccount.findAll({ where });
    } catch (error) {
      console.error('Error getting social accounts:', error);
      return [];
    }
  }

  async createSocialAccount(accountData) {
    try {
      return await this.SocialAccount.create(accountData);
    } catch (error) {
      console.error('Error creating social account:', error);
      throw error;
    }
  }

  async updateSocialAccount(id, updateData) {
    try {
      const account = await this.SocialAccount.findByPk(id);
      if (!account) {
        throw new Error('Social account not found');
      }

      await account.update(updateData);
      return account;
    } catch (error) {
      console.error('Error updating social account:', error);
      throw error;
    }
  }

  async deleteSocialAccount(id) {
    try {
      const account = await this.SocialAccount.findByPk(id);
      if (!account) {
        throw new Error('Social account not found');
      }

      await account.destroy();
      return true;
    } catch (error) {
      console.error('Error deleting social account:', error);
      throw error;
    }
  }

  getRoutes() {
    return require('./routes');
  }

  getMiddleware() {
    return [];
  }

  getModels() {
    return {
      SocialShare: this.SocialShare,
      SocialAccount: this.SocialAccount,
      SocialPost: this.SocialPost
    };
  }
}

module.exports = SocialPlugin; 