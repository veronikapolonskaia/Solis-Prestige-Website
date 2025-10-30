const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Calculate shipping rates
router.post('/calculate', [
  body('items').isArray().withMessage('Items must be an array'),
  body('address').isObject().withMessage('Address is required'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Valid subtotal is required'),
  body('weight').isFloat({ min: 0 }).withMessage('Valid weight is required')
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

    const { items, address, subtotal, weight } = req.body;
    const pluginManager = req.app.pluginManager;
    const shippingPlugin = pluginManager.getPlugin('shipping');
    
    const orderData = { items, subtotal, weight };
    const rates = await shippingPlugin.calculateShippingRates(orderData, address);
    
    res.json({
      success: true,
      data: rates
    });
  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating shipping rates',
      error: error.message
    });
  }
});

// Get shipping methods
router.get('/methods', async (req, res) => {
  try {
    const { active } = req.query;
    const pluginManager = req.app.pluginManager;
    const shippingPlugin = pluginManager.getPlugin('shipping');
    
    const where = {};
    if (active !== undefined) {
      where.isActive = active === 'true';
    }
    
    const methods = await shippingPlugin.ShippingMethod.findAll({
      where,
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: methods
    });
  } catch (error) {
    console.error('Error getting shipping methods:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving shipping methods',
      error: error.message
    });
  }
});

// Create shipping method
router.post('/methods', [
  body('name').notEmpty().withMessage('Name is required'),
  body('code').notEmpty().withMessage('Code is required'),
  body('type').isIn(['flat_rate', 'free', 'weight_based', 'price_based', 'custom']).withMessage('Valid type is required')
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

    const pluginManager = req.app.pluginManager;
    const shippingPlugin = pluginManager.getPlugin('shipping');
    const method = await shippingPlugin.createShippingMethod(req.body);
    
    res.json({
      success: true,
      data: method
    });
  } catch (error) {
    console.error('Error creating shipping method:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shipping method',
      error: error.message
    });
  }
});

// Update shipping method
router.put('/methods/:id', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('type').optional().isIn(['flat_rate', 'free', 'weight_based', 'price_based', 'custom']).withMessage('Valid type is required')
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
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    const method = await shippingPlugin.updateShippingMethod(parseInt(id), req.body);
    
    res.json({
      success: true,
      data: method
    });
  } catch (error) {
    console.error('Error updating shipping method:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shipping method',
      error: error.message
    });
  }
});

// Delete shipping method
router.delete('/methods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    
    await shippingPlugin.deleteShippingMethod(parseInt(id));
    
    res.json({
      success: true,
      message: 'Shipping method deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shipping method:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting shipping method',
      error: error.message
    });
  }
});

// Get shipping zones
router.get('/zones', async (req, res) => {
  try {
    const { active } = req.query;
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    
    const where = {};
    if (active !== undefined) {
      where.isActive = active === 'true';
    }
    
    const zones = await shippingPlugin.ShippingZone.findAll({
      where,
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: zones
    });
  } catch (error) {
    console.error('Error getting shipping zones:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving shipping zones',
      error: error.message
    });
  }
});

// Create shipping zone
router.post('/zones', [
  body('name').notEmpty().withMessage('Name is required'),
  body('countries').isArray().withMessage('Countries must be an array')
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

    const shippingPlugin = req.app.locals.plugins.get('shipping');
    const zone = await shippingPlugin.createShippingZone(req.body);
    
    res.json({
      success: true,
      data: zone
    });
  } catch (error) {
    console.error('Error creating shipping zone:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shipping zone',
      error: error.message
    });
  }
});

// Update shipping zone
router.put('/zones/:id', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('countries').optional().isArray().withMessage('Countries must be an array')
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
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    const zone = await shippingPlugin.updateShippingZone(parseInt(id), req.body);
    
    res.json({
      success: true,
      data: zone
    });
  } catch (error) {
    console.error('Error updating shipping zone:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shipping zone',
      error: error.message
    });
  }
});

// Delete shipping zone
router.delete('/zones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    
    await shippingPlugin.deleteShippingZone(parseInt(id));
    
    res.json({
      success: true,
      message: 'Shipping zone deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shipping zone:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting shipping zone',
      error: error.message
    });
  }
});

// Get shipping rates
router.get('/rates', async (req, res) => {
  try {
    const { page = 1, limit = 20, methodId, zoneId, active } = req.query;
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    
    const where = {};
    if (methodId) where.methodId = parseInt(methodId);
    if (zoneId) where.zoneId = parseInt(zoneId);
    if (active !== undefined) where.isActive = active === 'true';
    
    const rates = await shippingPlugin.ShippingRate.findAndCountAll({
      where,
      include: [
        {
          model: shippingPlugin.ShippingMethod,
          as: 'method',
          attributes: ['name', 'code', 'type']
        },
        {
          model: shippingPlugin.ShippingZone,
          as: 'zone',
          attributes: ['name', 'countries']
        }
      ],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({
      success: true,
      data: rates.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: rates.count,
        pages: Math.ceil(rates.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getting shipping rates:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving shipping rates',
      error: error.message
    });
  }
});

// Create shipping rate
router.post('/rates', [
  body('methodId').isInt().withMessage('Valid method ID is required'),
  body('zoneId').isInt().withMessage('Valid zone ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('cost').isFloat({ min: 0 }).withMessage('Valid cost is required')
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

    const shippingPlugin = req.app.locals.plugins.get('shipping');
    const rate = await shippingPlugin.ShippingRate.create(req.body);
    
    res.json({
      success: true,
      data: rate
    });
  } catch (error) {
    console.error('Error creating shipping rate:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shipping rate',
      error: error.message
    });
  }
});

// Update shipping rate
router.put('/rates/:id', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Valid cost is required')
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
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    
    const rate = await shippingPlugin.ShippingRate.findByPk(parseInt(id));
    if (!rate) {
      return res.status(404).json({
        success: false,
        message: 'Shipping rate not found'
      });
    }
    
    await rate.update(req.body);
    
    res.json({
      success: true,
      data: rate
    });
  } catch (error) {
    console.error('Error updating shipping rate:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shipping rate',
      error: error.message
    });
  }
});

