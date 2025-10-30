/**
 * Base class for all plugins in the ecommerce module
 * All plugins must extend this class and implement required methods
 */
class PluginBase {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.enabled = false;
    this.dependencies = [];
    this.config = {};
  }

  /**
   * Initialize the plugin with app and database instances
   * @param {Object} app - Express app instance
   * @param {Object} db - Database instance (Sequelize)
   */
  async initialize(app, db) {
    this.app = app;
    this.db = db;
    this.enabled = true;
    
    // Load plugin configuration
    await this.loadConfig();
    
    // Initialize plugin-specific logic
    await this.onInitialize();
    
    console.log(`Plugin ${this.name} v${this.version} initialized successfully`);
  }

  /**
   * Load plugin configuration from environment or database
   */
  async loadConfig() {
    // Default configuration can be overridden by environment variables
    const envPrefix = `PLUGIN_${this.name.toUpperCase()}_`;
    
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith(envPrefix)) {
        const configKey = key.replace(envPrefix, '').toLowerCase();
        this.config[configKey] = value;
      }
    }
  }

  /**
   * Plugin-specific initialization logic
   * Override this method in plugins
   */
  async onInitialize() {
    // Override in plugins
  }

  /**
   * Install the plugin (create tables, seed data, etc.)
   * @returns {Promise<boolean>} Success status
   */
  async install() {
    try {
      console.log(`Installing plugin ${this.name}...`);
      
      // Run database migrations if any
      await this.runMigrations();
      
      // Seed initial data if any
      await this.seedData();
      
      // Run post-installation tasks
      await this.onInstall();
      
      console.log(`Plugin ${this.name} installed successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to install plugin ${this.name}:`, error);
      return false;
    }
  }

  /**
   * Uninstall the plugin (cleanup, remove data, etc.)
   * @returns {Promise<boolean>} Success status
   */
  async uninstall() {
    try {
      console.log(`Uninstalling plugin ${this.name}...`);
      
      // Run cleanup tasks
      await this.onUninstall();
      
      // Remove plugin data if requested
      if (this.config.remove_data_on_uninstall) {
        await this.removeData();
      }
      
      console.log(`Plugin ${this.name} uninstalled successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to uninstall plugin ${this.name}:`, error);
      return false;
    }
  }

  /**
   * Get additional routes for this plugin
   * @returns {Array} Array of route objects
   */
  getRoutes() {
    return [];
  }

  /**
   * Get additional middleware for this plugin
   * @returns {Array} Array of middleware functions
   */
  getMiddleware() {
    return [];
  }

  /**
   * Get additional database models for this plugin
   * @returns {Object} Object with model definitions
   */
  getModels() {
    return {};
  }

  /**
   * Get plugin information
   * @returns {Object} Plugin metadata
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      enabled: this.enabled,
      dependencies: this.dependencies,
      config: this.config
    };
  }

  /**
   * Check if plugin has required dependencies
   * @returns {Promise<boolean>} Whether dependencies are satisfied
   */
  async checkDependencies() {
    for (const dependency of this.dependencies) {
      // Check if required plugin is loaded and enabled
      if (this.app && this.app.pluginManager) {
        const depPlugin = this.app.pluginManager.getPlugin(dependency);
        if (!depPlugin || !depPlugin.enabled) {
          console.warn(`Plugin ${this.name} requires ${dependency} but it's not available`);
          return false;
        }
      } else {
        // If app or pluginManager is not available yet, skip dependency check
        // This will be checked again after initialization
        console.log(`Skipping dependency check for ${this.name} - app not initialized yet`);
        return true;
      }
    }
    return true;
  }

  /**
   * Run database migrations for this plugin
   * Override in plugins that need database changes
   */
  async runMigrations() {
    // Override in plugins that need migrations
  }

  /**
   * Seed initial data for this plugin
   * Override in plugins that need initial data
   */
  async seedData() {
    // Override in plugins that need seeding
  }

  /**
   * Remove plugin data
   * Override in plugins that need cleanup
   */
  async removeData() {
    // Override in plugins that need data removal
  }

  /**
   * Plugin-specific installation logic
   * Override in plugins
   */
  async onInstall() {
    // Override in plugins
  }

  /**
   * Plugin-specific uninstallation logic
   * Override in plugins
   */
  async onUninstall() {
    // Override in plugins
  }

  /**
   * Enable the plugin
   */
  enable() {
    this.enabled = true;
    console.log(`Plugin ${this.name} enabled`);
  }

  /**
   * Disable the plugin
   */
  disable() {
    this.enabled = false;
    console.log(`Plugin ${this.name} disabled`);
  }

  /**
   * Check if plugin is enabled
   * @returns {boolean} Whether plugin is enabled
   */
  isEnabled() {
    return this.enabled;
  }
}

module.exports = PluginBase; 