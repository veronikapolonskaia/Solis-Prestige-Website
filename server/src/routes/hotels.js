const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Hotel } = require('../models');
const slugify = require('slugify');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/hotels
 * @desc    Get all hotels with filtering, search, and pagination
 * @access  Public
 */
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('city').optional().trim(),
  query('country').optional().trim(),
  query('specialOffer').optional().isBoolean(),
  query('featured').optional().isBoolean(),
  query('popular').optional().isBoolean(),
  query('sortBy').optional().isIn(['name', 'price', 'createdAt', 'displayOrder']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
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
      page = 1,
      limit = 12,
      search,
      city,
      country,
      specialOffer,
      featured,
      popular,
      sortBy = 'displayOrder',
      sortOrder = 'asc'
    } = req.query;

    // Build where clause
    const where = {
      isActive: true
    };

    // Search functionality
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Location filtering
    if (city) {
      where.city = { [Op.iLike]: `%${city}%` };
    }
    if (country) {
      where.country = { [Op.iLike]: `%${country}%` };
    }

    // Feature filtering
    if (specialOffer === 'true') {
      where.specialOffer = true;
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (popular === 'true') {
      where.popular = true;
    }

    // Execute query
    const { count, rows: hotels } = await Hotel.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      distinct: true
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        hotels,
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
    console.error('Get hotels error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get hotels',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/hotels/special-offers
 * @desc    Get hotels with special offers
 * @access  Public
 */
router.get('/special-offers', async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      where: {
        isActive: true,
        specialOffer: true,
        offerValidUntil: {
          [Op.gte]: new Date()
        }
      },
      order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: hotels
    });
  } catch (error) {
    console.error('Get special offers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get special offers',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/hotels/popular
 * @desc    Get popular hotels
 * @access  Public
 */
router.get('/popular', async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      where: {
        isActive: true,
        popular: true
      },
      order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']],
      limit: 12
    });

    res.json({
      success: true,
      data: hotels
    });
  } catch (error) {
    console.error('Get popular hotels error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get popular hotels',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/hotels/:identifier
 * @desc    Get single hotel by slug or ID
 * @access  Public
 */
router.get('/:identifier', optionalAuth, async (req, res) => {
  try {
    const { identifier } = req.params;

    // Check if identifier is a UUID (ID) or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    
    const where = isUUID 
      ? { id: identifier }
      : { slug: identifier, isActive: true };

    const hotel = await Hotel.findOne({ where });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get hotel',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/hotels
 * @desc    Create a new hotel
 * @access  Admin only
 */
router.post('/', authenticate, requireAdmin, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('images').isArray().withMessage('Images must be an array'),
  body('currency').optional().isLength({ min: 3, max: 3 })
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
      name,
      slug,
      location,
      city,
      country,
      description,
      shortDescription,
      images,
      mainImage,
      specialOffer,
      offerTitle,
      offerDetails,
      offerValidUntil,
      offerBookingDeadline,
      offerBlackoutDates,
      price,
      currency,
      vipBenefits,
      hotelDetails,
      featured,
      popular,
      displayOrder,
      isActive,
      metaTitle,
      metaDescription
    } = req.body;

    // Generate slug if not provided
    const hotelSlug = slug || slugify(name, { lower: true, strict: true });

    // Check if slug already exists
    const existingHotel = await Hotel.findOne({ where: { slug: hotelSlug } });
    if (existingHotel) {
      return res.status(400).json({
        success: false,
        error: 'Hotel with this slug already exists'
      });
    }

    const hotel = await Hotel.create({
      name,
      slug: hotelSlug,
      location,
      city,
      country,
      description,
      shortDescription,
      images: images || [],
      mainImage: mainImage || (images && images.length > 0 ? images[0] : null),
      specialOffer: specialOffer || false,
      offerTitle,
      offerDetails,
      offerValidUntil: offerValidUntil ? new Date(offerValidUntil) : null,
      offerBookingDeadline: offerBookingDeadline ? new Date(offerBookingDeadline) : null,
      offerBlackoutDates: offerBlackoutDates || [],
      price,
      currency: currency || 'USD',
      vipBenefits: vipBenefits || [],
      hotelDetails: hotelDetails || {},
      featured: featured || false,
      popular: popular || false,
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
      metaTitle,
      metaDescription
    });

    res.status(201).json({
      success: true,
      data: hotel,
      message: 'Hotel created successfully'
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create hotel',
      message: error.message
    });
  }
});

/**
 * @route   PUT /api/hotels/:id
 * @desc    Update a hotel
 * @access  Admin only
 */
router.put('/:id', authenticate, requireAdmin, [
  body('name').optional().trim().notEmpty(),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('images').optional().isArray()
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

    const { id } = req.params;
    const updateData = req.body;

    const hotel = await Hotel.findByPk(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }

    // Handle slug change
    if (updateData.name && !updateData.slug) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true });
      
      // Check if new slug conflicts with existing hotel
      const existingHotel = await Hotel.findOne({
        where: { slug: updateData.slug, id: { [Op.ne]: id } }
      });
      if (existingHotel) {
        return res.status(400).json({
          success: false,
          error: 'Hotel with this slug already exists'
        });
      }
    }

    // Handle date conversions
    if (updateData.offerValidUntil) {
      updateData.offerValidUntil = new Date(updateData.offerValidUntil);
    }
    if (updateData.offerBookingDeadline) {
      updateData.offerBookingDeadline = new Date(updateData.offerBookingDeadline);
    }

    await hotel.update(updateData);

    res.json({
      success: true,
      data: hotel,
      message: 'Hotel updated successfully'
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update hotel',
      message: error.message
    });
  }
});

/**
 * @route   DELETE /api/hotels/:id
 * @desc    Delete a hotel
 * @access  Admin only
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findByPk(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }

    await hotel.destroy();

    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete hotel',
      message: error.message
    });
  }
});

module.exports = router;

