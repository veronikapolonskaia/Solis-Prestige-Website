const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  // Accept all files here; validation will occur in route handlers via sharp/mimetype checks
  fileFilter: (req, file, cb) => cb(null, true)
});

// Separate uploader for large videos (up to 200MB by default)
const videoUpload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_VIDEO_SIZE) || 200 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => cb(null, true)
});

/**
 * @route   POST /api/upload/image
 * @desc    Upload an image
 * @access  Private
 */
router.post('/image', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const { width, height } = req.body;
    const uploadPath = process.env.UPLOAD_PATH || 'uploads';
    const ext = path.extname(req.file.originalname) || '.png';
    const baseName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const fileName = `${baseName}${ext}`;

    // Ensure upload directory exists
    await fs.mkdir(uploadPath, { recursive: true });

    // Process image with Sharp and save in original format
    let imageProcessor = sharp(req.file.buffer);

    if (width || height) {
      imageProcessor = imageProcessor.resize(
        width ? parseInt(width) : null,
        height ? parseInt(height) : null,
        {
          fit: 'inside',
          withoutEnlargement: true
        }
      );
    }

    const destOriginal = path.join(uploadPath, fileName);
    await imageProcessor.toFile(destOriginal);
    // Back-compat: also save a .webp copy for any existing links
    const destWebp = path.join(uploadPath, `${baseName}.webp`);
    try {
      await sharp(req.file.buffer).webp({ quality: 80 }).toFile(destWebp);
    } catch (_) {}

    const imageUrl = `${process.env.API_BASE_URL || 'http://localhost:5000/api'}/uploads/${fileName}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        fileName,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    });
  }
});

/**
 * @route   POST /api/upload/product-images
 * @desc    Upload multiple product images
 * @access  Private (Admin)
 */
router.post('/product-images', authenticate, requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No images provided'
      });
    }

    const uploadPath = process.env.UPLOAD_PATH || 'uploads';
    const uploadedImages = [];

    // Ensure upload directory exists
    await fs.mkdir(uploadPath, { recursive: true });

    for (const file of req.files) {
      const ext = path.extname(file.originalname) || '.png';
      const baseName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const fileName = `${baseName}${ext}`;

      let processor = sharp(file.buffer).resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      });

      const destOriginal = path.join(uploadPath, fileName);
      await processor.toFile(destOriginal);
      // Back-compat: also save a .webp copy for any existing links
      const destWebp = path.join(uploadPath, `${baseName}.webp`);
      try {
        await sharp(file.buffer).resize(800, 800, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(destWebp);
      } catch (_) {}

      const imageUrl = `${process.env.API_BASE_URL || 'http://localhost:5000/api'}/uploads/${fileName}`;

      uploadedImages.push({
        url: imageUrl,
        fileName,
        size: file.size,
        mimetype: file.mimetype
      });
    }

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: uploadedImages
    });
  } catch (error) {
    console.error('Upload product images error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload images'
    });
  }
});

/**
 * @route   DELETE /api/upload/:filename
 * @desc    Delete uploaded file
 * @access  Private (Admin)
 */
router.delete('/:filename', authenticate, requireAdmin, async (req, res) => {
  try {
    const { filename } = req.params;
    const uploadPath = process.env.UPLOAD_PATH || 'uploads';
    const filePath = path.join(uploadPath, filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Delete file
    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file'
    });
  }
});

/**
 * @route   POST /api/upload/video
 * @desc    Upload a video file
 * @access  Private (Admin)
 */
router.post('/video', authenticate, requireAdmin, videoUpload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No video file provided' });
    }
    if (!req.file.mimetype.startsWith('video/')) {
      return res.status(400).json({ success: false, error: 'Invalid video file type' });
    }
    const uploadPath = process.env.UPLOAD_PATH || 'uploads';
    const ext = path.extname(req.file.originalname) || '.mp4';
    const baseName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const fileName = `${baseName}${ext}`;
    await fs.mkdir(uploadPath, { recursive: true });
    const dest = path.join(uploadPath, fileName);
    await fs.writeFile(dest, req.file.buffer);
    const url = `${process.env.API_BASE_URL || 'http://localhost:5000/api'}/uploads/${fileName}`;
    res.json({ success: true, data: { url, fileName, size: req.file.size, mimetype: req.file.mimetype } });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ success: false, error: 'Failed to upload video' });
  }
});

/**
 * @route   POST /api/upload/docx-to-html
 * @desc    Convert a DOCX file to HTML
 * @access  Private (Admin)
 */
router.post('/docx-to-html', authenticate, requireAdmin, upload.single('doc'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No document provided' });
    }
    const mammoth = require('mammoth');

    const uploadPath = process.env.UPLOAD_PATH || 'uploads';
    await fs.mkdir(uploadPath, { recursive: true });

    const result = await mammoth.convertToHtml(
      { buffer: req.file.buffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          try {
            const contentType = image.contentType; // e.g. 'image/png'
            const ext = contentType === 'image/png' ? '.png' : contentType === 'image/jpeg' ? '.jpg' : '.png';
            const base64 = await image.read('base64');
            const buffer = Buffer.from(base64, 'base64');

            const baseName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
            const fileName = `${baseName}${ext}`;
            const dest = path.join(uploadPath, fileName);
            await fs.writeFile(dest, buffer);

            const url = `${process.env.API_BASE_URL || 'http://localhost:5000/api'}/uploads/${fileName}`;
            return { src: url };
          } catch (e) {
            // Fallback to inline if upload fails
            const base64 = await image.read('base64');
            return { src: `data:${image.contentType};base64,${base64}` };
          }
        })
      }
    );

    res.json({ success: true, data: { html: result.value } });
  } catch (error) {
    console.error('DOCX convert error:', error);
    res.status(500).json({ success: false, error: 'Failed to convert document' });
  }
});

module.exports = router; 