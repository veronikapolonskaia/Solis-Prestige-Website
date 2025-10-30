const express = require('express');
const { body, validationResult } = require('express-validator');
const { Address } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/addresses
 * @desc    Get user's addresses
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.findAll({
      where: { userId },
      order: [['isDefault', 'DESC'], ['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get addresses'
    });
  }
});

/**
 * @route   GET /api/addresses/:id
 * @desc    Get single address by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get address'
    });
  }
});

/**
 * @route   POST /api/addresses
 * @desc    Create a new address
 * @access  Private
 */
router.post('/', authenticate, [
  body('type').isIn(['billing', 'shipping']).withMessage('Type must be billing or shipping'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('address1').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode').trim().notEmpty().withMessage('ZIP code is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('address2').optional().trim(),
  body('isDefault').optional().isBoolean()
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
      type,
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      zipCode,
      country,
      phone,
      company,
      isDefault = false
    } = req.body;

    const userId = req.user.id;

    // Create address
    const address = await Address.create({
      userId,
      type,
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      zipCode,
      country,
      phone,
      company,
      isDefault
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create address'
    });
  }
});

/**
 * @route   PUT /api/addresses/:id
 * @desc    Update an address
 * @access  Private
 */
router.put('/:id', authenticate, [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('address1').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
  body('state').optional().trim().notEmpty(),
  body('zipCode').optional().trim().notEmpty(),
  body('country').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('address2').optional().trim(),
  body('isDefault').optional().isBoolean()
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
    const userId = req.user.id;
    const updateData = req.body;

    const address = await Address.findOne({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    await address.update(updateData);

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update address'
    });
  }
});

/**
 * @route   DELETE /api/addresses/:id
 * @desc    Delete an address
 * @access  Private
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    await address.destroy();

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete address'
    });
  }
});

/**
 * @route   PUT /api/addresses/:id/default
 * @desc    Set address as default
 * @access  Private
 */
router.put('/:id/default', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    // Remove default from other addresses of the same type
    await Address.update(
      { isDefault: false },
      {
        where: {
          userId,
          type: address.type,
          id: { [require('sequelize').Op.ne]: id }
        }
      }
    );

    // Set this address as default
    await address.update({ isDefault: true });

    res.json({
      success: true,
      message: 'Address set as default successfully',
      data: address
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set address as default'
    });
  }
});

module.exports = router; 