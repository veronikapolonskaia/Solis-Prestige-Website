const { Setting } = require('../models');

class SettingsManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.lastCacheUpdate = 0;
  }

  /**
   * Get a setting value by key
   * @param {string} key - Setting key
   * @param {*} defaultValue - Default value if setting not found
   * @returns {*} Setting value or default
   */
  async get(key, defaultValue = null) {
    // Check cache first
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.value;
      }
    }

    try {
      const value = await Setting.getByKey(key);
      if (value !== null) {
        // Cache the value
        this.cache.set(key, {
          value,
          timestamp: Date.now()
        });
        return value;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Get multiple settings by keys
   * @param {string[]} keys - Array of setting keys
   * @returns {Object} Object with key-value pairs
   */
  async getMultiple(keys) {
    const result = {};
    const promises = keys.map(async (key) => {
      result[key] = await this.get(key);
    });
    await Promise.all(promises);
    return result;
  }

  /**
   * Get all settings by category
   * @param {string} category - Setting category
   * @returns {Object} Object with key-value pairs
   */
  async getByCategory(category) {
    try {
      return await Setting.getByCategory(category);
    } catch (error) {
      console.error(`Error getting settings for category ${category}:`, error);
      return {};
    }
  }

  /**
   * Set a setting value
   * @param {string} key - Setting key
   * @param {*} value - Setting value
   * @param {string} category - Setting category
   * @param {string} description - Setting description
   */
  async set(key, value, category = 'general', description = null) {
    try {
      await Setting.setByKey(key, value, category, description);
      // Update cache
      this.cache.set(key, {
        value,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    this.lastCacheUpdate = 0;
  }

  /**
   * Get payment settings
   * @returns {Object} Payment settings
   */
  async getPaymentSettings() {
    return await this.getByCategory('payment');
  }

  /**
   * Get shipping settings
   * @returns {Object} Shipping settings
   */
  async getShippingSettings() {
    return await this.getByCategory('shipping');
  }

  /**
   * Get tax settings
   * @returns {Object} Tax settings
   */
  async getTaxSettings() {
    return await this.getByCategory('tax');
  }

  /**
   * Get email settings
   * @returns {Object} Email settings
   */
  async getEmailSettings() {
    return await this.getByCategory('email');
  }

  /**
   * Get security settings
   * @returns {Object} Security settings
   */
  async getSecuritySettings() {
    return await this.getByCategory('security');
  }

  /**
   * Get media settings
   * @returns {Object} Media settings
   */
  async getMediaSettings() {
    return await this.getByCategory('media');
  }

  /**
   * Get general settings
   * @returns {Object} General settings
   */
  async getGeneralSettings() {
    return await this.getByCategory('general');
  }

  /**
   * Check if payment method is enabled
   * @param {string} method - Payment method (stripe, paypal, cod, etc.)
   * @returns {boolean} Whether the method is enabled
   */
  async isPaymentMethodEnabled(method) {
    const key = `${method}_enabled`;
    return await this.get(key, false);
  }

  /**
   * Get tax rate
   * @returns {number} Tax rate percentage
   */
  async getTaxRate() {
    return await this.get('tax_rate', 0);
  }

  /**
   * Check if tax is enabled
   * @returns {boolean} Whether tax is enabled
   */
  async isTaxEnabled() {
    return await this.get('tax_enabled', false);
  }

  /**
   * Get free shipping threshold
   * @returns {number} Free shipping threshold amount
   */
  async getFreeShippingThreshold() {
    return await this.get('free_shipping_threshold', 0);
  }

  /**
   * Get flat rate shipping
   * @returns {number} Flat rate shipping amount
   */
  async getFlatRateShipping() {
    return await this.get('flat_rate', 0);
  }

  /**
   * Get store currency
   * @returns {string} Store currency code
   */
  async getCurrency() {
    return await this.get('currency', 'USD');
  }

  /**
   * Get store name
   * @returns {string} Store name
   */
  async getStoreName() {
    return await this.get('store_name', 'My Ecommerce Store');
  }

  /**
   * Get store email
   * @returns {string} Store email
   */
  async getStoreEmail() {
    return await this.get('store_email', 'admin@myecommercestore.com');
  }

  /**
   * Get max file size
   * @returns {number} Maximum file size in MB
   */
  async getMaxFileSize() {
    return await this.get('max_file_size', 5);
  }

  /**
   * Get allowed file types
   * @returns {string[]} Array of allowed file types
   */
  async getAllowedFileTypes() {
    return await this.get('allowed_types', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
  }

  /**
   * Get image quality
   * @returns {number} Image quality percentage
   */
  async getImageQuality() {
    return await this.get('image_quality', 85);
  }

  /**
   * Get thumbnail size
   * @returns {number} Thumbnail size in pixels
   */
  async getThumbnailSize() {
    return await this.get('thumbnail_size', 300);
  }

  /**
   * Check if watermark is enabled
   * @returns {boolean} Whether watermark is enabled
   */
  async isWatermarkEnabled() {
    return await this.get('watermark', false);
  }

  /**
   * Get session timeout
   * @returns {number} Session timeout in hours
   */
  async getSessionTimeout() {
    return await this.get('session_timeout', 24);
  }

  /**
   * Get max login attempts
   * @returns {number} Maximum login attempts
   */
  async getMaxLoginAttempts() {
    return await this.get('max_login_attempts', 5);
  }

  /**
   * Check if email verification is required
   * @returns {boolean} Whether email verification is required
   */
  async isEmailVerificationRequired() {
    return await this.get('require_email_verification', true);
  }

  /**
   * Check if two-factor auth is enabled
   * @returns {boolean} Whether two-factor auth is enabled
   */
  async isTwoFactorAuthEnabled() {
    return await this.get('two_factor_auth', false);
  }
}

// Create singleton instance
const settingsManager = new SettingsManager();

module.exports = settingsManager; 