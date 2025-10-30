const PluginBase = require('../../PluginBase');

/**
 * Reviews Plugin
 * Provides product reviews and ratings functionality
 */
class ReviewsPlugin extends PluginBase {
  constructor() {
    super('reviews', '1.0.0');
    this.dependencies = [];
  }

  /**
   * Plugin-specific initialization
   */
  async onInitialize() {
    // Set up review model
    this.setupReviewModel();
    
    // Set up review hooks
    this.setupReviewHooks();
    
    console.log('Reviews plugin initialized');
  }

  /**
   * Set up review model
   */
  setupReviewModel() {
    const { DataTypes } = require('sequelize');
    const { sequelize } = require('../../../config/database');

    // Create Review model
    this.Review = sequelize.define('Review', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      helpfulCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      tableName: 'reviews',
      indexes: [
        { fields: ['productId'] },
        { fields: ['userId'] },
        { fields: ['rating'] },
        { fields: ['isApproved'] }
      ]
    });

    // Set up associations
    const { Product, User } = this.db.models;
    this.Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    this.Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Product.hasMany(this.Review, { foreignKey: 'productId', as: 'reviews' });
    User.hasMany(this.Review, { foreignKey: 'userId', as: 'reviews' });
  }

  /**
   * Set up review hooks
   */
  setupReviewHooks() {
    // Update product average rating when review is created/updated
    this.Review.addHook('afterCreate', async (review) => {
      await this.updateProductRating(review.productId);
    });

    this.Review.addHook('afterUpdate', async (review) => {
      await this.updateProductRating(review.productId);
    });

    this.Review.addHook('afterDestroy', async (review) => {
      await this.updateProductRating(review.productId);
    });
  }

  /**
   * Update product average rating
   * @param {string} productId - Product ID
   */
  async updateProductRating(productId) {
    try {
      const { Product } = this.db.models;
      
      const reviews = await this.Review.findAll({
        where: {
          productId,
          isApproved: true
        }
      });

      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Product.update(
          { 
            averageRating: Math.round(averageRating * 10) / 10,
            reviewCount: reviews.length
          },
          { where: { id: productId } }
        );
      } else {
        await Product.update(
          { averageRating: null, reviewCount: 0 },
          { where: { id: productId } }
        );
      }
    } catch (error) {
      console.error('Error updating product rating:', error);
    }
  }

  /**
   * Get review routes
   */
  getRoutes() {
    const express = require('express');
    const router = express.Router();

    // Get reviews for a product
    router.get('/product/:productId', async (req, res) => {
      try {
        const { productId } = req.params;
        const { page = 1, limit = 10, rating } = req.query;

        const where = {
          productId,
          isApproved: true
        };

        if (rating) {
          where.rating = rating;
        }

        const reviews = await this.Review.findAndCountAll({
          where,
          include: [{
            model: this.db.models.User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName']
          }],
          order: [['createdAt', 'DESC']],
          limit: parseInt(limit),
          offset: (parseInt(page) - 1) * parseInt(limit)
        });

        res.json({
          success: true,
          data: {
            reviews: reviews.rows,
            total: reviews.count,
            page: parseInt(page),
            totalPages: Math.ceil(reviews.count / parseInt(limit))
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to get reviews'
        });
      }
    });

    // Create a review
    router.post('/', async (req, res) => {
      try {
        const { productId, rating, title, comment } = req.body;
        const userId = req.user.id; // Assuming authentication middleware

        // Check if user has already reviewed this product
        const existingReview = await this.Review.findOne({
          where: { productId, userId }
        });

        if (existingReview) {
          return res.status(400).json({
            success: false,
            error: 'You have already reviewed this product'
          });
        }

        const review = await this.Review.create({
          productId,
          userId,
          rating,
          title,
          comment
        });

        res.json({
          success: true,
          data: review
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to create review'
        });
      }
    });

    // Update a review
    router.put('/:reviewId', async (req, res) => {
      try {
        const { reviewId } = req.params;
        const { rating, title, comment } = req.body;
        const userId = req.user.id;

        const review = await this.Review.findOne({
          where: { id: reviewId, userId }
        });

        if (!review) {
          return res.status(404).json({
            success: false,
            error: 'Review not found'
          });
        }

        await review.update({
          rating,
          title,
          comment
        });

        res.json({
          success: true,
          data: review
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to update review'
        });
      }
    });

    // Delete a review
    router.delete('/:reviewId', async (req, res) => {
      try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await this.Review.findOne({
          where: { id: reviewId, userId }
        });

        if (!review) {
          return res.status(404).json({
            success: false,
            error: 'Review not found'
          });
        }

        await review.destroy();

        res.json({
          success: true,
          message: 'Review deleted successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to delete review'
        });
      }
    });

    // Mark review as helpful
    router.post('/:reviewId/helpful', async (req, res) => {
      try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await this.Review.findByPk(reviewId);
        if (!review) {
          return res.status(404).json({
            success: false,
            error: 'Review not found'
          });
        }

        // Check if user already marked as helpful
        const helpfulRecord = await this.db.models.ReviewHelpful.findOne({
          where: { reviewId, userId }
        });

        if (helpfulRecord) {
          await helpfulRecord.destroy();
          review.helpfulCount = Math.max(0, review.helpfulCount - 1);
        } else {
          await this.db.models.ReviewHelpful.create({
            reviewId,
            userId
          });
          review.helpfulCount += 1;
        }

        await review.save();

        res.json({
          success: true,
          data: { helpfulCount: review.helpfulCount }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to mark review as helpful'
        });
      }
    });

    return [{
      path: '/api/reviews',
      router,
      middleware: []
    }];
  }

  /**
   * Get review middleware
   */
  getMiddleware() {
    return [];
  }

  /**
   * Get review models
   */
  getModels() {
    const { DataTypes } = require('sequelize');
    const { sequelize } = require('../../../config/database');

    // Create ReviewHelpful model for tracking helpful votes
    const ReviewHelpful = sequelize.define('ReviewHelpful', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      reviewId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'reviews',
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    }, {
      tableName: 'review_helpful',
      indexes: [
        { fields: ['reviewId'] },
        { fields: ['userId'] },
        { unique: true, fields: ['reviewId', 'userId'] }
      ]
    });

    return {
      Review: this.Review,
      ReviewHelpful
    };
  }

  /**
   * Run migrations for reviews plugin
   */
  async runMigrations() {
    // Add averageRating and reviewCount columns to products table
    const { sequelize } = require('../../../config/database');
    
    try {
      await sequelize.query(`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,1),
        ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0
      `);
    } catch (error) {
      console.error('Error running reviews migrations:', error);
    }
  }

  /**
   * Plugin-specific installation
   */
  async onInstall() {
    console.log('Reviews plugin installed');
  }

  /**
   * Plugin-specific uninstallation
   */
  async onUninstall() {
    console.log('Reviews plugin uninstalled');
  }
}

module.exports = ReviewsPlugin; 