const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;

    const where = {};
    if (search) {
      where[require('sequelize').Op.or] = [
        { firstName: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { lastName: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { email: { [require('sequelize').Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) {
      where.role = role;
    }

    // Visibility: by default only active users
    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    } else {
      // No explicit status filter → only active
      where.isActive = true;
    }

    // Email verification filters
    if (status === 'verified') {
      where.emailVerified = true;
    } else if (status === 'unverified') {
      where.emailVerified = false;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    const totalPages = Math.ceil(count / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        users,
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
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users'
    });
  }
});

/**
 * Bulk delete users (admin only)
 * Place BEFORE parameterized routes to avoid /:id catching 'bulk'
 */
async function handleBulkUserDelete(req, res) {
  try {
    let { ids } = req.body || {};
    if ((!ids || ids.length === 0) && typeof req.query.ids === 'string') {
      ids = req.query.ids.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'ids array is required' });
    }

    // Filter out non-ids like literal 'bulk'
    ids = ids.filter((id) => id && id !== 'bulk');

    // Soft delete customers only
    await User.update({ isActive: false }, { where: { id: ids, role: 'customer' } });
    return res.json({ success: true, message: 'Customers deleted successfully' });
  } catch (error) {
    console.error('Bulk delete users error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete customers' });
  }
}

router.delete('/bulk', authenticate, requireAdmin, handleBulkUserDelete);
router.post('/bulk/delete', authenticate, requireAdmin, handleBulkUserDelete);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (Admin only)
 * @access  Private (Admin)
 */
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user'
    });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id', authenticate, requireAdmin, [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('role').optional().isIn(['admin', 'customer']),
  body('isActive').optional().isBoolean(),
  body('emailVerified').optional().isBoolean()
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

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.update(updateData);

    // Remove password from response
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Soft delete by setting isActive to false
    await user.update({ isActive: false });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

module.exports = router; 

// Remove duplicate hard-delete handlers below in favor of soft delete handler defined earlier