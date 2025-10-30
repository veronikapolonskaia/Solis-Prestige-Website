const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, User } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const settingsManager = require('../utils/settings');

const router = express.Router();

/**
 * @route   POST /api/payments/process
 * @desc    Process payment for an order
 * @access  Private
 */
router.post('/process', authenticate, [
  body('orderId').isUUID().withMessage('Valid order ID is required'),
  body('paymentMethod').isIn(['cod', 'credit_card', 'paypal', 'stripe', 'bank_transfer']).withMessage('Valid payment method is required'),
  body('paymentData').optional().isObject().withMessage('Payment data must be an object')
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

    const { orderId, paymentMethod, paymentData } = req.body;
    const userId = req.user.id;

    // Find the order
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Order is already paid'
      });
    }

    let paymentResult = { success: false, message: '' };

    // Check if payment method is enabled
    const isMethodEnabled = await settingsManager.isPaymentMethodEnabled(paymentMethod);
    if (!isMethodEnabled) {
      return res.status(400).json({
        success: false,
        error: `${paymentMethod.toUpperCase()} payments are not enabled`
      });
    }

    // Process payment based on method
    switch (paymentMethod) {
      case 'cod':
        paymentResult = await processCODPayment(order);
        break;
      case 'credit_card':
        paymentResult = await processCreditCardPayment(order, paymentData);
        break;
      case 'paypal':
        paymentResult = await processPayPalPayment(order, paymentData);
        break;
      case 'stripe':
        paymentResult = await processStripePayment(order, paymentData);
        break;
      case 'bank_transfer':
        paymentResult = await processBankTransferPayment(order, paymentData);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Unsupported payment method'
        });
    }

    if (paymentResult.success) {
      // Update order payment status
      await order.update({
        paymentStatus: paymentResult.paymentStatus,
        paymentMethod: paymentMethod,
        ...paymentResult.orderUpdates
      });

      res.json({
        success: true,
        message: paymentResult.message,
        data: {
          orderId: order.id,
          paymentStatus: paymentResult.paymentStatus,
          transactionId: paymentResult.transactionId,
          paymentMethod
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: paymentResult.message
      });
    }
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process payment'
    });
  }
});

/**
 * @route   POST /api/payments/cod/confirm
 * @desc    Confirm COD payment (Admin only)
 * @access  Private (Admin)
 */
router.post('/cod/confirm', authenticate, requireAdmin, [
  body('orderId').isUUID().withMessage('Valid order ID is required'),
  body('receivedAmount').isFloat({ min: 0 }).withMessage('Valid received amount is required'),
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

    const { orderId, receivedAmount, notes } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (order.paymentMethod !== 'cod') {
      return res.status(400).json({
        success: false,
        error: 'Order is not a COD order'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Order is already paid'
      });
    }

    // Check if received amount matches order total
    const expectedAmount = parseFloat(order.total);
    const received = parseFloat(receivedAmount);
    
    if (received < expectedAmount) {
      return res.status(400).json({
        success: false,
        error: `Received amount (${received}) is less than expected amount (${expectedAmount})`
      });
    }

    // Update order payment status
    await order.update({
      paymentStatus: 'paid',
      notes: notes ? `${order.notes || ''}\n[COD Payment Confirmed] ${notes}`.trim() : order.notes
    });

    res.json({
      success: true,
      message: 'COD payment confirmed successfully',
      data: {
        orderId: order.id,
        receivedAmount: received,
        expectedAmount: expectedAmount,
        change: received - expectedAmount
      }
    });
  } catch (error) {
    console.error('Confirm COD payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm COD payment'
    });
  }
});

/**
 * @route   GET /api/payments/methods
 * @desc    Get available payment methods
 * @access  Public
 */
router.get('/methods', async (req, res) => {
  try {
    const paymentSettings = await settingsManager.getPaymentSettings();
    
    const paymentMethods = [
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order',
        icon: '💰',
        enabled: paymentSettings.cash_on_delivery || false,
        requiresOnlinePayment: false,
        processingTime: 'immediate',
        fees: 0,
        minAmount: 0,
        maxAmount: 10000
      },
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay securely with your credit card',
        icon: '💳',
        enabled: paymentSettings.stripe_enabled || false,
        requiresOnlinePayment: true,
        processingTime: 'instant',
        fees: 2.5,
        minAmount: 1,
        maxAmount: 50000
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: '🔵',
        enabled: paymentSettings.paypal_enabled || false,
        requiresOnlinePayment: true,
        processingTime: 'instant',
        fees: 2.9,
        minAmount: 1,
        maxAmount: 10000
      },
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Secure online payment processing',
        icon: '💜',
        enabled: paymentSettings.stripe_enabled || false,
        requiresOnlinePayment: true,
        processingTime: 'instant',
        fees: 2.9,
        minAmount: 0.5,
        maxAmount: 999999
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Transfer money directly to our bank account',
        icon: '🏦',
        enabled: true, // Always enabled as fallback
        requiresOnlinePayment: false,
        processingTime: '1-3 business days',
        fees: 0,
        minAmount: 10,
        maxAmount: 100000
      }
    ];

    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment methods'
    });
  }
});

/**
 * @route   GET /api/payments/orders/:orderId
 * @desc    Get payment information for an order
 * @access  Private
 */
router.get('/orders/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id: orderId, userId },
      attributes: [
        'id', 'orderNumber', 'total', 'currency', 'paymentStatus', 
        'paymentMethod', 'createdAt', 'updatedAt'
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
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        currency: order.currency,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Get payment info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment information'
    });
  }
});

/**
 * @route   POST /api/payments/refund
 * @desc    Process refund for an order (Admin only)
 * @access  Private (Admin)
 */
