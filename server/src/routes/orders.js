const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, OrderItem, Product, ProductVariant, User, Address } = require('../models');
const { renderInvoiceHtml } = require('../utils/invoice');
const settingsManager = require('../utils/settings');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();
let puppeteer;

/**
 * @route   POST /api/orders/inquiry
 * @desc    Public inquiry submission to create a zero-total order record
 * @access  Public
 */
router.post('/inquiry', [
  body('eventType').optional().trim(),
  body('eventDate').optional().trim(),
  body('eventStartTime').optional().trim(),
  body('eventLocationType').optional().trim(),
  body('eventFullAddress').optional().trim(),
  body('preferredLanguage').optional().trim(),
  body('eventEnvironment').optional().trim(),
  body('venueDetails').optional().trim(),
  body('guestAgeRange').optional().trim(),
  body('numberOfGuests').optional(),
  body('partyTheme').optional().trim(),
  body('workingWithPlanner').optional().trim(),
  body('packageInterest').optional(),
  body('productIds').optional(),
  body('contact').optional(),
  body('contact.name').optional().trim(),
  body('contact.email').optional(),
  body('contact.phone').optional().trim()
], async (req, res) => {
  try {
    console.log('Received inquiry data:', JSON.stringify(req.body, null, 2));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, error: 'Validation Error', details: errors.array() });
    }

    const {
      eventType,
      eventDate,
      eventStartTime,
      eventLocationType,
      eventFullAddress,
      preferredLanguage,
      eventEnvironment,
      venueDetails,
      guestAgeRange,
      numberOfGuests,
      partyTheme,
      workingWithPlanner,
      packageInterest = [],
      productIds = [],
      contact = {},
      notes
    } = req.body;

    // Convert package IDs to display names
    const packageDisplayNames = {
      'soft_play': 'Luxe Sensory Soft Play',
      'balloon_arches': 'Luxe Balloon Arches', 
      'furniture': 'Luxe Furniture',
      'activity_kits': 'Luxe Activity Kits',
      'not_sure': 'Not sure yet — help me decide!'
    };
    
    const packageInterestNames = packageInterest.map(id => packageDisplayNames[id] || id);

    // Prepare addresses using actual event information
    const addressPayload = {
      fullName: contact.name || 'Inquiry',
      email: contact.email || null,
      phone: contact.phone || null,
      line1: eventFullAddress || 'Event Location',
      city: 'Event City',
      state: 'Event State', 
      postalCode: '00000',
      country: 'USA'
    };

    // Pre-compute item prices and subtotal from selected products (if any)
    let subtotalFromProducts = 0;
    const itemsToCreate = [];
    for (const pid of Array.isArray(productIds) ? productIds : []) {
      // Load product with variants to determine a non-zero display price
      const product = await Product.findByPk(pid, {
        include: [{ model: ProductVariant, as: 'variants', attributes: ['id', 'price', 'name', 'sku', 'quantity'] }]
      });
      if (!product) continue;
      let unitPrice = Number(product.price) || 0;
      if (!unitPrice && Array.isArray(product.variants) && product.variants.length) {
        const priced = product.variants
          .map(v => ({ v, p: Number(v.price) || 0 }))
          .filter(x => x.p > 0)
          .sort((a, b) => a.p - b.p);
        if (priced.length) unitPrice = priced[0].p;
      }
      subtotalFromProducts += unitPrice;
      itemsToCreate.push({
        product,
        payload: {
          orderId: 'TO_FILL', // temporary; set after order is created
          productId: product.id,
          variantId: null,
          quantity: 1,
          price: unitPrice,
          total: unitPrice,
          productName: product.name,
          variantName: null,
          sku: product.sku || `SKU-${product.id}`,
          weight: product.weight || null,
          attributes: null
        }
      });
    }

    // Create order with computed subtotal; tax/shipping remain 0 for inquiry preview
    const order = await Order.create({
      userId: null,
      status: 'pending',
      subtotal: subtotalFromProducts,
      taxAmount: 0,
      shippingAmount: 0,
      discountAmount: 0,
      total: subtotalFromProducts,
      currency: 'USD',
      paymentStatus: 'pending',
      paymentMethod: 'inquiry',
      shippingAddress: addressPayload,
      billingAddress: addressPayload,
      notes: JSON.stringify({
        type: 'inquiry',
        eventType,
        eventDate,
        eventStartTime,
        eventLocationType,
        eventFullAddress,
        preferredLanguage,
        eventEnvironment,
        venueDetails,
        guestAgeRange,
        numberOfGuests,
        partyTheme,
        workingWithPlanner,
        packageInterest: packageInterestNames,
        productIds,
        contact,
        notes
      })
    });

    // Persist items with the created order id
    for (const item of itemsToCreate) {
      await OrderItem.create({ ...item.payload, orderId: order.id });
    }

    // Finalize totals from items actually created (safety against any rounding/validation)
    try {
      const createdItems = await OrderItem.findAll({ where: { orderId: order.id } });
      const newSubtotal = createdItems.reduce((sum, it) => sum + parseFloat(it.total || 0), 0);
      await order.update({ subtotal: newSubtotal, total: newSubtotal });
    } catch (e) {
      // Non-fatal - keep previously computed values
      console.warn('Inquiry order total recompute failed:', e?.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: { id: order.id, orderNumber: order.orderNumber }
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit inquiry' });
  }
});

