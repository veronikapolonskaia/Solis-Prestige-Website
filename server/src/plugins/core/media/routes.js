const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const { body, validationResult } = require('express-validator');
const path = require('path');

// Upload single file
router.post('/upload', auth, (req, res) => {
  const pluginManager = req.app.pluginManager;
  const mediaPlugin = pluginManager.plugins.get('media');
  
  if (!mediaPlugin) {
    return res.status(404).json({ message: 'Media plugin not found' });
  }

  mediaPlugin.upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const fileInfo = await mediaPlugin.getFileInfo(req.file.path);
      
      // Generate thumbnail for images
      if (fileInfo.isImage) {
        try {
          await mediaPlugin.generateThumbnail(req.file.path);
        } catch (error) {
          console.error('Error generating thumbnail:', error);
        }
      }

      res.json({
        success: true,
        data: {
          ...fileInfo,
          url: `/uploads/${path.basename(req.file.path)}`,
          thumbnailUrl: fileInfo.isImage ? `/uploads/${path.basename(req.file.path).replace(/\.[^/.]+$/, '_thumb.jpg')}` : null
        }
      });
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      res.status(500).json({ message: 'Error processing file' });
    }
  });
});

// Upload multiple files
router.post('/upload-multiple', auth, (req, res) => {
  const pluginManager = req.app.pluginManager;
  const mediaPlugin = pluginManager.plugins.get('media');
  
  if (!mediaPlugin) {
    return res.status(404).json({ message: 'Media plugin not found' });
  }

  mediaPlugin.upload.array('files', 10)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
      const uploadedFiles = [];
      
      for (const file of req.files) {
        const fileInfo = await mediaPlugin.getFileInfo(file.path);
        
        // Generate thumbnail for images
        if (fileInfo.isImage) {
          try {
            await mediaPlugin.generateThumbnail(file.path);
          } catch (error) {
            console.error('Error generating thumbnail:', error);
          }
        }

        uploadedFiles.push({
          ...fileInfo,
          url: `/uploads/${path.basename(file.path)}`,
          thumbnailUrl: fileInfo.isImage ? `/uploads/${path.basename(file.path).replace(/\.[^/.]+$/, '_thumb.jpg')}` : null
        });
      }

      res.json({
        success: true,
        data: uploadedFiles
      });
    } catch (error) {
      console.error('Error processing uploaded files:', error);
      res.status(500).json({ message: 'Error processing files' });
    }
  });
});

// List all files
router.get('/files', auth, async (req, res) => {
  try {
    const pluginManager = req.app.get('pluginManager');
    const mediaPlugin = pluginManager.plugins.get('media');
    
    if (!mediaPlugin) {
      return res.status(404).json({ message: 'Media plugin not found' });
    }

    const { directory = '' } = req.query;
    const files = await mediaPlugin.listFiles(directory);
    
    // Add URLs to files
    const filesWithUrls = files.map(file => ({
      ...file,
      url: `/uploads/${path.basename(file.path)}`,
      thumbnailUrl: file.isImage ? `/uploads/${path.basename(file.path).replace(/\.[^/.]+$/, '_thumb.jpg')}` : null
    }));

    res.json({
      success: true,
      data: filesWithUrls
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ message: 'Error listing files' });
  }
});

// Get file info
router.get('/files/:filename', auth, async (req, res) => {
  try {
    const { filename } = req.params;
    const pluginManager = req.app.get('pluginManager');
    const mediaPlugin = pluginManager.plugins.get('media');
    
    if (!mediaPlugin) {
      return res.status(404).json({ message: 'Media plugin not found' });
    }

    const filePath = path.join(mediaPlugin.uploadPath, filename);
    const fileInfo = await mediaPlugin.getFileInfo(filePath);
    
    res.json({
      success: true,
      data: {
        ...fileInfo,
        url: `/uploads/${filename}`,
        thumbnailUrl: fileInfo.isImage ? `/uploads/${filename.replace(/\.[^/.]+$/, '_thumb.jpg')}` : null
      }
    });
  } catch (error) {
    console.error('Error getting file info:', error);
    res.status(500).json({ message: 'Error getting file info' });
  }
});

