const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Editorial } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public: list published editorials with pagination
router.get('/', [
  query('page').optional().toInt(),
  query('limit').optional().toInt()
], async (req, res) => {
  try {
    const page = req.query.page > 0 ? req.query.page : 1;
    const limit = req.query.limit > 0 ? req.query.limit : 12;
    const offset = (page - 1) * limit;

    const { rows, count } = await Editorial.findAndCountAll({
      where: { status: 'published' },
      order: [['publishedAt', 'DESC']],
      limit,
      offset,
      attributes: ['id', 'title', 'slug', 'excerpt', 'heroUrl', 'heroType', 'author', 'publishedAt', 'tags']
    });

    res.json({ success: true, data: { items: rows, total: count, page, limit } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch editorials' });
  }
});

// Public: get by slug
router.get('/:slug', async (req, res) => {
  try {
    const editorial = await Editorial.findOne({ where: { slug: req.params.slug, status: 'published' } });
    if (!editorial) return res.status(404).json({ success: false, error: 'Article not found' });
    res.json({ success: true, data: editorial });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch article' });
  }
});

// Admin: create editorial (supports pasted HTML)
router.post('/', authenticate, requireAdmin, [
  body('title').trim().notEmpty(),
  body('slug').trim().notEmpty(),
  body('content').trim().notEmpty(),
  body('excerpt').optional().trim(),
  body('heroUrl').optional().trim(),
  body('heroType').optional().isIn(['image', 'video']),
  body('author').optional().trim(),
  body('tags').optional(),
  body('status').optional().isIn(['draft', 'published'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Validation Error', details: errors.array() });
  }
  try {
    // Normalize data before creating
    let tags = null;
    if (req.body.tags !== undefined && req.body.tags !== null) {
      if (Array.isArray(req.body.tags)) {
        tags = req.body.tags.length > 0 ? req.body.tags : null;
      } else if (typeof req.body.tags === 'string') {
        try {
          const parsed = JSON.parse(req.body.tags);
          tags = Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
        } catch {
          // If not valid JSON, treat as single tag
          tags = req.body.tags.trim() ? [req.body.tags.trim()] : null;
        }
      }
    }
    
    const excerpt = req.body.excerpt && req.body.excerpt.trim() ? req.body.excerpt.trim() : null;
    const heroUrl = req.body.heroUrl && req.body.heroUrl.trim() ? req.body.heroUrl.trim() : null;
    const author = req.body.author && req.body.author.trim() ? req.body.author.trim() : null;
    
    const editorial = await Editorial.create({
      title: req.body.title.trim(),
      slug: req.body.slug.trim(),
      excerpt: excerpt,
      heroUrl: heroUrl,
      heroType: req.body.heroType || 'image',
      content: req.body.content.trim(),
      author: author,
      tags: tags,
      status: req.body.status || 'draft',
      publishedAt: req.body.status === 'published' ? new Date() : null
    });
    res.status(201).json({ success: true, data: editorial });
  } catch (err) {
    if (err?.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, error: 'Slug already exists. Choose a unique slug.' });
    }
    console.error('Create editorial error:', err);
    console.error('Error details:', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create editorial',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Admin: update editorial
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const editorial = await Editorial.findByPk(req.params.id);
    if (!editorial) return res.status(404).json({ success: false, error: 'Article not found' });

    const prevStatus = editorial.status;
    await editorial.update({ ...req.body });
    if (prevStatus !== 'published' && editorial.status === 'published' && !editorial.publishedAt) {
      await editorial.update({ publishedAt: new Date() });
    }
    res.json({ success: true, data: editorial });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update editorial' });
  }
});

// Admin: delete editorial
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const editorial = await Editorial.findByPk(req.params.id);
    if (!editorial) return res.status(404).json({ success: false, error: 'Article not found' });
    await editorial.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete editorial' });
  }
});

module.exports = router;


