const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'general'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_public'
  }
}, {
  tableName: 'settings',
  hooks: {
    beforeCreate: async (setting) => {
      // Ensure key is lowercase and uses underscores
      setting.key = setting.key.toLowerCase().replace(/\s+/g, '_');
    }
  }
});

// Instance method to get setting value
Setting.prototype.getValue = function() {
  return this.value;
};

// Instance method to set setting value
Setting.prototype.setValue = function(newValue) {
  this.value = newValue;
  return this.save();
};

// Static method to get setting by key
Setting.getByKey = async function(key) {
  const setting = await this.findOne({ where: { key } });
  return setting ? setting.getValue() : null;
};

// Static method to set setting by key
Setting.setByKey = async function(key, value, category = 'general', description = null) {
  const [setting] = await this.findOrCreate({
    where: { key },
    defaults: { value, category, description }
  });
  
  if (setting.value !== value) {
    setting.value = value;
    await setting.save();
  }
  
  return setting;
};

// Static method to get settings by category
Setting.getByCategory = async function(category) {
  const settings = await this.findAll({ where: { category } });
  const result = {};
  
  settings.forEach(setting => {
    result[setting.key] = setting.getValue();
  });
  
  return result;
};

// Static method to get all settings
Setting.getAll = async function() {
  const settings = await this.findAll();
  const result = {};
  
  settings.forEach(setting => {
    if (!result[setting.category]) {
      result[setting.category] = {};
    }
    result[setting.category][setting.key] = setting.getValue();
  });
  
  return result;
};

// Static method to initialize default settings
Setting.initializeDefaults = async function() {
  const defaults = {
    // General settings
    'store_name': { value: 'My Ecommerce Store', category: 'general', description: 'Store name' },
    'store_email': { value: 'admin@myecommercestore.com', category: 'general', description: 'Store email' },
    'store_phone': { value: '+1 (555) 123-4567', category: 'general', description: 'Store phone' },
    'store_address': { value: '123 Commerce St, Business City, BC 12345', category: 'general', description: 'Store address' },
    'timezone': { value: 'America/New_York', category: 'general', description: 'Store timezone' },
    'currency': { value: 'USD', category: 'general', description: 'Store currency' },
    'language': { value: 'en', category: 'general', description: 'Store language' },
    
    // Payment settings
    'stripe_enabled': { value: true, category: 'payment', description: 'Enable Stripe payments' },
    'stripe_publishable_key': { value: 'pk_test_...', category: 'payment', description: 'Stripe publishable key' },
    'stripe_secret_key': { value: 'sk_test_...', category: 'payment', description: 'Stripe secret key' },
    'paypal_enabled': { value: false, category: 'payment', description: 'Enable PayPal payments' },
    'paypal_client_id': { value: '', category: 'payment', description: 'PayPal client ID' },
    'paypal_secret': { value: '', category: 'payment', description: 'PayPal secret' },
    'cash_on_delivery': { value: true, category: 'payment', description: 'Enable cash on delivery' },
    
    // Email settings
    'smtp_host': { value: 'smtp.gmail.com', category: 'email', description: 'SMTP host' },
    'smtp_port': { value: 587, category: 'email', description: 'SMTP port' },
    'smtp_user': { value: 'noreply@myecommercestore.com', category: 'email', description: 'SMTP username' },
    'smtp_password': { value: '', category: 'email', description: 'SMTP password' },
    'from_email': { value: 'noreply@myecommercestore.com', category: 'email', description: 'From email address' },
    'from_name': { value: 'My Ecommerce Store', category: 'email', description: 'From name' },
    
    // Shipping settings
    'free_shipping_threshold': { value: 50, category: 'shipping', description: 'Free shipping threshold' },
    'flat_rate': { value: 5.99, category: 'shipping', description: 'Flat rate shipping' },
    'weight_based': { value: false, category: 'shipping', description: 'Enable weight-based shipping' },
    'shipping_zones': { value: [
      { name: 'Domestic', countries: ['US'], rate: 5.99 },
      { name: 'International', countries: ['CA', 'MX'], rate: 15.99 }
    ], category: 'shipping', description: 'Shipping zones' },
    
    // Tax settings
    'tax_enabled': { value: true, category: 'tax', description: 'Enable tax calculation' },
    'tax_rate': { value: 8.5, category: 'tax', description: 'Tax rate percentage' },
    'include_in_price': { value: true, category: 'tax', description: 'Include tax in product prices' },
    'exempt_categories': { value: [], category: 'tax', description: 'Tax exempt categories' },
    
    // Security settings
    'require_email_verification': { value: true, category: 'security', description: 'Require email verification' },
    'require_phone_verification': { value: false, category: 'security', description: 'Require phone verification' },
    'max_login_attempts': { value: 5, category: 'security', description: 'Maximum login attempts' },
    'session_timeout': { value: 24, category: 'security', description: 'Session timeout in hours' },
    'two_factor_auth': { value: false, category: 'security', description: 'Enable two-factor authentication' },
    
    // Media settings
    'max_file_size': { value: 5, category: 'media', description: 'Maximum file size in MB' },
    'allowed_types': { value: ['jpg', 'jpeg', 'png', 'gif', 'webp'], category: 'media', description: 'Allowed file types' },
    'image_quality': { value: 85, category: 'media', description: 'Image quality percentage' },
    'thumbnail_size': { value: 300, category: 'media', description: 'Thumbnail size in pixels' },
    'watermark': { value: false, category: 'media', description: 'Add watermark to images' }
  };
  
  for (const [key, config] of Object.entries(defaults)) {
    await this.setByKey(key, config.value, config.category, config.description);
  }
};

module.exports = Setting; 