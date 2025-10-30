const express = require('express');
const { body, validationResult } = require('express-validator');
const { Category } = require('../models');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories with hierarchical structure
 * @access  Public
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      include: [
        {
          model: Category,
          as: 'children',
          where: { isActive: true },
          required: false
        }
      ],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get categories'
    });
  }
});

/**
 * @route   DELETE /api/categories/bulk
 * @desc    Bulk delete categories by IDs (Admin only)
 * @access  Private (Admin)
 */
async function handleBulkDelete(req, res) {
  try {
    let { ids } = req.body || {};
    let { cascade, force } = req.body || {};

    // Accept ids via query (?ids=a,b,c) or direct body payload
    if ((!ids || (Array.isArray(ids) && ids.length === 0)) && typeof req.query.ids === 'string') {
      ids = req.query.ids.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (!ids && Array.isArray(req.body)) {
      ids = req.body; // support raw array body
    }
    if (typeof req.query.cascade !== 'undefined') cascade = req.query.cascade === 'true' || req.query.cascade === true;
    if (typeof req.query.force !== 'undefined') force = req.query.force === 'true' || req.query.force === true;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'ids array is required' });
    }

    // Optional: validate ids are strings
    if (!ids.every((id) => typeof id === 'string')) {
      ids = ids.map((id) => String(id));
    }

    // If cascade is requested, gather all descendant ids
    let allIds = [...ids];
    if (cascade) {
      const queue = [...ids];
      const visited = new Set(ids);
      while (queue.length > 0) {
        const currentBatch = queue.splice(0, queue.length);
        const children = await Category.findAll({ where: { parentId: currentBatch } });
        for (const child of children) {
          if (!visited.has(child.id)) {
            visited.add(child.id);
            allIds.push(child.id);
            queue.push(child.id);
          }
        }
      }
    } else {
      // Non-cascade: block if any selected categories have children
      const childrenCount = await Category.count({ where: { parentId: ids } });
      if (childrenCount > 0) {
        return res.status(400).json({ success: false, error: 'Cannot delete categories that have subcategories. Use cascade=true to delete with descendants.' });
      }
    }

    // Check if any of the categories (selected or descendants) have products unless force=true
    if (!force) {
      const categories = await Category.findAll({ where: { id: cascade ? allIds : ids } });
      for (const category of categories) {
        const productsCount = await category.countProducts();
        if (productsCount > 0) {
          return res.status(400).json({ success: false, error: 'Cannot delete categories that have products. Pass force=true to override.' });
        }
      }
    }

    // Soft delete all by setting isActive to false
    await Category.update({ isActive: false }, { where: { id: cascade ? allIds : ids } });

    return res.json({ success: true, message: 'Categories deleted successfully' });
  } catch (error) {
    console.error('Bulk delete categories error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete categories' });
  }
}

router.delete('/bulk', authenticate, requireAdmin, handleBulkDelete);
// Allow POST as well to avoid environments that strip DELETE bodies
router.post('/bulk', authenticate, requireAdmin, handleBulkDelete);

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Public
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: Category,
          as: 'children',
          where: { isActive: true },
          required: false
        },
        {
          model: Category,
          as: 'parent',
          required: false
        }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get category'
    });
  }
});

/**
 * @route   GET /api/categories/slug/:slug
 * @desc    Get single category by slug
 * @access  Public
 */
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({
      where: { slug, isActive: true },
      include: [
        {
          model: Category,
          as: 'children',
          where: { isActive: true },
          required: false
        },
        {
          model: Category,
          as: 'parent',
          required: false
        }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get category'
    });
  }
});

/**
 * @route   POST /api/categories
 * @desc    Create a new category (Admin only)
 * @access  Private (Admin)
 */
router.post('/', authenticate, requireAdmin, [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('slug').optional().trim(),
  body('description').optional().trim(),
  body('parentId').optional().isUUID(),
  body('sortOrder').optional().isInt({ min: 0 }),
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
      slug: incomingSlug,
      description,
      parentId,
      sortOrder = 0,
      metaTitle,
      metaDescription
    } = req.body;

    // Fallback: generate slug from name if not provided
    const slug = (incomingSlug && String(incomingSlug).trim().length > 0)
      ? String(incomingSlug).trim()
      : String(name || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

    // Check if parent category exists (if provided)
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          error: 'Parent category not found'
        });
      }
    }

    // Create category
    const category = await Category.create({
      name,
      slug,
      description,
      parentId,
      sortOrder,
      metaTitle,
      metaDescription
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
});

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id', authenticate, requireAdmin, [
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('parentId').optional().isUUID(),
  body('sortOrder').optional().isInt({ min: 0 }),
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

    // Find category
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if parent category exists (if provided)
    if (updateData.parentId) {
      const parentCategory = await Category.findByPk(updateData.parentId);
      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          error: 'Parent category not found'
        });
      }
    }

    // Update category
    await category.update(updateData);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    });
  }
});

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if category has children
    const childrenCount = await Category.count({
      where: { parentId: id }
    });

    if (childrenCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category with subcategories'
      });
    }

    // Check if category has products
    const productsCount = await category.countProducts();
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category with products'
      });
    }

    // Soft delete by setting isActive to false
    await category.update({ isActive: false });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    });
  }
});

/**
 * @route   GET /api/categories/:id/products
 * @desc    Get products in a category
 * @access  Public
 */
router.get('/:id/products', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    const { count, rows: products } = await category.getProducts({
      where: { isActive: true },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    const totalPages = Math.ceil(count / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        category,
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
    console.error('Get category products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get category products'
    });
  }
});

module.exports = router; 