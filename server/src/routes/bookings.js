const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, OrderItem, Hotel, User } = require('../models');
const { authenticate } = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a hotel booking (order)
 * @access  Authenticated
 */
router.post('/', authenticate, [
  body('hotelId').notEmpty().withMessage('Hotel ID is required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
  body('adults').isInt({ min: 1 }).withMessage('At least 1 adult is required'),
  body('children').optional().isInt({ min: 0 }),
  body('guestName').notEmpty().withMessage('Guest name is required'),
  body('guestEmail').isEmail().withMessage('Valid email is required'),
  body('guestPhone').optional().trim(),
  body('specialRequests').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const {
      hotelId,
      checkIn,
      checkOut,
      adults,
      children = 0,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests
    } = req.body;

    const userId = req.user.id;

    // Fetch hotel
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }

    if (!hotel.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Hotel is not available for booking'
      });
    }

    // Calculate nights and total
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Check-out date must be after check-in date'
      });
    }

    const pricePerNight = parseFloat(hotel.price) || 0;
    const subtotal = pricePerNight * nights;
    const total = subtotal; // For now, no tax/shipping for hotel bookings

    // Get user details for address
    const user = await User.findByPk(userId);
    const guestAddress = {
      fullName: guestName,
      email: guestEmail,
      phone: guestPhone || user?.phone || '',
      line1: hotel.location,
      city: hotel.city,
      state: '',
      postalCode: '',
      country: hotel.country
    };

    // Create order in transaction
    const transaction = await sequelize.transaction();

    try {
      const order = await Order.create({
        userId,
        orderType: 'hotel',
        status: 'pending',
        subtotal,
        taxAmount: 0,
        shippingAmount: 0,
        discountAmount: 0,
        total,
        currency: hotel.currency || 'USD',
        paymentStatus: 'pending',
        paymentMethod: null,
        shippingAddress: guestAddress,
        billingAddress: guestAddress,
        notes: specialRequests || null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        numberOfGuests: adults + children,
        specialRequests: specialRequests || null,
        bookingDetails: {
          adults,
          children,
          hotelSlug: hotel.slug,
          hotelName: hotel.name,
          hotelLocation: hotel.location
        }
      }, { transaction });

      // Create order item
      await OrderItem.create({
        orderId: order.id,
        itemType: 'hotel',
        hotelId: hotel.id,
        productId: null,
        quantity: nights,
        price: pricePerNight,
        total: subtotal,
        productName: hotel.name,
        sku: `HOTEL-${hotel.slug}`,
        hotelName: hotel.name,
        hotelLocation: hotel.location,
        bookingDates: {
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          nights
        },
        attributes: {
          adults,
          children,
          guests: adults + children
        }
      }, { transaction });

      await transaction.commit();

      // Fetch order with relations
      const orderWithItems = await Order.findByPk(order.id, {
        include: [
          { model: OrderItem, as: 'items' },
          { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }
        ]
      });

      res.status(201).json({
        success: true,
        data: orderWithItems,
        message: 'Booking created successfully'
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create booking error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/bookings
 * @desc    Get user's bookings
 * @access  Authenticated
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: {
        userId,
        orderType: 'hotel'
      },
      include: [
        { model: OrderItem, as: 'items' },
        { model: Hotel, through: { model: OrderItem, as: 'items' } }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get bookings',
      message: error.message
    });
  }
});

module.exports = router;

