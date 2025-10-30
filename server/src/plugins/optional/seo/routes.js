const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Get meta tags for a specific page
router.get('/meta/:pageType/:pageId?', async (req, res) => {
  try {
    const { pageType, pageId } = req.params;
    const { customData } = req.query;
    
    const seoPlugin = req.app.locals.plugins.get('seo');
    const parsedCustomData = customData ? JSON.parse(decodeURIComponent(customData)) : {};
    
    const metaTags = await seoPlugin.generateMetaTags(pageType, pageId || null, parsedCustomData);
    
    res.json({
      success: true,
      data: metaTags
    });
  } catch (error) {
    console.error('Error getting meta tags:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving meta tags',
      error: error.message
    });
  }
});

// Create or update meta tags
router.post('/meta', [
  body('pageType').notEmpty().withMessage('Page type is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
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

    const { pageType, pageId, ...metaData } = req.body;
    const seoPlugin = req.app.locals.plugins.get('seo');
    
    const meta = await seoPlugin.updateMetaTags(pageType, pageId, metaData);
    
    res.json({
      success: true,
      data: meta
    });
  } catch (error) {
    console.error('Error creating/updating meta tags:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating/updating meta tags',
      error: error.message
    });
  }
});

// Delete meta tags
router.delete('/meta/:pageType/:pageId?', async (req, res) => {
  try {
    const { pageType, pageId } = req.params;
    const seoPlugin = req.app.locals.plugins.get('seo');
    
    await seoPlugin.deleteMetaTags(pageType, pageId || null);
    
    res.json({
      success: true,
      message: 'Meta tags deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting meta tags:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting meta tags',
      error: error.message
    });
  }
});

// Get sitemap XML
router.get('/sitemap.xml', async (req, res) => {
  try {
    const seoPlugin = req.app.locals.plugins.get('seo');
    const sitemapXML = await seoPlugin.getSitemapXML();
    
    res.set('Content-Type', 'application/xml');
    res.send(sitemapXML);
  } catch (error) {
    console.error('Error generating sitemap XML:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating sitemap',
      error: error.message
    });
  }
});

// Get sitemap entries
router.get('/sitemap', async (req, res) => {
  try {
    const { page = 1, limit = 50, active } = req.query;
    const seoPlugin = req.app.locals.plugins.get('seo');
    
    const where = {};
    if (active !== undefined) {
      where.isActive = active === 'true';
    }
    
    const sitemapEntries = await seoPlugin.Sitemap.findAndCountAll({
      where,
      order: [['priority', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({
      success: true,
      data: sitemapEntries.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: sitemapEntries.count,
        pages: Math.ceil(sitemapEntries.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getting sitemap entries:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving sitemap entries',
      error: error.message
    });
  }
});

// Regenerate sitemap
router.post('/sitemap/regenerate', async (req, res) => {
  try {
    const seoPlugin = req.app.locals.plugins.get('seo');
    await seoPlugin.generateSitemap();
    
    res.json({
      success: true,
      message: 'Sitemap regenerated successfully'
    });
  } catch (error) {
    console.error('Error regenerating sitemap:', error);
    res.status(500).json({
      success: false,
      message: 'Error regenerating sitemap',
      error: error.message
    });
  }
});

// Add sitemap entry
router.post('/sitemap', [
  body('url').notEmpty().isURL().withMessage('Valid URL is required'),
  body('priority').optional().isFloat({ min: 0, max: 1 }).withMessage('Priority must be between 0 and 1'),
  body('changeFreq').optional().isIn(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
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

    const { url, priority = 0.5, changeFreq = 'weekly' } = req.body;
    const seoPlugin = req.app.locals.plugins.get('seo');
    
    const sitemapEntry = await seoPlugin.Sitemap.create({
      url,
      priority,
      changeFreq
    });
    
    res.json({
      success: true,
      data: sitemapEntry
    });
  } catch (error) {
    console.error('Error creating sitemap entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating sitemap entry',
      error: error.message
    });
  }
});

// Update sitemap entry
router.put('/sitemap/:id', [
  body('url').optional().isURL().withMessage('Valid URL is required'),
  body('priority').optional().isFloat({ min: 0, max: 1 }).withMessage('Priority must be between 0 and 1'),
  body('changeFreq').optional().isIn(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
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
    const updateData = req.body;
    const seoPlugin = req.app.locals.plugins.get('seo');
    
    const sitemapEntry = await seoPlugin.Sitemap.findByPk(id);
    if (!sitemapEntry) {
      return res.status(404).json({
        success: false,
        message: 'Sitemap entry not found'
      });
    }
    
    await sitemapEntry.update(updateData);
    
    res.json({
      success: true,
      data: sitemapEntry
    });
  } catch (error) {
    console.error('Error updating sitemap entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating sitemap entry',
      error: error.message
    });
  }
});

// Delete sitemap entry
router.delete('/sitemap/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const seoPlugin = req.app.locals.plugins.get('seo');
    
    const sitemapEntry = await seoPlugin.Sitemap.findByPk(id);
    if (!sitemapEntry) {
      return res.status(404).json({
        success: false,
        message: 'Sitemap entry not found'
      });
    }
    
    await sitemapEntry.destroy();
    
    res.json({
      success: true,
      message: 'Sitemap entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting sitemap entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting sitemap entry',
      error: error.message
    });
  }
});

// Get SEO statistics
router.get('/stats', async (req, res) => {
  try {
    const seoPlugin = req.app.locals.plugins.get('seo');
    
    const [metaCount, sitemapCount] = await Promise.all([
      seoPlugin.SEOMeta.count(),
      seoPlugin.Sitemap.count()
    ]);
    
    const activeMetaCount = await seoPlugin.SEOMeta.count({
      where: { isActive: true }
    });
    
    const activeSitemapCount = await seoPlugin.Sitemap.count({
      where: { isActive: true }
    });
    
    res.json({
      success: true,
      data: {
        totalMetaTags: metaCount,
        activeMetaTags: activeMetaCount,
        totalSitemapEntries: sitemapCount,
        activeSitemapEntries: activeSitemapCount
      }
    });
  } catch (error) {
    console.error('Error getting SEO stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving SEO statistics',
      error: error.message
    });
  }
});

// Get SEO configuration
router.get('/config', async (req, res) => {
  try {
    const config = {
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      defaultTitle: 'Ecommerce Store',
      defaultDescription: 'Discover amazing products at great prices',
      defaultKeywords: 'ecommerce, online shopping, products',
      robotsDefault: 'index, follow',
      sitemapEnabled: true,
      structuredDataEnabled: true
    };
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error getting SEO config:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving SEO configuration',
      error: error.message
    });
  }
});

module.exports = router; 