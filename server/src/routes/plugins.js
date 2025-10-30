const express = require('express');
const router = express.Router();

/**
 * Plugin Management Routes
 * Provides API endpoints for managing plugins
 */

// Get all plugins information
router.get('/', (req, res) => {
  try {
    const pluginManager = req.app.pluginManager;
    if (!pluginManager) {
      return res.status(500).json({
        success: false,
        error: 'Plugin manager not available'
      });
    }

    const plugins = pluginManager.getPluginsInfo();
    
    res.json({
      success: true,
      data: plugins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get plugins information'
    });
  }
});

// Get specific plugin information
router.get('/:pluginName', (req, res) => {
  try {
    const { pluginName } = req.params;
    const pluginManager = req.app.pluginManager;
    
    if (!pluginManager) {
      return res.status(500).json({
        success: false,
        error: 'Plugin manager not available'
      });
    }

    const plugin = pluginManager.getPlugin(pluginName);
    
    if (!plugin) {
      return res.status(404).json({
        success: false,
        error: 'Plugin not found'
      });
    }

    res.json({
      success: true,
      data: plugin.getInfo()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get plugin information'
    });
  }
});

// Enable a plugin
router.post('/:pluginName/enable', async (req, res) => {
  try {
    const { pluginName } = req.params;
    const pluginManager = req.app.pluginManager;
    
    if (!pluginManager) {
      return res.status(500).json({
        success: false,
        error: 'Plugin manager not available'
      });
    }

    const success = await pluginManager.enablePlugin(pluginName);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Plugin not found or failed to enable'
      });
    }

    res.json({
      success: true,
      message: `Plugin ${pluginName} enabled successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to enable plugin'
    });
  }
});

// Disable a plugin
router.post('/:pluginName/disable', async (req, res) => {
  try {
    const { pluginName } = req.params;
    const pluginManager = req.app.pluginManager;
    
    if (!pluginManager) {
      return res.status(500).json({
        success: false,
        error: 'Plugin manager not available'
      });
    }

    const success = pluginManager.disablePlugin(pluginName);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Plugin not found'
      });
    }

    res.json({
      success: true,
      message: `Plugin ${pluginName} disabled successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to disable plugin'
    });
  }
});

// Install a plugin
router.post('/:pluginName/install', async (req, res) => {
  try {
    const { pluginName } = req.params;
    const pluginManager = req.app.pluginManager;
    
    if (!pluginManager) {
      return res.status(500).json({
        success: false,
        error: 'Plugin manager not available'
      });
    }

    const success = await pluginManager.installPlugin(pluginName);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Plugin not found or installation failed'
      });
    }

    res.json({
      success: true,
      message: `Plugin ${pluginName} installed successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to install plugin'
    });
  }
});

// Uninstall a plugin
router.post('/:pluginName/uninstall', async (req, res) => {
  try {
    const { pluginName } = req.params;
    const pluginManager = req.app.pluginManager;
    
    if (!pluginManager) {
      return res.status(500).json({
        success: false,
        error: 'Plugin manager not available'
      });
    }

    const success = await pluginManager.uninstallPlugin(pluginName);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Plugin not found or uninstallation failed'
      });
    }

    res.json({
      success: true,
      message: `Plugin ${pluginName} uninstalled successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to uninstall plugin'
    });
  }
});

// Get plugin status
router.get('/:pluginName/status', (req, res) => {
  try {
    const { pluginName } = req.params;
    const pluginManager = req.app.pluginManager;
    
    if (!pluginManager) {
      return res.status(500).json({
        success: false,
        error: 'Plugin manager not available'
      });
    }

    const isLoaded = pluginManager.isPluginLoaded(pluginName);
    const isEnabled = pluginManager.isPluginEnabled(pluginName);
    
    res.json({
      success: true,
      data: {
        name: pluginName,
        loaded: isLoaded,
        enabled: isEnabled
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get plugin status'
    });
  }
});

module.exports = router; 