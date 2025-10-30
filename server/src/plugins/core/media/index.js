const PluginBase = require('../../PluginBase');
const sharp = require('sharp');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class MediaPlugin extends PluginBase {
  constructor() {
    super('media', '1.0.0');
    this.uploadPath = process.env.UPLOAD_PATH || './uploads';
    this.allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || ['jpeg', 'jpg', 'png', 'gif', 'webp'];
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 5000000; // 5MB
  }

  async initialize(app, db) {
    super.initialize(app, db);
    
    // Ensure upload directory exists
    await this.ensureUploadDirectory();
    
    // Configure multer for file uploads
    this.configureMulter();
    
    console.log('Media Plugin initialized');
  }

  async ensureUploadDirectory() {
    try {
      await fs.access(this.uploadPath);
    } catch (error) {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  configureMulter() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    });

    const fileFilter = (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().substring(1);
      if (this.allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${ext} is not allowed`), false);
      }
    };

    this.upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: this.maxFileSize
      }
    });
  }

  async processImage(filePath, options = {}) {
    try {
      const {
        width,
        height,
        quality = 80,
        format = 'jpeg',
        resize = true
      } = options;

      let image = sharp(filePath);

      if (resize && (width || height)) {
        image = image.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      const outputPath = filePath.replace(/\.[^/.]+$/, `.${format}`);
      
      await image
        .toFormat(format)
        .jpeg({ quality })
        .toFile(outputPath);

      return outputPath;
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  }

  async generateThumbnail(filePath, size = 150) {
    try {
      const thumbnailPath = filePath.replace(/\.[^/.]+$/, `_thumb.${path.extname(filePath)}`);
      
      await sharp(filePath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      return thumbnailPath;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      throw error;
    }
  }

  async optimizeImage(filePath) {
    try {
      const optimizedPath = filePath.replace(/\.[^/.]+$/, '_optimized.jpg');
      
      await sharp(filePath)
        .jpeg({ 
          quality: 85,
          progressive: true,
          mozjpeg: true
        })
        .toFile(optimizedPath);

      return optimizedPath;
    } catch (error) {
      console.error('Error optimizing image:', error);
      throw error;
    }
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      
      // Also delete thumbnail and optimized versions if they exist
      const basePath = filePath.replace(/\.[^/.]+$/, '');
      const ext = path.extname(filePath);
      
      const thumbnailPath = `${basePath}_thumb${ext}`;
      const optimizedPath = `${basePath}_optimized.jpg`;
      
      try {
        await fs.unlink(thumbnailPath);
      } catch (e) {
        // Thumbnail doesn't exist, ignore
      }
      
      try {
        await fs.unlink(optimizedPath);
      } catch (e) {
        // Optimized version doesn't exist, ignore
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async getFileInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      
      let imageInfo = null;
      if (isImage) {
        const metadata = await sharp(filePath).metadata();
        imageInfo = {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: metadata.size
        };
      }

      return {
        name: path.basename(filePath),
        path: filePath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isImage,
        imageInfo
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      throw error;
    }
  }

  async listFiles(directory = '') {
    try {
      const fullPath = path.join(this.uploadPath, directory);
      const files = await fs.readdir(fullPath);
      
      const fileList = [];
      for (const file of files) {
        const filePath = path.join(fullPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile()) {
          const fileInfo = await this.getFileInfo(filePath);
          fileList.push(fileInfo);
        }
      }
      
      return fileList.sort((a, b) => b.modified - a.modified);
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  getRoutes() {
    return [{
      path: '/api/media',
      router: require('./routes'),
      middleware: []
    }];
  }

  getMiddleware() {
    return [];
  }

  getModels() {
    return {};
  }
}

module.exports = MediaPlugin; 