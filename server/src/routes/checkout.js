const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, OrderItem, Product, ProductVariant, User, Address, Cart } = require('../models');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const settingsManager = require('../utils/settings');

const router = express.Router();

/**
 * @route   POST /api/checkout/calculate
 * @desc    Calculate order totals and shipping
 * @access  Private
 */
router.post('/calculate', optionalAuth, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isUUID().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.variantId').optional().isUUID(),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('billingAddress').optional().isObject(),
  body('couponCode').optional().trim()
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

    const { items, shippingAddress = {}, billingAddress = {}, couponCode } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    let totalItems = 0;
    const calculatedItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          error: `Product ${item.productId} not found or inactive`
        });
      }

      let variant = null;
      if (item.variantId) {
        variant = await ProductVariant.findOne({
          where: { id: item.variantId, productId: item.productId }
        });
        if (!variant) {
          return res.status(400).json({
            success: false,
            error: `Product variant ${item.variantId} not found`
          });
        }
      }

      // Check stock
      const availableQuantity = variant ? variant.quantity : product.quantity;
      if (product.trackQuantity && availableQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for product ${product.name}`
        });
      }

      const rawPrice = variant ? variant.price : product.price;
      const price = typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice || 0);
      const total = price * Number(item.quantity || 0);
      subtotal += total;
      totalItems += item.quantity;

      calculatedItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price,
        total,
        productName: product.name,
        variantName: variant ? variant.name : null,
        sku: variant ? variant.sku : product.sku,
        weight: variant ? variant.weight : product.weight,
        image: product.images && product.images.length > 0 ? product.images[0].url : null
      });
    }

    // Calculate shipping
    const shippingAmount = await calculateShipping(calculatedItems, shippingAddress);

    // Get tax settings
    const taxEnabled = await settingsManager.isTaxEnabled();
    const taxRate = await settingsManager.getTaxRate();
    
    // Calculate tax
    const taxAmount = taxEnabled ? (subtotal * (Number(taxRate) / 100)) : 0;

    // Calculate discount (coupon logic would go here)
    const discountAmount = 0; // Placeholder for coupon logic

    // Calculate total
    const total = subtotal + taxAmount + shippingAmount - discountAmount;

    res.json({
      success: true,
      data: {
        items: calculatedItems,
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        total,
        totalItems,
        currency: 'USD'
      }
    });
  } catch (error) {
    console.error('Calculate checkout error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate checkout'
    });
  }
});

/**
 * @route   POST /api/checkout/create-order
 * @desc    Create order from checkout
 * @access  Private
 */
router.post('/create-order', authenticate, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isUUID().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.variantId').optional().isUUID(),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('billingAddress').optional().isObject(),
  body('paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
  body('notes').optional().trim(),
  body('clearCart').optional().isBoolean()
], async (req, res) => {
  const transaction = await sequelize.transaction();

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
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      clearCart = true
    } = req.body;

    const userId = req.user.id;

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || !product.isActive) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: `Product ${item.productId} not found or inactive`
        });
      }

      let variant = null;
      if (item.variantId) {
        variant = await ProductVariant.findOne({
          where: { id: item.variantId, productId: item.productId }
        });
        if (!variant) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            error: `Product variant ${item.variantId} not found`
          });
        }
      }

      // Check stock
      const availableQuantity = variant ? variant.quantity : product.quantity;
      if (product.trackQuantity && availableQuantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for product ${product.name}`
        });
      }

      const rawPrice = variant ? variant.price : product.price;
      const price = typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice || 0);
      const total = price * Number(item.quantity || 0);
      subtotal += total;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price,
        total,
        productName: product.name,
        variantName: variant ? variant.name : null,
        sku: variant ? variant.sku : product.sku,
        weight: variant ? variant.weight : product.weight,
        attributes: variant ? variant.attributes : null
      });
    }

    // Get tax settings
    const taxEnabled = await settingsManager.isTaxEnabled();
    const taxRate = await settingsManager.getTaxRate();
    
    // Calculate totals
    const taxAmount = taxEnabled ? (subtotal * (Number(taxRate) / 100)) : 0;
    const shippingAmount = await calculateShipping(orderItems, shippingAddress);
    const total = subtotal + taxAmount + shippingAmount;

    // Create order
    const order = await Order.create({
      userId,
      status: 'pending',
      subtotal,
      taxAmount,
      shippingAmount,
      total,
      currency: 'USD',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      paymentMethod,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      notes
    }, { transaction });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      }, { transaction });
    }

    // Update product/variant quantities
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product.trackQuantity) {
        await product.update({
          quantity: product.quantity - item.quantity
        }, { transaction });
      }

      if (item.variantId) {
        const variant = await ProductVariant.findByPk(item.variantId);
        if (variant) {
          await variant.update({
            quantity: variant.quantity - item.quantity
          }, { transaction });
        }
      }
    }

    // Clear cart if requested
    if (clearCart) {
      await Cart.destroy({
        where: { userId },
        transaction
      });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

/**
 * @route   POST /api/checkout/guest
 * @desc    Create guest order (without authentication)
 * @access  Public
 */
router.post('/guest', [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isUUID().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.variantId').optional().isUUID(),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('billingAddress').optional().isObject(),
  body('paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
  body('customerEmail').isEmail().withMessage('Valid customer email is required'),
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('notes').optional().trim()
], async (req, res) => {
  const transaction = await sequelize.transaction();

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
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      customerEmail,
      customerName,
      notes
    } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || !product.isActive) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: `Product ${item.productId} not found or inactive`
        });
      }

      let variant = null;
      if (item.variantId) {
        variant = await ProductVariant.findOne({
          where: { id: item.variantId, productId: item.productId }
        });
        if (!variant) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            error: `Product variant ${item.variantId} not found`
          });
        }
      }

      // Check stock
      const availableQuantity = variant ? variant.quantity : product.quantity;
      if (product.trackQuantity && availableQuantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for product ${product.name}`
        });
      }

      const price = variant ? variant.price : product.price;
      const total = price * item.quantity;
      subtotal += total;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price,
        total,
        productName: product.name,
        variantName: variant ? variant.name : null,
        sku: variant ? variant.sku : product.sku,
        weight: variant ? variant.weight : product.weight,
        attributes: variant ? variant.attributes : null
      });
    }

    // Get tax settings
    const taxEnabled = await settingsManager.isTaxEnabled();
    const taxRate = await settingsManager.getTaxRate();
    
    // Calculate totals
    const taxAmount = taxEnabled ? (subtotal * taxRate / 100) : 0;
    const shippingAmount = await calculateShipping(orderItems, shippingAddress);
    const total = subtotal + taxAmount + shippingAmount;

    // Create order (without userId for guest orders)
    const order = await Order.create({
      status: 'pending',
      subtotal,
      taxAmount,
      shippingAmount,
      total,
      currency: 'USD',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      paymentMethod,
      shippingAddress: {
        ...shippingAddress,
        customerName,
        customerEmail
      },
      billingAddress: billingAddress ? {
        ...billingAddress,
        customerName,
        customerEmail
      } : {
        ...shippingAddress,
        customerName,
        customerEmail
      },
      notes: `${notes || ''}\n[Guest Order] Customer: ${customerName} (${customerEmail})`.trim()
    }, { transaction });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      }, { transaction });
    }

    // Update product/variant quantities
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product.trackQuantity) {
        await product.update({
          quantity: product.quantity - item.quantity
        }, { transaction });
      }

      if (item.variantId) {
        const variant = await ProductVariant.findByPk(item.variantId);
        if (variant) {
          await variant.update({
            quantity: variant.quantity - item.quantity
          }, { transaction });
        }
      }
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Guest order created successfully',
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create guest order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create guest order'
    });
  }
});

/**
 * @route   GET /api/checkout/shipping-options
 * @desc    Get available shipping options
 * @access  Public
 */
router.get('/shipping-options', async (req, res) => {
  try {
    const { address, items } = req.query;

    const shippingOptions = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        description: '5-7 business days',
        price: 10.00,
        currency: 'USD',
        estimatedDays: '5-7',
        available: true
      },
      {
        id: 'express',
        name: 'Express Shipping',
        description: '2-3 business days',
        price: 25.00,
        currency: 'USD',
        estimatedDays: '2-3',
        available: true
      },
      {
        id: 'overnight',
        name: 'Overnight Shipping',
        description: 'Next business day',
        price: 50.00,
        currency: 'USD',
        estimatedDays: '1',
        available: true
      },
      {
        id: 'free',
        name: 'Free Shipping',
        description: 'Free shipping on orders over $100',
        price: 0.00,
        currency: 'USD',
        estimatedDays: '5-7',
        available: true,
        minOrderAmount: 100.00
      }
    ];

    res.json({
      success: true,
      data: shippingOptions
    });
  } catch (error) {
    console.error('Get shipping options error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get shipping options'
    });
  }
});

/**
 * @route   POST /api/checkout/validate-coupon
 * @desc    Validate coupon code
 * @access  Public
 */
router.post('/validate-coupon', [
  body('couponCode').trim().notEmpty().withMessage('Coupon code is required'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Valid subtotal is required')
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

    const { couponCode, subtotal } = req.body;

    // Simulate coupon validation
    // In production, this would check against a coupons table
    const validCoupons = {
      'SAVE10': {
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        minOrderAmount: 50,
        maxDiscount: 100,
        valid: true
      },
      'FREESHIP': {
        code: 'FREESHIP',
        type: 'shipping',
        value: 100,
        minOrderAmount: 0,
        maxDiscount: 25,
        valid: true
      },
      'WELCOME20': {
        code: 'WELCOME20',
        type: 'percentage',
        value: 20,
        minOrderAmount: 100,
        maxDiscount: 50,
        valid: true
      }
    };

    const coupon = validCoupons[couponCode.toUpperCase()];

    if (!coupon || !coupon.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coupon code'
      });
    }

    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        error: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`
      });
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (subtotal * coupon.value) / 100;
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    } else if (coupon.type === 'shipping') {
      discountAmount = Math.min(coupon.value, coupon.maxDiscount);
    }

    res.json({
      success: true,
      data: {
        coupon: coupon,
        discountAmount,
        newSubtotal: subtotal - discountAmount
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate coupon'
    });
  }
});

// Helper function to calculate shipping
async function calculateShipping(items, address) {
  // Get shipping settings
  const flatRate = await settingsManager.getFlatRateShipping();
  const freeShippingThreshold = await settingsManager.getFreeShippingThreshold();
  
  // Calculate subtotal for free shipping check
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.total;
  }
  
  // Check if order qualifies for free shipping
  if (subtotal >= freeShippingThreshold) {
    return 0;
  }
  
  // Simple shipping calculation based on weight and distance
  // In production, this would integrate with shipping APIs
  let totalWeight = 0;
  
  for (const item of items) {
    totalWeight += (item.weight || 0.5) * item.quantity;
  }

  // Base shipping cost from settings
  let shippingCost = flatRate;

  // Add weight-based surcharge
  if (totalWeight > 5) {
    shippingCost += (totalWeight - 5) * 2;
  }

  // Add distance-based surcharge (simplified)
  if (address.country !== 'US') {
    shippingCost += 15.00;
  }

  return Math.round(shippingCost * 100) / 100;
}

module.exports = router; 