router.post('/refund', authenticate, requireAdmin, [
  body('orderId').isUUID().withMessage('Valid order ID is required'),
  body('refundAmount').isFloat({ min: 0 }).withMessage('Valid refund amount is required'),
  body('reason').trim().notEmpty().withMessage('Refund reason is required'),
  body('refundMethod').optional().isIn(['original_payment', 'store_credit', 'bank_transfer']).withMessage('Invalid refund method')
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

    const { orderId, refundAmount, reason, refundMethod = 'original_payment' } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Order is not paid'
      });
    }

    if (order.status === 'refunded') {
      return res.status(400).json({
        success: false,
        error: 'Order is already refunded'
      });
    }

    const orderTotal = parseFloat(order.total);
    const refundAmountFloat = parseFloat(refundAmount);

    if (refundAmountFloat > orderTotal) {
      return res.status(400).json({
        success: false,
        error: 'Refund amount cannot exceed order total'
      });
    }

    // Process refund based on original payment method
    let refundResult = { success: false, message: '' };

    switch (order.paymentMethod) {
      case 'cod':
        refundResult = await processCODRefund(order, refundAmountFloat, reason);
        break;
      case 'credit_card':
      case 'paypal':
      case 'stripe':
        refundResult = await processOnlineRefund(order, refundAmountFloat, reason, refundMethod);
        break;
      case 'bank_transfer':
        refundResult = await processBankTransferRefund(order, refundAmountFloat, reason);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Unsupported payment method for refund'
        });
    }

    if (refundResult.success) {
      // Update order status
      const updateData = {
        status: refundAmountFloat === orderTotal ? 'refunded' : order.status,
        notes: `${order.notes || ''}\n[Refund Processed] ${reason} - Amount: ${refundAmountFloat}`.trim()
      };

      await order.update(updateData);

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          orderId: order.id,
          refundAmount: refundAmountFloat,
          refundMethod,
          transactionId: refundResult.transactionId
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: refundResult.message
      });
    }
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process refund'
    });
  }
});

// Payment processing helper functions
async function processCODPayment(order) {
  // COD payments are marked as pending until confirmed by admin
  return {
    success: true,
    paymentStatus: 'pending',
    message: 'COD order created successfully. Payment will be collected upon delivery.',
    transactionId: null,
    orderUpdates: {}
  };
}

async function processCreditCardPayment(order, paymentData) {
  // Simulate credit card payment processing
  // In production, integrate with actual payment gateway
  try {
    // Validate payment data
    if (!paymentData || !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
      return {
        success: false,
        message: 'Invalid credit card information'
      };
    }

    // Simulate payment processing
    const isSuccessful = Math.random() > 0.1; // 90% success rate for demo

    if (isSuccessful) {
      return {
        success: true,
        paymentStatus: 'paid',
        message: 'Credit card payment processed successfully',
        transactionId: `CC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderUpdates: {}
      };
    } else {
      return {
        success: false,
        message: 'Credit card payment failed. Please try again.'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Credit card payment processing error'
    };
  }
}

async function processPayPalPayment(order, paymentData) {
  // Simulate PayPal payment processing
  try {
    if (!paymentData || !paymentData.paypalOrderId) {
      return {
        success: false,
        message: 'Invalid PayPal payment information'
      };
    }

    // Simulate PayPal payment processing
    const isSuccessful = Math.random() > 0.05; // 95% success rate for demo

    if (isSuccessful) {
      return {
        success: true,
        paymentStatus: 'paid',
        message: 'PayPal payment processed successfully',
        transactionId: `PP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderUpdates: {}
      };
    } else {
      return {
        success: false,
        message: 'PayPal payment failed. Please try again.'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'PayPal payment processing error'
    };
  }
}

async function processStripePayment(order, paymentData) {
  // Simulate Stripe payment processing
  try {
    if (!paymentData || !paymentData.paymentIntentId) {
      return {
        success: false,
        message: 'Invalid Stripe payment information'
      };
    }

    // Simulate Stripe payment processing
    const isSuccessful = Math.random() > 0.02; // 98% success rate for demo

    if (isSuccessful) {
      return {
        success: true,
        paymentStatus: 'paid',
        message: 'Stripe payment processed successfully',
        transactionId: `ST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderUpdates: {}
      };
    } else {
      return {
        success: false,
        message: 'Stripe payment failed. Please try again.'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Stripe payment processing error'
    };
  }
}

async function processBankTransferPayment(order, paymentData) {
  // Bank transfer payments are marked as pending until confirmed
  return {
    success: true,
    paymentStatus: 'pending',
    message: 'Bank transfer initiated. Order will be processed once payment is confirmed.',
    transactionId: `BT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    orderUpdates: {}
  };
}

async function processCODRefund(order, refundAmount, reason) {
  // For COD orders, refund is typically given in cash or bank transfer
  return {
    success: true,
    message: 'COD refund processed. Customer will receive cash refund or bank transfer.',
    transactionId: `COD_REFUND_${Date.now()}`,
    orderUpdates: {}
  };
}

async function processOnlineRefund(order, refundAmount, reason, refundMethod) {
  // Simulate online payment refund
  const isSuccessful = Math.random() > 0.05; // 95% success rate for demo

  if (isSuccessful) {
    return {
      success: true,
      message: `Refund processed via ${refundMethod}`,
      transactionId: `REFUND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderUpdates: {}
    };
  } else {
    return {
      success: false,
      message: 'Refund processing failed. Please try again.'
    };
  }
}

async function processBankTransferRefund(order, refundAmount, reason) {
  // Bank transfer refunds are processed manually
  return {
    success: true,
    message: 'Bank transfer refund initiated. Customer will receive refund within 3-5 business days.',
    transactionId: `BT_REFUND_${Date.now()}`,
    orderUpdates: {}
  };
}

module.exports = router; 