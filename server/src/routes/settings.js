const express = require('express');
const { body, validationResult } = require('express-validator');
const { Setting } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/settings
 * @desc    Get all settings (Admin only)
 * @access  Private (Admin)
 */
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const settings = await Setting.getAll();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get settings'
    });
  }
});

/**
 * @route   GET /api/settings/public
 * @desc    Get public settings (no auth required)
 * @access  Public
 */
router.get('/public', async (req, res) => {
  try {
    const settings = await Setting.findAll({
      where: { isPublic: true },
      attributes: ['key', 'value', 'category']
    });
    
    const result = {};
    settings.forEach(setting => {
      if (!result[setting.category]) {
        result[setting.category] = {};
      }
      result[setting.category][setting.key] = setting.getValue();
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get public settings'
    });
  }
});

/**
 * @route   GET /api/settings/:category
 * @desc    Get settings by category (Admin only)
 * @access  Private (Admin)
 */
router.get('/:category', authenticate, requireAdmin, async (req, res) => {
  try {
    const { category } = req.params;
    const settings = await Setting.getByCategory(category);
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings by category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get settings'
    });
  }
});

/**
 * @route   GET /api/settings/key/:key
 * @desc    Get setting by key (Admin only)
 * @access  Private (Admin)
 */
router.get('/key/:key', authenticate, requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const value = await Setting.getByKey(key);
    
    if (value === null) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        key,
        value
      }
    });
  } catch (error) {
    console.error('Get setting by key error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get setting'
    });
  }
});

/**
 * @route   PUT /api/settings/:category
 * @desc    Update settings by category (Admin only)
 * @access  Private (Admin)
 */
router.put('/:category', authenticate, requireAdmin, [
  body().isObject().withMessage('Settings must be an object')
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

    const { category } = req.params;
    const settingsData = req.body;
    
    // Update each setting in the category
    const updatedSettings = {};
    for (const [key, value] of Object.entries(settingsData)) {
      const setting = await Setting.setByKey(key, value, category);
      updatedSettings[key] = setting.getValue();
    }
    
    res.json({
      success: true,
      message: `${category} settings updated successfully`,
      data: updatedSettings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings'
    });
  }
});

/**
 * @route   PUT /api/settings/key/:key
 * @desc    Update setting by key (Admin only)
 * @access  Private (Admin)
 */
router.put('/key/:key', authenticate, requireAdmin, [
  body('value').notEmpty().withMessage('Value is required'),
  body('category').optional().isString().withMessage('Category must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
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

    const { key } = req.params;
    const { value, category, description, isPublic } = req.body;
    
    const setting = await Setting.setByKey(key, value, category, description);
    
    // Update isPublic if provided
    if (typeof isPublic === 'boolean') {
      setting.isPublic = isPublic;
      await setting.save();
    }
    
    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: {
        key: setting.key,
        value: setting.getValue(),
        category: setting.category,
        description: setting.description,
        isPublic: setting.isPublic
      }
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update setting'
    });
  }
});

/**
 * @route   POST /api/settings/initialize
 * @desc    Initialize default settings (Admin only)
 * @access  Private (Admin)
 */
router.post('/initialize', authenticate, requireAdmin, async (req, res) => {
  try {
    await Setting.initializeDefaults();
    
    res.json({
      success: true,
      message: 'Default settings initialized successfully'
    });
  } catch (error) {
    console.error('Initialize settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize settings'
    });
  }
});

/**
 * @route   DELETE /api/settings/key/:key
 * @desc    Delete setting by key (Admin only)
 * @access  Private (Admin)
 */
router.delete('/key/:key', authenticate, requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await Setting.findOne({ where: { key } });
    if (!setting) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found'
      });
    }
    
    await setting.destroy();
    
    res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete setting'
    });
  }
});

/**
 * @route   GET /api/settings/export
 * @desc    Export all settings (Admin only)
 * @access  Private (Admin)
 */
router.get('/export', authenticate, requireAdmin, async (req, res) => {
  try {
    const settings = await Setting.findAll({
      attributes: ['key', 'value', 'category', 'description', 'isPublic']
    });
    
    const exportData = settings.map(setting => ({
      key: setting.key,
      value: setting.getValue(),
      category: setting.category,
      description: setting.description,
      isPublic: setting.isPublic
    }));
    
    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Export settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export settings'
    });
  }
});

/**
 * @route   POST /api/settings/import
 * @desc    Import settings (Admin only)
 * @access  Private (Admin)
 */
router.post('/import', authenticate, requireAdmin, [
  body('settings').isArray().withMessage('Settings must be an array')
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

    const { settings } = req.body;
    const importedSettings = [];
    
    for (const settingData of settings) {
      const { key, value, category, description, isPublic } = settingData;
      
      if (key && value !== undefined) {
        const setting = await Setting.setByKey(key, value, category, description);
        
        if (typeof isPublic === 'boolean') {
          setting.isPublic = isPublic;
          await setting.save();
        }
        
        importedSettings.push({
          key: setting.key,
          value: setting.getValue(),
          category: setting.category
        });
      }
    }
    
    res.json({
      success: true,
      message: `${importedSettings.length} settings imported successfully`,
      data: importedSettings
    });
  } catch (error) {
    console.error('Import settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to import settings'
    });
  }
});

module.exports = router; 