/**
 * @route   GET /api/orders
 * @desc    Get orders (all for admin, user's orders for customer)
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, dateRange } = req.query;
    
    // Build where clause
    const where = {};
    
    // If user is not admin, only show their orders
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }
    
    // Add status filter
    if (status) {
      where.status = status;
    }
    
    // Add search filter for order number
    if (search) {
      where.orderNumber = {
        [sequelize.Op.iLike]: `%${search}%`
      };
    }
    
    // Add date range filter
    if (dateRange) {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      if (startDate) {
        where.createdAt = {
          [sequelize.Op.gte]: startDate
        };
      }
    }

        const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'slug']
            },
            {
              model: ProductVariant,
              as: 'variant',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
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
        orders,
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
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get orders'
    });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Build where clause - admins can view any order, customers only their own
    const where = { id };
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const order = await Order.findOne({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'slug', 'description']
            },
            {
              model: ProductVariant,
              as: 'variant',
              attributes: ['id', 'name', 'attributes']
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get order'
    });
  }
});

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', authenticate, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isUUID().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.variantId').optional().isUUID(),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('billingAddress').isObject().withMessage('Billing address is required'),
  body('paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
  body('notes').optional().trim()
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
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes
    } = req.body;

    const userId = req.user.id;

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

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

    // Calculate totals
    const taxAmount = subtotal * 0.1; // 10% tax (configurable)
    const shippingAmount = 10.00; // Fixed shipping (configurable)
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
      paymentStatus: 'pending',
      paymentMethod,
      shippingAddress,
      billingAddress,
      notes
    });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      });
    }

    // Update product/variant quantities
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product.trackQuantity) {
        await product.update({
          quantity: product.quantity - item.quantity
        });
      }

      if (item.variantId) {
        const variant = await ProductVariant.findByPk(item.variantId);
        if (variant) {
          await variant.update({
            quantity: variant.quantity - item.quantity
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

/**
 * @route   PATCH /api/orders/bulk/status
 * @desc    Update multiple orders status (Admin only)
 * @access  Private (Admin)
 */
router.patch('/bulk/status', authenticate, requireAdmin, [
  body('orderIds').isArray({ min: 1 }).withMessage('At least one order ID is required'),
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status')
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

    const { orderIds, status } = req.body;

    // Update all orders
    const updateData = { status };
    
    if (status === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const [updatedCount] = await Order.update(updateData, {
      where: {
        id: orderIds
      }
    });

    res.json({
      success: true,
      message: `Updated ${updatedCount} orders successfully`,
      data: { updatedCount }
    });
  } catch (error) {
    console.error('Bulk update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update orders status'
    });
  }
});

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status (Admin only)
 * @access  Private (Admin)
 */
router.patch('/:id/status', authenticate, requireAdmin, [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status')
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
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Update order status
    const updateData = { status };
    
    if (status === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    await order.update(updateData);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  }
});

/**
 * @route   GET /api/orders/:id/tracking
 * @desc    Get order tracking information
 * @access  Private
 */
router.get('/:id/tracking', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, userId },
      attributes: ['id', 'orderNumber', 'status', 'trackingNumber', 'shippedAt', 'deliveredAt']
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order tracking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get order tracking'
    });
  }
});

/**
 * @route   GET /api/orders/:id/invoice
 * @desc    Get invoice HTML for an order
 * @access  Private (Admin or owner)
 */
router.get('/:id/invoice', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Admin can view any, customer only their own
    const where = { id };
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const order = await Order.findOne({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: OrderItem, as: 'items' }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Use brand details from frontend pages (Contact/About)
    const company = {
      name: 'Deluxe Soiree',
      email: 'info@deluxesoiree.com',
      phone: '(555) 123-4567',
      address: 'New Jersey, USA',
      website: 'deluxesoiree.com',
      tagline: 'Luxury soft play & event rentals',
    };

    const html = renderInvoiceHtml(order.toJSON(), company);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Get invoice HTML error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate invoice' });
  }
});

/**
 * @route   GET /api/orders/:id/invoice.pdf
 * @desc    Get invoice PDF for an order
 * @access  Private (Admin or owner)
 */
router.get('/:id/invoice.pdf', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const where = { id };
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const order = await Order.findOne({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: OrderItem, as: 'items' }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const company = {
      name: 'Deluxe Soiree',
      email: 'info@deluxesoiree.com',
      phone: '(555) 123-4567',
      address: 'New Jersey, USA',
      website: 'deluxesoiree.com',
      tagline: 'Luxury soft play & event rentals',
    };

    const html = renderInvoiceHtml(order.toJSON(), company);

    // Lazy import puppeteer to avoid cold boot penalties
    if (!puppeteer) {
      puppeteer = require('puppeteer');
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.emulateMediaType('print');
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
    });
    await browser.close();

    const filename = `invoice-${order.orderNumber}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-store');
    res.end(pdfBuffer);
  } catch (error) {
    console.error('Get invoice PDF error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate invoice PDF' });
  }
});

/**
 * @route   DELETE /api/orders/bulk
 * @desc    Bulk delete orders (Admin only)
 * @access  Private (Admin)
 */
router.delete('/bulk', authenticate, requireAdmin, async (req, res) => {
  try {
    let { orderIds } = req.body || {};
    if ((!orderIds || orderIds.length === 0) && typeof req.query.ids === 'string') {
      orderIds = req.query.ids.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ success: false, error: 'orderIds array is required' });
    }

    await Order.destroy({ where: { id: orderIds } });
    return res.json({ success: true, message: 'Orders deleted successfully' });
  } catch (error) {
    console.error('Bulk delete orders error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete orders' });
  }
});

// Allow POST as fallback for environments that strip DELETE bodies
router.post('/bulk/delete', authenticate, requireAdmin, async (req, res) => {
  req.query.ids = req.query.ids || '';
  return router.handle({ ...req, method: 'DELETE', url: '/bulk' }, res);
});

module.exports = router; 