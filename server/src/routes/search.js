const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

// Import models
const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductImage = require('../models/ProductImage');

// Import middleware
const { authenticate, optionalAuth } = require('../middleware/auth');

/**
 * @route   GET /api/search
 * @desc    Search products and categories
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      q = '', // search query
      type = 'all', // 'products', 'categories', 'all'
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'relevance', // 'relevance', 'price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest'
      page = 1,
      limit = 20
    } = req.query;

    const offset = (page - 1) * limit;
    const searchQuery = q.trim();

    // Base search conditions
    const searchConditions = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${searchQuery}%` } },
        { description: { [Op.iLike]: `%${searchQuery}%` } },
        { short_description: { [Op.iLike]: `%${searchQuery}%` } },
        { sku: { [Op.iLike]: `%${searchQuery}%` } }
      ]
    };

    // Price filter
    if (minPrice || maxPrice) {
      searchConditions.price = {};
      if (minPrice) searchConditions.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) searchConditions.price[Op.lte] = parseFloat(maxPrice);
    }

    // Stock filter
    if (inStock === 'true') {
      searchConditions.quantity = { [Op.gt]: 0 };
    }

    // Category filter
    if (category) {
      searchConditions.category_id = category;
    }

    // Active products only
    searchConditions.is_active = true;

    // Sort options
    let order = [];
    switch (sortBy) {
      case 'price_asc':
        order.push(['price', 'ASC']);
        break;
      case 'price_desc':
        order.push(['price', 'DESC']);
        break;
      case 'name_asc':
        order.push(['name', 'ASC']);
        break;
      case 'name_desc':
        order.push(['name', 'DESC']);
        break;
      case 'newest':
        order.push(['created_at', 'DESC']);
        break;
      default:
        // relevance - default sorting
        order.push(['name', 'ASC']);
    }

    let results = {
      products: [],
      categories: [],
      total: 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: 0
    };

    // Search products
    if (type === 'all' || type === 'products') {
      const productQuery = {
        where: searchConditions,
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: ProductImage,
            as: 'images',
            attributes: ['id', 'url', 'alt_text', 'is_main'],
            where: { is_main: true },
            required: false
          }
        ],
        order,
        limit: parseInt(limit),
        offset
      };

      const { count, rows: products } = await Product.findAndCountAll(productQuery);
      
      results.products = products.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.short_description,
        price: product.price,
        compare_price: product.compare_price,
        quantity: product.quantity,
        sku: product.sku,
        category: product.category,
        main_image: product.images?.[0]?.url || null,
        in_stock: product.quantity > 0,
        created_at: product.created_at
      }));

      results.total = count;
      results.totalPages = Math.ceil(count / limit);
    }

    // Search categories
    if (type === 'all' || type === 'categories') {
      const categoryQuery = {
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchQuery}%` } },
            { description: { [Op.iLike]: `%${searchQuery}%` } }
          ],
          is_active: true
        },
        include: [
          {
            model: Category,
            as: 'parent',
            attributes: ['id', 'name', 'slug']
          }
        ],
        order: [['name', 'ASC']],
        limit: 10
      };

      const categories = await Category.findAll(categoryQuery);
      
      results.categories = categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        parent: category.parent,
        product_count: 0 // TODO: Add product count
      }));
    }

    res.json({
      success: true,
      data: results,
      message: `Found ${results.total} results for "${searchQuery}"`
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/search/suggestions
 * @desc    Get search suggestions
 * @access  Public
 */
router.get('/suggestions', async (req, res) => {
  try {
    const { q = '' } = req.query;
    const searchQuery = q.trim();

    if (searchQuery.length < 2) {
      return res.json({
        success: true,
        data: {
          products: [],
          categories: []
        }
      });
    }

    // Get product suggestions
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchQuery}%` } },
          { sku: { [Op.iLike]: `%${searchQuery}%` } }
        ],
        is_active: true
      },
      attributes: ['id', 'name', 'slug', 'sku'],
      limit: 5,
      order: [['name', 'ASC']]
    });

    // Get category suggestions
    const categories = await Category.findAll({
      where: {
        name: { [Op.iLike]: `%${searchQuery}%` },
        is_active: true
      },
      attributes: ['id', 'name', 'slug'],
      limit: 3,
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku
        })),
        categories: categories.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug
        }))
      }
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get search suggestions',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/search/popular
 * @desc    Get popular search terms
 * @access  Public
 */
router.get('/popular', async (req, res) => {
  try {
    // TODO: Implement popular search terms based on search history
    // For now, return some default popular terms
    const popularTerms = [
      'electronics',
      'clothing',
      'books',
      'home',
      'sports'
    ];

    res.json({
      success: true,
      data: popularTerms
    });

  } catch (error) {
    console.error('Popular search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get popular search terms',
      message: error.message
    });
  }
});

module.exports = router; 