// Delete shipping rate
router.delete('/rates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    
    const rate = await shippingPlugin.ShippingRate.findByPk(parseInt(id));
    if (!rate) {
      return res.status(404).json({
        success: false,
        message: 'Shipping rate not found'
      });
    }
    
    await rate.destroy();
    
    res.json({
      success: true,
      message: 'Shipping rate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shipping rate:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting shipping rate',
      error: error.message
    });
  }
});

// Get shipping rules
router.get('/rules', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, active } = req.query;
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    
    const where = {};
    if (type) where.type = type;
    if (active !== undefined) where.isActive = active === 'true';
    
    const rules = await shippingPlugin.ShippingRule.findAndCountAll({
      where,
      order: [['priority', 'DESC'], ['name', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({
      success: true,
      data: rules.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: rules.count,
        pages: Math.ceil(rules.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getting shipping rules:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving shipping rules',
      error: error.message
    });
  }
});

// Create shipping rule
router.post('/rules', [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').isIn(['free_shipping', 'discount', 'surcharge', 'restriction']).withMessage('Valid type is required'),
  body('condition').isIn(['order_total', 'order_weight', 'product_count', 'category', 'product']).withMessage('Valid condition is required'),
  body('operator').isIn(['equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal', 'contains', 'not_contains']).withMessage('Valid operator is required'),
  body('value').notEmpty().withMessage('Value is required'),
  body('action').isIn(['free_shipping', 'discount_amount', 'discount_percentage', 'surcharge_amount', 'surcharge_percentage', 'hide_method']).withMessage('Valid action is required')
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

    const shippingPlugin = req.app.locals.plugins.get('shipping');
    const rule = await shippingPlugin.ShippingRule.create(req.body);
    
    res.json({
      success: true,
      data: rule
    });
  } catch (error) {
    console.error('Error creating shipping rule:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shipping rule',
      error: error.message
    });
  }
});

// Update shipping rule
router.put('/rules/:id', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('actionValue').optional().isFloat({ min: 0 }).withMessage('Valid action value is required')
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
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    
    const rule = await shippingPlugin.ShippingRule.findByPk(parseInt(id));
    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Shipping rule not found'
      });
    }
    
    await rule.update(req.body);
    
    res.json({
      success: true,
      data: rule
    });
  } catch (error) {
    console.error('Error updating shipping rule:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shipping rule',
      error: error.message
    });
  }
});

// Delete shipping rule
router.delete('/rules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    
    const rule = await shippingPlugin.ShippingRule.findByPk(parseInt(id));
    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Shipping rule not found'
      });
    }
    
    await rule.destroy();
    
    res.json({
      success: true,
      message: 'Shipping rule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shipping rule:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting shipping rule',
      error: error.message
    });
  }
});

// Get shipping statistics
router.get('/stats', async (req, res) => {
  try {
    const shippingPlugin = req.app.locals.plugins.get('shipping');
    
    const [methodCount, zoneCount, rateCount, ruleCount] = await Promise.all([
      shippingPlugin.ShippingMethod.count(),
      shippingPlugin.ShippingZone.count(),
      shippingPlugin.ShippingRate.count(),
      shippingPlugin.ShippingRule.count()
    ]);
    
    const activeMethodCount = await shippingPlugin.ShippingMethod.count({
      where: { isActive: true }
    });
    
    const activeZoneCount = await shippingPlugin.ShippingZone.count({
      where: { isActive: true }
    });
    
    const activeRateCount = await shippingPlugin.ShippingRate.count({
      where: { isActive: true }
    });
    
    const activeRuleCount = await shippingPlugin.ShippingRule.count({
      where: { isActive: true }
    });
    
    res.json({
      success: true,
      data: {
        totalMethods: methodCount,
        activeMethods: activeMethodCount,
        totalZones: zoneCount,
        activeZones: activeZoneCount,
        totalRates: rateCount,
        activeRates: activeRateCount,
        totalRules: ruleCount,
        activeRules: activeRuleCount
      }
    });
  } catch (error) {
    console.error('Error getting shipping stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving shipping statistics',
      error: error.message
    });
  }
});

// Get shipping configuration
router.get('/config', async (req, res) => {
  try {
    const config = {
      methodTypes: ['flat_rate', 'free', 'weight_based', 'price_based', 'custom'],
      ruleTypes: ['free_shipping', 'discount', 'surcharge', 'restriction'],
      conditions: ['order_total', 'order_weight', 'product_count', 'category', 'product'],
      operators: ['equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal', 'contains', 'not_contains'],
      actions: ['free_shipping', 'discount_amount', 'discount_percentage', 'surcharge_amount', 'surcharge_percentage', 'hide_method']
    };
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error getting shipping config:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving shipping configuration',
      error: error.message
    });
  }
});

module.exports = router; 