// Process image
router.post('/process-image', auth, [
  body('filename').notEmpty().withMessage('Filename is required'),
  body('options').isObject().withMessage('Options must be an object'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { filename, options } = req.body;
    const pluginManager = req.app.get('pluginManager');
    const mediaPlugin = pluginManager.plugins.get('media');
    
    if (!mediaPlugin) {
      return res.status(404).json({ message: 'Media plugin not found' });
    }

    const filePath = path.join(mediaPlugin.uploadPath, filename);
    const processedPath = await mediaPlugin.processImage(filePath, options);
    const fileInfo = await mediaPlugin.getFileInfo(processedPath);
    
    res.json({
      success: true,
      data: {
        ...fileInfo,
        url: `/uploads/${path.basename(processedPath)}`,
        thumbnailUrl: fileInfo.isImage ? `/uploads/${path.basename(processedPath).replace(/\.[^/.]+$/, '_thumb.jpg')}` : null
      }
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Error processing image' });
  }
});

// Generate thumbnail
router.post('/generate-thumbnail', auth, [
  body('filename').notEmpty().withMessage('Filename is required'),
  body('size').optional().isInt({ min: 50, max: 500 }).withMessage('Size must be between 50 and 500'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { filename, size = 150 } = req.body;
    const pluginManager = req.app.get('pluginManager');
    const mediaPlugin = pluginManager.plugins.get('media');
    
    if (!mediaPlugin) {
      return res.status(404).json({ message: 'Media plugin not found' });
    }

    const filePath = path.join(mediaPlugin.uploadPath, filename);
    const thumbnailPath = await mediaPlugin.generateThumbnail(filePath, size);
    const fileInfo = await mediaPlugin.getFileInfo(thumbnailPath);
    
    res.json({
      success: true,
      data: {
        ...fileInfo,
        url: `/uploads/${path.basename(thumbnailPath)}`
      }
    });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).json({ message: 'Error generating thumbnail' });
  }
});

// Optimize image
router.post('/optimize-image', auth, [
  body('filename').notEmpty().withMessage('Filename is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { filename } = req.body;
    const pluginManager = req.app.get('pluginManager');
    const mediaPlugin = pluginManager.plugins.get('media');
    
    if (!mediaPlugin) {
      return res.status(404).json({ message: 'Media plugin not found' });
    }

    const filePath = path.join(mediaPlugin.uploadPath, filename);
    const optimizedPath = await mediaPlugin.optimizeImage(filePath);
    const fileInfo = await mediaPlugin.getFileInfo(optimizedPath);
    
    res.json({
      success: true,
      data: {
        ...fileInfo,
        url: `/uploads/${path.basename(optimizedPath)}`
      }
    });
  } catch (error) {
    console.error('Error optimizing image:', error);
    res.status(500).json({ message: 'Error optimizing image' });
  }
});

// Delete file
router.delete('/files/:filename', auth, async (req, res) => {
  try {
    const { filename } = req.params;
    const pluginManager = req.app.get('pluginManager');
    const mediaPlugin = pluginManager.plugins.get('media');
    
    if (!mediaPlugin) {
      return res.status(404).json({ message: 'Media plugin not found' });
    }

    const filePath = path.join(mediaPlugin.uploadPath, filename);
    await mediaPlugin.deleteFile(filePath);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// Get media configuration
router.get('/config', auth, async (req, res) => {
  try {
    const pluginManager = req.app.get('pluginManager');
    const mediaPlugin = pluginManager.plugins.get('media');
    
    if (!mediaPlugin) {
      return res.status(404).json({ message: 'Media plugin not found' });
    }

    const config = {
      uploadPath: mediaPlugin.uploadPath,
      allowedTypes: mediaPlugin.allowedTypes,
      maxFileSize: mediaPlugin.maxFileSize,
      maxFileSizeMB: Math.round(mediaPlugin.maxFileSize / 1024 / 1024),
    };

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error getting media config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 