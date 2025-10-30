const express = require('express');
const router = express.Router();
const { Gallery } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/gallery');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept any standard image mime (covers jpg, jpeg, png, webp, gif, svg, bmp, heic, etc.)
    if (file && typeof file.mimetype === 'string' && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// GET /api/gallery - Get all gallery items (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, status = 'active', page = 1, limit = 20 } = req.query;
    
    const whereClause = { status };
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    if (featured === 'true') {
      whereClause.featured = true;
    }

    const offset = (page - 1) * limit;
    
    const galleries = await Gallery.findAndCountAll({
      where: whereClause,
      order: [['display_order', 'ASC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: galleries.rows,
      pagination: {
        total: galleries.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(galleries.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching galleries',
      error: error.message
    });
  }
});

// GET /api/gallery/categories - Get available categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'birthday', name: 'Birthday Parties', icon: '🎂' },
      { id: 'corporate', name: 'Corporate Events', icon: '🏢' },
      { id: 'wedding', name: 'Weddings', icon: '💒' },
      { id: 'school', name: 'School Events', icon: '🎓' },
      { id: 'festival', name: 'Festivals', icon: '🎪' },
      { id: 'other', name: 'Other Events', icon: '🎉' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// GET /api/gallery/:id - Get single gallery item (public)
router.get('/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.json({
      success: true,
      data: gallery
    });
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery item',
      error: error.message
    });
  }
});

// POST /api/gallery - Create new gallery item (admin only)
router.post('/', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    // Access restricted by requireAdmin

    const { title, description, category, featured, display_order, alt_text, tags, metadata } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imagePath = `/uploads/gallery/${req.file.filename}`;
    const imageUrl = `${baseUrl}${imagePath}`;
    
    // Create thumbnail URL (you can implement thumbnail generation here)
    const thumbnailUrl = imageUrl; // For now, use same image

    const galleryData = {
      title,
      description,
      image_url: imageUrl,
      thumbnail_url: thumbnailUrl,
      category: category || 'other',
      featured: featured === 'true' || featured === true,
      display_order: parseInt(display_order) || 0,
      alt_text: alt_text || title,
      tags: tags ? JSON.parse(tags) : [],
      metadata: metadata ? JSON.parse(metadata) : {},
      status: 'active'
    };

    const gallery = await Gallery.create(galleryData);

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: gallery
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating gallery item',
      error: error.message
    });
  }
});

// PUT /api/gallery/:id - Update gallery item (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    // Access restricted by requireAdmin

    const gallery = await Gallery.findByPk(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    const { title, description, category, featured, display_order, alt_text, tags, metadata, status } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;
    if (display_order !== undefined) updateData.display_order = parseInt(display_order);
    if (alt_text !== undefined) updateData.alt_text = alt_text;
    if (tags !== undefined) updateData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    if (metadata !== undefined) updateData.metadata = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
    if (status !== undefined) updateData.status = status;

    await gallery.update(updateData);

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: gallery
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating gallery item',
      error: error.message
    });
  }
});

// PUT /api/gallery/:id/image - Update gallery item image (admin only)
router.put('/:id/image', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    // Access restricted by requireAdmin

    const gallery = await Gallery.findByPk(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    // Delete old image file
    if (gallery.image_url) {
      try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const oldUrl = new URL(gallery.image_url, baseUrl);
        const oldImagePath = path.join(__dirname, '../../', oldUrl.pathname);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (e) {
        // ignore unlink errors
      }
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imagePath = `/uploads/gallery/${req.file.filename}`;
    const imageUrl = `${baseUrl}${imagePath}`;
    const thumbnailUrl = imageUrl; // For now, use same image

    await gallery.update({
      image_url: imageUrl,
      thumbnail_url: thumbnailUrl
    });

    res.json({
      success: true,
      message: 'Gallery item image updated successfully',
      data: gallery
    });
  } catch (error) {
    console.error('Error updating gallery item image:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating gallery item image',
      error: error.message
    });
  }
});

// DELETE /api/gallery/:id - Delete gallery item (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    // Access restricted by requireAdmin

    const gallery = await Gallery.findByPk(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Delete image file
    if (gallery.image_url) {
      try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imgUrl = new URL(gallery.image_url, baseUrl);
        const imagePath = path.join(__dirname, '../../', imgUrl.pathname);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (e) {
        // ignore unlink errors
      }
    }

    await gallery.destroy();

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery item',
      error: error.message
    });
  }
});

// GET /api/gallery/categories - Get available categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'birthday', name: 'Birthday Parties', icon: '🎂' },
      { id: 'corporate', name: 'Corporate Events', icon: '🏢' },
      { id: 'wedding', name: 'Weddings', icon: '💒' },
      { id: 'school', name: 'School Events', icon: '🎓' },
      { id: 'festival', name: 'Festivals', icon: '🎪' },
      { id: 'other', name: 'Other Events', icon: '🎉' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

module.exports = router;
