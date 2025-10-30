const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all coupons
router.get('/', auth, async (req, res) => {
  try {
    const pluginManager = req.app.pluginManager;
    const couponsPlugin = pluginManager.plugins.get('coupons');
    
    if (!couponsPlugin) {
      return res.status(404).json({ message: 'Coupons plugin not found' });
    }

    const { isActive, type } = req.query;
    const filters = {};
    
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    
    if (type) {
      filters.type = type;
    }

    const coupons = await couponsPlugin.getCoupons(filters);

    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    console.error('Error getting coupons:', error);
    res.status(500).json({ message: 'Error getting coupons' });
  }
});

// Get coupon by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const pluginManager = req.app.pluginManager;
    const couponsPlugin = pluginManager.plugins.get('coupons');
    
    if (!couponsPlugin) {
      return res.status(404).json({ message: 'Coupons plugin not found' });
    }

    const coupon = await couponsPlugin.Coupon.findByPk(id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Error getting coupon:', error);
    res.status(500).json({ message: 'Error getting coupon' });
  }
});

// Create new coupon
router.post('/', auth, [
  body('code').isLength({ min: 3, max: 50 }).withMessage('Code must be between 3 and 50 characters'),
  body('name').isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  body('type').isIn(['percentage', 'fixed', 'free_shipping']).withMessage('Invalid coupon type'),
  body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').isISO8601().withMessage('End date must be a valid date'),
  body('minimumOrderAmount').optional().isFloat({ min: 0 }).withMessage('Minimum order amount must be a positive number'),
  body('maximumDiscount').optional().isFloat({ min: 0 }).withMessage('Maximum discount must be a positive number'),
  body('usageLimit').optional().isInt({ min: 1 }).withMessage('Usage limit must be a positive integer'),
  body('perUserLimit').optional().isInt({ min: 1 }).withMessage('Per user limit must be a positive integer'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pluginManager = req.app.pluginManager;
    const couponsPlugin = pluginManager.plugins.get('coupons');
    
    if (!couponsPlugin) {
      return res.status(404).json({ message: 'Coupons plugin not found' });
    }

    const coupon = await couponsPlugin.createCoupon(req.body);

    res.status(201).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    res.status(500).json({ message: 'Error creating coupon' });
  }
});

// Update coupon
router.put('/:id', auth, [
  body('code').optional().isLength({ min: 3, max: 50 }).withMessage('Code must be between 3 and 50 characters'),
  body('name').optional().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  body('type').optional().isIn(['percentage', 'fixed', 'free_shipping']).withMessage('Invalid coupon type'),
  body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('minimumOrderAmount').optional().isFloat({ min: 0 }).withMessage('Minimum order amount must be a positive number'),
  body('maximumDiscount').optional().isFloat({ min: 0 }).withMessage('Maximum discount must be a positive number'),
  body('usageLimit').optional().isInt({ min: 1 }).withMessage('Usage limit must be a positive integer'),
  body('perUserLimit').optional().isInt({ min: 1 }).withMessage('Per user limit must be a positive integer'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const pluginManager = req.app.get('pluginManager');
    const couponsPlugin = pluginManager.plugins.get('coupons');
    
    if (!couponsPlugin) {
      return res.status(404).json({ message: 'Coupons plugin not found' });
    }

    const coupon = await couponsPlugin.updateCoupon(id, req.body);

    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    if (error.message === 'Coupon not found') {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    res.status(500).json({ message: 'Error updating coupon' });
  }
});

// Delete coupon
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const pluginManager = req.app.get('pluginManager');
    const couponsPlugin = pluginManager.plugins.get('coupons');
    
    if (!couponsPlugin) {
      return res.status(404).json({ message: 'Coupons plugin not found' });
    }

    await couponsPlugin.deleteCoupon(id);

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    if (error.message === 'Coupon not found') {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(500).json({ message: 'Error deleting coupon' });
  }
});

// Validate coupon
router.post('/validate', [
  body('code').notEmpty().withMessage('Coupon code is required'),
  body('orderAmount').isFloat({ min: 0 }).withMessage('Order amount must be a positive number'),
  body('products').optional().isArray().withMessage('Products must be an array'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, orderAmount, products = [] } = req.body;
    const userId = req.user?.id;

    const pluginManager = req.app.get('pluginManager');
    const couponsPlugin = pluginManager.plugins.get('coupons');
    
    if (!couponsPlugin) {
      return res.status(404).json({ message: 'Coupons plugin not found' });
    }

    const validation = await couponsPlugin.validateCoupon(code, userId, orderAmount, products);

    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ message: 'Error validating coupon' });
  }
});

// Apply coupon to order
router.post('/:id/apply', auth, [
  body('orderId').isInt().withMessage('Order ID must be an integer'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { orderId } = req.body;
    const userId = req.user.id;

    const pluginManager = req.app.get('pluginManager');
    const couponsPlugin = pluginManager.plugins.get('coupons');
    
    if (!couponsPlugin) {
      return res.status(404).json({ message: 'Coupons plugin not found' });
    }

    // Apply the coupon
    await couponsPlugin.applyCoupon(id, userId);

    res.json({
      success: true,
      message: 'Coupon applied successfully'
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    if (error.message === 'Coupon not found') {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(500).json({ message: 'Error applying coupon' });
  }
});

// Get coupon statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const pluginManager = req.app.get('pluginManager');
    const couponsPlugin = pluginManager.plugins.get('coupons');
    
    if (!couponsPlugin) {
      return res.status(404).json({ message: 'Coupons plugin not found' });
    }

    const coupon = await couponsPlugin.Coupon.findByPk(id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    const stats = {
      usageCount: coupon.usageCount,
      usageLimit: coupon.usageLimit,
      usagePercentage: coupon.usageLimit ? (coupon.usageCount / coupon.usageLimit) * 100 : null,
      isActive: coupon.isActive,
      isExpired: new Date() > coupon.endDate,
      daysUntilExpiry: Math.ceil((new Date(coupon.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting coupon stats:', error);
    res.status(500).json({ message: 'Error getting coupon stats' });
  }
});

// Bulk operations
router.post('/bulk/delete', auth, [
  body('ids').isArray({ min: 1 }).withMessage('At least one coupon ID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ids } = req.body;
    const pluginManager = req.app.get('pluginManager');
    const couponsPlugin = pluginManager.plugins.get('coupons');
    
    if (!couponsPlugin) {
      return res.status(404).json({ message: 'Coupons plugin not found' });
    }

    let deletedCount = 0;
    for (const id of ids) {
      try {
        await couponsPlugin.deleteCoupon(id);
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting coupon ${id}:`, error);
      }
    }

    res.json({
      success: true,
      message: `${deletedCount} coupons deleted successfully`
    });
  } catch (error) {
    console.error('Error performing bulk delete:', error);
    res.status(500).json({ message: 'Error performing bulk delete' });
  }
});

// Toggle coupon status
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const pluginManager = req.app.get('pluginManager');
    const couponsPlugin = pluginManager.plugins.get('coupons');
    
    if (!couponsPlugin) {
      return res.status(404).json({ message: 'Coupons plugin not found' });
    }

    const coupon = await couponsPlugin.Coupon.findByPk(id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await coupon.update({ isActive: !coupon.isActive });

    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    res.status(500).json({ message: 'Error toggling coupon status' });
  }
});

module.exports = router; 