const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Product, Category, ProductImage, ProductVariant } = require('../models');
const slugify = require('slugify');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, search, and pagination
 * @access  Public
 */
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('category').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('sortBy').optional().isIn(['name', 'price', 'createdAt', 'rating']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('inStock').optional().isBoolean()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      inStock
    } = req.query;

    // Build where clause
    const where = {
      isActive: true
    };

    // Search functionality
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { shortDescription: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Price filtering
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    // Stock filtering
    if (inStock === 'true') {
      where[Op.or] = [
        { trackQuantity: false },
        { quantity: { [Op.gt]: 0 } }
      ];
    }

    // Category filtering
    let categoryFilter = {};
    if (category) {
      categoryFilter = {
        model: Category,
        as: 'category',
        where: { slug: category }
      };
    }

    // Build include clause
    const include = [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      },
      {
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'url', 'altText', 'isMain'],
        where: { isMain: true },
        required: false
      }
    ];

    if (category) {
      include[0] = categoryFilter;
    }

    // Execute query
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      distinct: true
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get products'
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'description']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'url', 'altText', 'sortOrder', 'isMain'],
          order: [['sortOrder', 'ASC']]
        },
        {
          model: ProductVariant,
          as: 'variants',
          attributes: ['id', 'name', 'sku', 'price', 'quantity', 'image', 'attributes'],
          where: { quantity: { [Op.gt]: 0 } }
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get product'
    });
  }
});

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Get single product by slug
 * @access  Public
 */
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      where: { slug, isActive: true },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'description']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'url', 'altText', 'sortOrder', 'isMain'],
          order: [['sortOrder', 'ASC']]
        },
        {
          model: ProductVariant,
          as: 'variants',
          attributes: ['id', 'name', 'sku', 'price', 'quantity', 'image', 'attributes']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get product'
    });
  }
});

/**
 * @route   POST /api/products
 * @desc    Create a new product (Admin only)
 * @access  Private (Admin)
 */
router.post('/', authenticate, requireAdmin, [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').optional().trim(),
  body('shortDescription').optional().trim(),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('comparePrice').optional().isFloat({ min: 0 }),
  body('costPrice').optional().isFloat({ min: 0 }),
  body('quantity').optional().isInt({ min: 0 }),
  body('weight').optional().isFloat({ min: 0 }),
  body('categoryId').optional().isUUID(),
  body('trackQuantity').optional().isBoolean(),
  body('taxable').optional().isBoolean(),
  body('metaTitle').optional().trim(),
  body('metaDescription').optional().trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const {
      name,
      description,
      shortDescription,
      sku,
      price,
      comparePrice,
      costPrice,
      quantity = 0,
      weight,
      categoryId,
      trackQuantity = true,
      taxable = true,
      metaTitle,
      metaDescription
    } = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ where: { sku } });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        error: 'Product with this SKU already exists'
      });
    }

    // Generate unique slug from name
    const baseSlug = slugify(name || '', { lower: true, strict: true });
    let slug = baseSlug;
    if (!slug || slug.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid product name for slug' });
    }
    let suffix = 1;
    // Ensure uniqueness
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existingWithSlug = await Product.findOne({ where: { slug } });
      if (!existingWithSlug) break;
      slug = `${baseSlug}-${suffix++}`;
    }

    // Create product
    const product = await Product.create({
      name,
      slug,
      description,
      shortDescription,
      sku,
      price,
      comparePrice,
      costPrice,
      quantity,
      weight,
      categoryId,
      trackQuantity,
      taxable,
      metaTitle,
      metaDescription
    });

    // If images provided, save to ProductImage and set first as main
    if (Array.isArray(req.body.images) && req.body.images.length > 0) {
      const imagesPayload = req.body.images.map((img, index) => ({
        productId: product.id,
        url: img.url || img,
        altText: img.altText || name,
        sortOrder: index,
        isMain: index === 0
      }));
      await ProductImage.bulkCreate(imagesPayload);
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product'
    });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id', authenticate, requireAdmin, [
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('shortDescription').optional().trim(),
  body('price').optional().isFloat({ min: 0 }),
  body('comparePrice').optional().isFloat({ min: 0 }),
  body('costPrice').optional().isFloat({ min: 0 }),
  body('quantity').optional().isInt({ min: 0 }),
  body('weight').optional().isFloat({ min: 0 }),
  body('categoryId').optional().isUUID(),
  body('trackQuantity').optional().isBoolean(),
  body('taxable').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('metaTitle').optional().trim(),
  body('metaDescription').optional().trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Find product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Update product
    await product.update(updateData);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product'
    });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Soft delete by setting isActive to false
    await product.update({ isActive: false });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product'
    });
  }
});

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.findAll({
      where: { 
        isActive: true,
        // You can add featured logic here, e.g., featured: true
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'url', 'altText', 'isMain'],
          where: { isMain: true },
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get featured products'
    });
  }
});

/**
 * @route   GET /api/products/related/:id
 * @desc    Get related products
 * @access  Public
 */
router.get('/related/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    // Get the current product
    const currentProduct = await Product.findByPk(id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Get related products from the same category
    const relatedProducts = await Product.findAll({
      where: {
        id: { [Op.ne]: id },
        isActive: true,
        categoryId: currentProduct.categoryId
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'url', 'altText', 'isMain'],
          where: { isMain: true },
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: relatedProducts
    });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get related products'
    });
  }
});

module.exports = router; 