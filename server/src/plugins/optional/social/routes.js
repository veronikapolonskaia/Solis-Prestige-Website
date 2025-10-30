const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Get share URL for a platform and content
router.get('/share/:platform/:contentType/:contentId', async (req, res) => {
  try {
    const { platform, contentType, contentId } = req.params;
    const { customData } = req.query;
    
    const socialPlugin = req.app.locals.plugins.get('social');
    const parsedCustomData = customData ? JSON.parse(decodeURIComponent(customData)) : {};
    
    const shareUrl = await socialPlugin.generateShareUrl(platform, contentType, parseInt(contentId), parsedCustomData);
    
    res.json({
      success: true,
      data: { shareUrl }
    });
  } catch (error) {
    console.error('Error generating share URL:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating share URL',
      error: error.message
    });
  }
});

// Record a share
router.post('/share', [
  body('platform').isIn(['facebook', 'twitter', 'instagram', 'linkedin', 'pinterest', 'whatsapp']).withMessage('Valid platform is required'),
  body('contentType').isIn(['product', 'category', 'post', 'page']).withMessage('Valid content type is required'),
  body('contentId').isInt().withMessage('Valid content ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { platform, contentType, contentId, userId } = req.body;
    const socialPlugin = req.app.locals.plugins.get('social');
    
    const share = await socialPlugin.recordShare(platform, contentType, parseInt(contentId), userId);
    
    res.json({
      success: true,
      data: share
    });
  } catch (error) {
    console.error('Error recording share:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording share',
      error: error.message
    });
  }
});

// Get share statistics
router.get('/stats/:contentType/:contentId', async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const socialPlugin = req.app.locals.plugins.get('social');
    
    const stats = await socialPlugin.getShareStats(contentType, parseInt(contentId));
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting share stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving share statistics',
      error: error.message
    });
  }
});

// Get social accounts
router.get('/accounts', async (req, res) => {
  try {
    const { platform } = req.query;
    const socialPlugin = req.app.locals.plugins.get('social');
    
    const accounts = await socialPlugin.getSocialAccounts(platform);
    
    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    console.error('Error getting social accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving social accounts',
      error: error.message
    });
  }
});

// Create social account
router.post('/accounts', [
  body('platform').isIn(['facebook', 'twitter', 'instagram', 'linkedin', 'pinterest', 'youtube']).withMessage('Valid platform is required'),
  body('accountName').notEmpty().withMessage('Account name is required'),
  body('accountUrl').isURL().withMessage('Valid account URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const socialPlugin = req.app.locals.plugins.get('social');
    const account = await socialPlugin.createSocialAccount(req.body);
    
    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    console.error('Error creating social account:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating social account',
      error: error.message
    });
  }
});

// Update social account
router.put('/accounts/:id', [
  body('accountName').optional().notEmpty().withMessage('Account name cannot be empty'),
  body('accountUrl').optional().isURL().withMessage('Valid account URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const socialPlugin = req.app.locals.plugins.get('social');
    const account = await socialPlugin.updateSocialAccount(parseInt(id), req.body);
    
    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    console.error('Error updating social account:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating social account',
      error: error.message
    });
  }
});

// Delete social account
router.delete('/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const socialPlugin = req.app.locals.plugins.get('social');
    
    await socialPlugin.deleteSocialAccount(parseInt(id));
    
    res.json({
      success: true,
      message: 'Social account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting social account:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting social account',
      error: error.message
    });
  }
});

// Create social post
router.post('/posts', [
  body('platform').isIn(['facebook', 'twitter', 'instagram', 'linkedin', 'pinterest']).withMessage('Valid platform is required'),
  body('accountId').isInt().withMessage('Valid account ID is required'),
  body('contentType').isIn(['product', 'category', 'post', 'page']).withMessage('Valid content type is required'),
  body('contentId').isInt().withMessage('Valid content ID is required'),
  body('message').optional().isString().withMessage('Message must be a string'),
  body('imageUrl').optional().isURL().withMessage('Valid image URL is required'),
  body('scheduledAt').optional().isISO8601().withMessage('Valid scheduled date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { platform, accountId, contentType, contentId, message, imageUrl, scheduledAt } = req.body;
    const socialPlugin = req.app.locals.plugins.get('social');
    
    const post = await socialPlugin.createSocialPost(
      platform,
      parseInt(accountId),
      contentType,
      parseInt(contentId),
      message,
      imageUrl,
      scheduledAt ? new Date(scheduledAt) : null
    );
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error creating social post:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating social post',
      error: error.message
    });
  }
});

