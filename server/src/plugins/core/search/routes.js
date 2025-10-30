const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');

// Search products
router.get('/products', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('categoryId').optional().isInt().withMessage('Category ID must be an integer'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('sortBy').optional().isIn(['relevance', 'price', 'name', 'createdAt']).withMessage('Invalid sort option'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('inStock').optional().isBoolean().withMessage('In stock must be true or false'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      q: query,
      page = 1,
      limit = 20,
      categoryId,
      minPrice,
      maxPrice,
      sortBy = 'relevance',
      sortOrder = 'desc',
      inStock
    } = req.query;

    const pluginManager = req.app.get('pluginManager');
    const searchPlugin = pluginManager.plugins.get('search');
    
    if (!searchPlugin) {
      return res.status(404).json({ message: 'Search plugin not found' });
    }

    const searchOptions = {
      page: parseInt(page),
      limit: parseInt(limit),
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy,
      sortOrder,
      inStock: inStock === 'true'
    };

    const results = await searchPlugin.searchProducts(query, searchOptions);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Error searching products' });
  }
});

// Get search suggestions
router.get('/suggestions', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q: query, limit = 5 } = req.query;

    const pluginManager = req.app.get('pluginManager');
    const searchPlugin = pluginManager.plugins.get('search');
    
    if (!searchPlugin) {
      return res.status(404).json({ message: 'Search plugin not found' });
    }

    const suggestions = await searchPlugin.getSearchSuggestions(query, parseInt(limit));

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    res.status(500).json({ message: 'Error getting search suggestions' });
  }
});

// Get search filters
router.get('/filters', async (req, res) => {
  try {
    const { Category, Product } = req.app.get('db').models;

    // Get categories for filtering
    const categories = await Category.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'slug'],
      order: [['name', 'ASC']]
    });

    // Get price range
    const priceStats = await Product.findOne({
      attributes: [
        [req.app.get('db').sequelize.fn('MIN', req.app.get('db').sequelize.col('price')), 'minPrice'],
        [req.app.get('db').sequelize.fn('MAX', req.app.get('db').sequelize.col('price')), 'maxPrice']
      ],
      where: { isActive: true }
    });

    // Get stock status counts
    const stockStats = await Product.findAll({
      attributes: [
        [req.app.get('db').sequelize.fn('COUNT', req.app.get('db').sequelize.col('id')), 'total'],
        [req.app.get('db').sequelize.fn('COUNT', 
          req.app.get('db').sequelize.literal('CASE WHEN quantity > 0 THEN 1 END')), 'inStock']
      ],
      where: { isActive: true }
    });

    const filters = {
      categories,
      priceRange: {
        min: priceStats?.dataValues?.minPrice || 0,
        max: priceStats?.dataValues?.maxPrice || 0
      },
      stockStatus: {
        total: stockStats[0]?.dataValues?.total || 0,
        inStock: stockStats[0]?.dataValues?.inStock || 0,
        outOfStock: (stockStats[0]?.dataValues?.total || 0) - (stockStats[0]?.dataValues?.inStock || 0)
      }
    };

    res.json({
      success: true,
      data: filters
    });
  } catch (error) {
    console.error('Error getting search filters:', error);
    res.status(500).json({ message: 'Error getting search filters' });
  }
});

// Rebuild search index
router.post('/rebuild-index', async (req, res) => {
  try {
    const pluginManager = req.app.get('pluginManager');
    const searchPlugin = pluginManager.plugins.get('search');
    
    if (!searchPlugin) {
      return res.status(404).json({ message: 'Search plugin not found' });
    }

    await searchPlugin.rebuildSearchIndex();

    res.json({
      success: true,
      message: 'Search index rebuilt successfully'
    });
  } catch (error) {
    console.error('Error rebuilding search index:', error);
    res.status(500).json({ message: 'Error rebuilding search index' });
  }
});

// Get search statistics
router.get('/stats', async (req, res) => {
  try {
    const pluginManager = req.app.get('pluginManager');
    const searchPlugin = pluginManager.plugins.get('search');
    
    if (!searchPlugin) {
      return res.status(404).json({ message: 'Search plugin not found' });
    }

    const stats = {
      indexSize: searchPlugin.searchIndex.size,
      totalTerms: Array.from(searchPlugin.searchIndex.values()).flat().length,
      lastRebuild: new Date().toISOString() // In a real app, you'd store this timestamp
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting search stats:', error);
    res.status(500).json({ message: 'Error getting search stats' });
  }
});

// Advanced search with multiple criteria
router.post('/advanced', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      query,
      filters = {},
      page = 1,
      limit = 20,
      sortBy = 'relevance',
      sortOrder = 'desc'
    } = req.body;

    if (!query && Object.keys(filters).length === 0) {
      return res.status(400).json({ message: 'Either query or filters must be provided' });
    }

    const pluginManager = req.app.get('pluginManager');
    const searchPlugin = pluginManager.plugins.get('search');
    
    if (!searchPlugin) {
      return res.status(404).json({ message: 'Search plugin not found' });
    }

    const searchOptions = {
      page: parseInt(page),
      limit: parseInt(limit),
      categoryId: filters.categoryId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortBy,
      sortOrder,
      inStock: filters.inStock
    };

    const results = await searchPlugin.searchProducts(query || '', searchOptions);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error performing advanced search:', error);
    res.status(500).json({ message: 'Error performing advanced search' });
  }
});

module.exports = router; 