const fs = require('fs');
const path = require('path');
const PluginBase = require('./PluginBase');

/**
 * Plugin Manager for the ecommerce module
 * Handles loading, managing, and coordinating all plugins
 */
class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.enabledPlugins = process.env.PLUGINS_ENABLED?.split(',') || [];
    this.pluginDirs = ['core', 'optional'];
    this.availablePlugins = new Map(); // Store all available plugins info
  }

  /**
   * Discover all available plugins
   */
  discoverPlugins() {
    console.log('Discovering available plugins...');
    
    for (const dir of this.pluginDirs) {
      const pluginPath = path.join(__dirname, dir);
      
      if (fs.existsSync(pluginPath)) {
        const plugins = fs.readdirSync(pluginPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
        
        for (const plugin of plugins) {
          const pluginFullPath = path.join(pluginPath, plugin);
          const pluginIndexPath = path.join(pluginFullPath, 'index.js');
          
          if (fs.existsSync(pluginIndexPath)) {
            try {
              // Get basic plugin info without loading the full plugin
              const pluginInfo = this.getPluginInfoFromPath(pluginFullPath, dir);
              this.availablePlugins.set(plugin, pluginInfo);
            } catch (error) {
              console.warn(`Failed to get info for plugin ${plugin}:`, error);
            }
          }
        }
      }
    }
    
    console.log(`Discovered ${this.availablePlugins.size} available plugins`);
  }

  /**
   * Get basic plugin information from plugin path
   */
  getPluginInfoFromPath(pluginPath, dir) {
    const pluginName = path.basename(pluginPath);
    const isCore = dir === 'core';
    const isEnabled = isCore || this.enabledPlugins.includes(pluginName);
    
    return {
      name: pluginName,
      core: isCore,
      enabled: isEnabled,
      loaded: false,
      version: '1.0.0', // Default version
      description: this.getPluginDescription(pluginName),
      dependencies: [],
      config: {}
    };
  }

  /**
   * Initialize and load all plugins
   * @param {Object} app - Express app instance
   * @param {Object} db - Database instance (Sequelize)
   */
  async loadPlugins(app, db) {
    console.log('Loading plugins...');
    
    // Store references for plugins to access
    this.app = app;
    this.db = db;
    app.pluginManager = this;

    // Discover all available plugins first
    this.discoverPlugins();

    for (const dir of this.pluginDirs) {
      const pluginPath = path.join(__dirname, dir);
      
      if (fs.existsSync(pluginPath)) {
        const plugins = fs.readdirSync(pluginPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
        
        for (const plugin of plugins) {
          // Load core plugins always, optional plugins only if enabled
          // Temporarily disable all plugins to debug the path-to-regexp error
          if (false && (dir === 'core' || this.enabledPlugins.includes(plugin))) {
            await this.loadPlugin(path.join(pluginPath, plugin), app, db);
          }
        }
      }
    }

    // Register plugin routes and middleware
    await this.registerPluginRoutes(app);
    await this.registerPluginMiddleware(app);
    
    console.log(`Loaded ${this.plugins.size} plugins`);
  }

  /**
   * Load a specific plugin by name
   * @param {string} name - Plugin name
   * @returns {Promise<boolean>} Success status
   */
  async loadPluginByName(name) {
    // Find the plugin directory
    for (const dir of this.pluginDirs) {
      const pluginPath = path.join(__dirname, dir, name);
      
      if (fs.existsSync(pluginPath)) {
        const success = await this.loadPlugin(pluginPath, this.app, this.db);
        if (success) {
          // Re-register routes and middleware for the newly loaded plugin
          await this.registerPluginRoutes(this.app);
          await this.registerPluginMiddleware(this.app);
        }
        return success;
      }
    }
    return false;
  }

  /**
   * Load a specific plugin
   * @param {string} pluginPath - Path to plugin directory
   * @param {Object} app - Express app instance
   * @param {Object} db - Database instance (Sequelize)
   * @returns {Promise<boolean>} Success status
   */
  async loadPlugin(pluginPath, app, db) {
    try {
      const pluginIndexPath = path.join(pluginPath, 'index.js');
      
      if (!fs.existsSync(pluginIndexPath)) {
        console.warn(`Plugin index not found at ${pluginIndexPath}`);
        return false;
      }

      // Load plugin class
      const PluginClass = require(pluginIndexPath);
      
      // Check if it extends PluginBase
      if (!PluginClass.prototype || !(PluginClass.prototype instanceof PluginBase)) {
        console.warn(`Plugin at ${pluginPath} does not extend PluginBase`);
        return false;
      }

      // Create plugin instance
      const plugin = new PluginClass();
      
      // Check dependencies before initializing
      if (!(await plugin.checkDependencies())) {
        console.warn(`Plugin ${plugin.name} dependencies not satisfied, skipping`);
        return false;
      }

      // Initialize the plugin
      await plugin.initialize(app, db);
      
      // Store plugin reference
      this.plugins.set(plugin.name, plugin);
      
      console.log(`Plugin ${plugin.name} v${plugin.version} loaded successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to load plugin at ${pluginPath}:`, error);
      return false;
    }
  }

  /**
   * Register all plugin routes with the Express app
   * @param {Object} app - Express app instance
   */
  async registerPluginRoutes(app) {
    for (const [name, plugin] of this.plugins) {
      if (!plugin.isEnabled()) continue;

      const routes = plugin.getRoutes();
      
      // Skip if routes is not an array or is empty
      if (!routes || !Array.isArray(routes) || routes.length === 0) {
        console.log(`No routes to register for plugin ${name}`);
        continue;
      }
      
      for (const route of routes) {
        try {
          const { path, router, middleware = [] } = route;
          
          // Guard against invalid paths
          if (typeof path !== 'string' || !path.startsWith('/')) {
            console.warn(`Skipping invalid route path for plugin ${name}: ${path}`);
            continue;
          }
          
          // Apply plugin middleware
          if (middleware.length > 0) {
            app.use(path, ...middleware, router);
          } else {
            app.use(path, router);
          }
          
          console.log(`Registered routes for plugin ${name} at ${path}`);
        } catch (error) {
          console.error(`Failed to register routes for plugin ${name}:`, error);
        }
      }
    }
  }

  /**
   * Register all plugin middleware with the Express app
   * @param {Object} app - Express app instance
   */
  async registerPluginMiddleware(app) {
    for (const [name, plugin] of this.plugins) {
      if (!plugin.isEnabled()) continue;

      const middleware = plugin.getMiddleware();
      
      // Skip if middleware is not an array or is empty
      if (!middleware || !Array.isArray(middleware) || middleware.length === 0) {
        console.log(`No middleware to register for plugin ${name}`);
        continue;
      }
      
      for (const mw of middleware) {
        try {
          if (typeof mw === 'function') {
            app.use(mw);
            console.log(`Registered middleware for plugin ${name}`);
          }
        } catch (error) {
          console.error(`Failed to register middleware for plugin ${name}:`, error);
        }
      }
    }
  }

  /**
   * Get a specific plugin by name
   * @param {string} name - Plugin name
   * @returns {PluginBase|null} Plugin instance or null
   */
  getPlugin(name) {
    return this.plugins.get(name) || null;
  }

  /**
   * Get all loaded plugins
   * @returns {Map} Map of plugin name to plugin instance
   */
  getAllPlugins() {
    return this.plugins;
  }

  /**
   * Get all enabled plugins
   * @returns {Array} Array of enabled plugin instances
   */
  getEnabledPlugins() {
    return Array.from(this.plugins.values()).filter(plugin => plugin.isEnabled());
  }

  /**
   * Enable a plugin
   * @param {string} name - Plugin name
   * @returns {Promise<boolean>} Success status
   */
  async enablePlugin(name) {
    let plugin = this.getPlugin(name);
    
    // If plugin is not loaded, try to load it first
    if (!plugin) {
      const success = await this.loadPluginByName(name);
      if (!success) {
        return false;
      }
      plugin = this.getPlugin(name);
    }
    
    if (plugin) {
      plugin.enable();
      
      // Update the available plugins info
      const pluginInfo = this.availablePlugins.get(name);
      if (pluginInfo) {
        pluginInfo.enabled = true;
        pluginInfo.loaded = true;
      }
      
      return true;
    }
    return false;
  }

  /**
   * Disable a plugin
   * @param {string} name - Plugin name
   * @returns {boolean} Success status
   */
  disablePlugin(name) {
    const plugin = this.getPlugin(name);
    if (plugin) {
      plugin.disable();
      
      // Update the available plugins info
      const pluginInfo = this.availablePlugins.get(name);
      if (pluginInfo) {
        pluginInfo.enabled = false;
      }
      
      return true;
    }
    return false;
  }

  /**
   * Install a plugin
   * @param {string} name - Plugin name
   * @returns {Promise<boolean>} Success status
   */
  async installPlugin(name) {
    const plugin = this.getPlugin(name);
    if (plugin) {
      return await plugin.install();
    }
    return false;
  }

  /**
   * Uninstall a plugin
   * @param {string} name - Plugin name
   * @returns {Promise<boolean>} Success status
   */
  async uninstallPlugin(name) {
    const plugin = this.getPlugin(name);
    if (plugin) {
      return await plugin.uninstall();
    }
    return false;
  }

  /**
   * Get plugin information for all plugins
   * @returns {Array} Array of plugin information objects
   */
  getPluginsInfo() {
    const pluginsInfo = [];
    
    // Add information for all available plugins
    for (const [name, pluginInfo] of this.availablePlugins) {
      const loadedPlugin = this.plugins.get(name);
      
      if (loadedPlugin) {
        // Plugin is loaded, get full info
        const info = loadedPlugin.getInfo();
        pluginsInfo.push({
          ...info,
          core: this.isCorePlugin(name),
          description: this.getPluginDescription(name),
          loaded: true,
          enabled: loadedPlugin.isEnabled()
        });
      } else {
        // Plugin is not loaded, use basic info
        pluginsInfo.push({
          ...pluginInfo,
          core: this.isCorePlugin(name),
          description: this.getPluginDescription(name),
          loaded: false,
          enabled: pluginInfo.enabled
        });
      }
    }
    
    return pluginsInfo;
  }

  /**
   * Check if a plugin is a core plugin
   * @param {string} name - Plugin name
   * @returns {boolean} Whether plugin is core
   */
  isCorePlugin(name) {
    const corePlugins = ['inventory', 'search', 'media', 'email'];
    return corePlugins.includes(name);
  }

  /**
   * Get plugin description
   * @param {string} name - Plugin name
   * @returns {string} Plugin description
   */
  getPluginDescription(name) {
    const descriptions = {
      inventory: 'Track stock levels, set low stock alerts, and manage inventory across multiple locations.',
      search: 'Advanced product search with filters, sorting, and search suggestions.',
      media: 'File upload and management with image processing and optimization.',
      email: 'Email notifications and templates for order confirmations and marketing.',
      reviews: 'Allow customers to leave reviews and ratings for products.',
      coupons: 'Create and manage discount codes, promotional offers, and special deals.',
      seo: 'Search engine optimization tools including meta tags, sitemaps, and structured data.',
      social: 'Integrate with social media platforms for sharing and marketing.',
      analytics: 'Enhanced analytics and reporting with detailed insights and custom dashboards.',
      shipping: 'Flexible shipping options with multiple carriers and rate calculations.',
      payments: 'Multiple payment gateway integrations with secure transaction processing.'
    };
    return descriptions[name] || 'No description available';
  }

  /**
   * Check if a plugin is loaded
   * @param {string} name - Plugin name
   * @returns {boolean} Whether plugin is loaded
   */
  isPluginLoaded(name) {
    return this.plugins.has(name);
  }

  /**
   * Check if a plugin is enabled
   * @param {string} name - Plugin name
   * @returns {boolean} Whether plugin is enabled
   */
  isPluginEnabled(name) {
    const plugin = this.getPlugin(name);
    return plugin ? plugin.isEnabled() : false;
  }

  /**
   * Get plugin models
   * @returns {Object} Object with all plugin models
   */
  getPluginModels() {
    const models = {};
    
    for (const [name, plugin] of this.plugins) {
      if (plugin.isEnabled()) {
        const pluginModels = plugin.getModels();
        Object.assign(models, pluginModels);
      }
    }
    
    return models;
  }
}

module.exports = PluginManager; 