// Publish social post
router.post('/posts/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const socialPlugin = req.app.locals.plugins.get('social');
    
    const post = await socialPlugin.publishSocialPost(parseInt(id));
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error publishing social post:', error);
    res.status(500).json({
      success: false,
      message: 'Error publishing social post',
      error: error.message
    });
  }
});

// Get social posts
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 20, platform, status, contentType } = req.query;
    const socialPlugin = req.app.locals.plugins.get('social');
    
    const where = {};
    if (platform) where.platform = platform;
    if (status) where.status = status;
    if (contentType) where.contentType = contentType;
    
    const posts = await socialPlugin.SocialPost.findAndCountAll({
      where,
      include: [
        {
          model: socialPlugin.SocialAccount,
          as: 'account',
          attributes: ['accountName', 'platform']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({
      success: true,
      data: posts.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: posts.count,
        pages: Math.ceil(posts.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getting social posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving social posts',
      error: error.message
    });
  }
});

// Get social post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const socialPlugin = req.app.locals.plugins.get('social');
    
    const post = await socialPlugin.SocialPost.findByPk(parseInt(id), {
      include: [
        {
          model: socialPlugin.SocialAccount,
          as: 'account',
          attributes: ['accountName', 'platform']
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Social post not found'
      });
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error getting social post:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving social post',
      error: error.message
    });
  }
});

// Update social post
router.put('/posts/:id', [
  body('message').optional().isString().withMessage('Message must be a string'),
  body('imageUrl').optional().isURL().withMessage('Valid image URL is required'),
  body('scheduledAt').optional().isISO8601().withMessage('Valid scheduled date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const socialPlugin = req.app.locals.plugins.get('social');
    
    const post = await socialPlugin.SocialPost.findByPk(parseInt(id));
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Social post not found'
      });
    }
    
    await post.update(req.body);
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error updating social post:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating social post',
      error: error.message
    });
  }
});

// Delete social post
router.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const socialPlugin = req.app.locals.plugins.get('social');
    
    const post = await socialPlugin.SocialPost.findByPk(parseInt(id));
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Social post not found'
      });
    }
    
    await post.destroy();
    
    res.json({
      success: true,
      message: 'Social post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting social post:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting social post',
      error: error.message
    });
  }
});

// Get social statistics
router.get('/stats', async (req, res) => {
  try {
    const socialPlugin = req.app.locals.plugins.get('social');
    
    const [shareCount, accountCount, postCount] = await Promise.all([
      socialPlugin.SocialShare.count(),
      socialPlugin.SocialAccount.count({ where: { isActive: true } }),
      socialPlugin.SocialPost.count()
    ]);
    
    const publishedPostCount = await socialPlugin.SocialPost.count({
      where: { status: 'published' }
    });
    
    const pendingPostCount = await socialPlugin.SocialPost.count({
      where: { status: 'pending' }
    });
    
    res.json({
      success: true,
      data: {
        totalShares: shareCount,
        activeAccounts: accountCount,
        totalPosts: postCount,
        publishedPosts: publishedPostCount,
        pendingPosts: pendingPostCount
      }
    });
  } catch (error) {
    console.error('Error getting social stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving social statistics',
      error: error.message
    });
  }
});

// Get social configuration
router.get('/config', async (req, res) => {
  try {
    const config = {
      supportedPlatforms: ['facebook', 'twitter', 'instagram', 'linkedin', 'pinterest', 'whatsapp', 'youtube'],
      sharePlatforms: ['facebook', 'twitter', 'instagram', 'linkedin', 'pinterest', 'whatsapp'],
      postPlatforms: ['facebook', 'twitter', 'instagram', 'linkedin', 'pinterest'],
      contentTypes: ['product', 'category', 'post', 'page'],
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    };
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error getting social config:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving social configuration',
      error: error.message
    });
  }
});

module.exports = router; 