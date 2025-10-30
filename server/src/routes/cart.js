const express = require('express');
const { body, validationResult } = require('express-validator');
const { Cart, Product, ProductVariant, ProductImage } = require('../models');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/cart
 * @desc    Get user's cart items
 * @access  Private
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.json({
        success: true,
        data: {
          items: [],
          total: 0,
          itemCount: 0
        }
      });
    }

    // Build where clause
    const where = {};
    if (userId) {
      where.userId = userId;
    } else if (sessionId) {
      where.sessionId = sessionId;
    }

    const cartRows = await Cart.findAll({
      where,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'price', 'comparePrice', 'isActive'],
          required: false,
          include: [
            {
              model: ProductImage,
              as: 'images',
              attributes: ['url'],
              required: false,
              separate: true,
              limit: 1
            }
          ]
        },
        {
          model: ProductVariant,
          as: 'variant',
          attributes: ['id', 'name', 'price', 'image', 'attributes']
        }
      ]
    });

    // Normalize plain objects to avoid serialization/decimal issues
    const cartItems = cartRows.map((row) => row.toJSON());

    let total = 0;
    let itemCount = 0;
    for (const item of cartItems) {
      const priceValue = item?.variant?.price ?? item?.product?.price ?? 0;
      const price = typeof priceValue === 'string' ? parseFloat(priceValue) : Number(priceValue || 0);
      total += price * (item.quantity || 0);
      itemCount += (item.quantity || 0);
    }

    return res.json({
      success: true,
      data: {
        items: cartItems,
        total: Number(total.toFixed(2)),
        itemCount
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    // Fail-safe response per API philosophy: never block UI on cart read
    return res.json({
      success: true,
      data: { items: [], total: 0, itemCount: 0 }
    });
  }
});

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Private
 */
router.post('/', optionalAuth, [
  body('productId').isUUID().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('variantId').optional().isUUID(),
  body('attributes').optional().isObject()
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

    const { productId, quantity, variantId, attributes } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'User authentication or session ID required'
      });
    }

    // Check if product exists and is active
    const product = await Product.findOne({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check if variant exists (if provided)
    if (variantId) {
      const variant = await ProductVariant.findOne({
        where: { id: variantId, productId }
      });

      if (!variant) {
        return res.status(404).json({
          success: false,
          error: 'Product variant not found'
        });
      }

      // Check stock
      if (variant.quantity < quantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock for this variant'
        });
      }
    } else {
      // Check product stock
      if (product.trackQuantity && product.quantity < quantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock for this product'
        });
      }
    }

    // Check if item already exists in cart
    const existingItem = await Cart.findOne({
      where: {
        productId,
        variantId: variantId || null,
        ...(userId ? { userId } : { sessionId })
      }
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      await existingItem.update({ quantity: newQuantity });
    } else {
      // Create new cart item
      const price = variantId ? 
        (await ProductVariant.findByPk(variantId)).price : 
        product.price;

      await Cart.create({
        userId,
        sessionId,
        productId,
        variantId,
        quantity,
        price,
        attributes
      });
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart'
    });
  }
});

/**
 * @route   PUT /api/cart/:id
 * @desc    Update cart item quantity
 * @access  Private
 */
router.put('/:id', optionalAuth, [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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
    const { quantity } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    // Find cart item
    const cartItem = await Cart.findOne({
      where: {
        id,
        ...(userId ? { userId } : { sessionId })
      },
      include: [
        {
          model: Product,
          as: 'product'
        },
        {
          model: ProductVariant,
          as: 'variant'
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    // Check stock availability
    if (cartItem.variant) {
      if (cartItem.variant.quantity < quantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock for this variant'
        });
      }
    } else {
      if (cartItem.product.trackQuantity && cartItem.product.quantity < quantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock for this product'
        });
      }
    }

    // Update quantity
    await cartItem.update({ quantity });

    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart item'
    });
  }
});

/**
 * @route   DELETE /api/cart/:id
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    const cartItem = await Cart.findOne({
      where: {
        id,
        ...(userId ? { userId } : { sessionId })
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    await cartItem.destroy();

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart'
    });
  }
});

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'User authentication or session ID required'
      });
    }

    const where = {};
    if (userId) {
      where.userId = userId;
    } else if (sessionId) {
      where.sessionId = sessionId;
    }

    await Cart.destroy({ where });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart'
    });
  }
});

/**
 * @route   POST /api/cart/merge
 * @desc    Merge guest cart with user cart after login
 * @access  Private
 */
router.post('/merge', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    // Get guest cart items
    const guestCartItems = await Cart.findAll({
      where: { sessionId },
      include: [
        {
          model: Product,
          as: 'product'
        },
        {
          model: ProductVariant,
          as: 'variant'
        }
      ]
    });

    // Get user cart items
    const userCartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product'
        },
        {
          model: ProductVariant,
          as: 'variant'
        }
      ]
    });

    // Merge items
    for (const guestItem of guestCartItems) {
      const existingUserItem = userCartItems.find(userItem => 
        userItem.productId === guestItem.productId && 
        userItem.variantId === guestItem.variantId
      );

      if (existingUserItem) {
        // Update quantity
        await existingUserItem.update({
          quantity: existingUserItem.quantity + guestItem.quantity
        });
      } else {
        // Create new item for user
        await Cart.create({
          userId,
          productId: guestItem.productId,
          variantId: guestItem.variantId,
          quantity: guestItem.quantity,
          price: guestItem.price,
          attributes: guestItem.attributes
        });
      }

      // Remove guest item
      await guestItem.destroy();
    }

    res.json({
      success: true,
      message: 'Cart merged successfully'
    });
  } catch (error) {
    console.error('Merge cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to merge cart'
    });
  }
});

/**
 * @route   GET /api/cart/count
 * @desc    Get cart item count
 * @access  Private
 */
router.get('/count', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.json({
        success: true,
        data: { count: 0 }
      });
    }

    const where = {};
    if (userId) {
      where.userId = userId;
    } else if (sessionId) {
      where.sessionId = sessionId;
    }

    const cartItems = await Cart.findAll({
      where,
      include: [{
        model: Product,
        as: 'product',
        where: { isActive: true }
      }]
    });

    const count = cartItems.reduce((total, item) => total + item.quantity, 0);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cart count'
    });
  }
});

module.exports = router; 