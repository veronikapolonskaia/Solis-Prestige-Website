'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const settings = [
      // General settings
      {
        id: uuidv4(),
        key: 'store_name',
        value: JSON.stringify('My Ecommerce Store'),
        category: 'general',
        description: 'Store name',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'store_email',
        value: JSON.stringify('admin@myecommercestore.com'),
        category: 'general',
        description: 'Store email',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'store_phone',
        value: JSON.stringify('+1 (555) 123-4567'),
        category: 'general',
        description: 'Store phone',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'store_address',
        value: JSON.stringify('123 Commerce St, Business City, BC 12345'),
        category: 'general',
        description: 'Store address',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'timezone',
        value: JSON.stringify('America/New_York'),
        category: 'general',
        description: 'Store timezone',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'currency',
        value: JSON.stringify('USD'),
        category: 'general',
        description: 'Store currency',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'language',
        value: JSON.stringify('en'),
        category: 'general',
        description: 'Store language',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Payment settings
      {
        id: uuidv4(),
        key: 'stripe_enabled',
        value: JSON.stringify(true),
        category: 'payment',
        description: 'Enable Stripe payments',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'stripe_publishable_key',
        value: JSON.stringify('pk_test_...'),
        category: 'payment',
        description: 'Stripe publishable key',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'stripe_secret_key',
        value: JSON.stringify('sk_test_...'),
        category: 'payment',
        description: 'Stripe secret key',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'paypal_enabled',
        value: JSON.stringify(false),
        category: 'payment',
        description: 'Enable PayPal payments',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'paypal_client_id',
        value: JSON.stringify(''),
        category: 'payment',
        description: 'PayPal client ID',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'paypal_secret',
        value: JSON.stringify(''),
        category: 'payment',
        description: 'PayPal secret',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'cash_on_delivery',
        value: JSON.stringify(true),
        category: 'payment',
        description: 'Enable cash on delivery',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Email settings
      {
        id: uuidv4(),
        key: 'smtp_host',
        value: JSON.stringify('smtp.gmail.com'),
        category: 'email',
        description: 'SMTP host',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'smtp_port',
        value: JSON.stringify(587),
        category: 'email',
        description: 'SMTP port',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'smtp_user',
        value: JSON.stringify('noreply@myecommercestore.com'),
        category: 'email',
        description: 'SMTP username',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'smtp_password',
        value: JSON.stringify(''),
        category: 'email',
        description: 'SMTP password',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'from_email',
        value: JSON.stringify('noreply@myecommercestore.com'),
        category: 'email',
        description: 'From email address',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'from_name',
        value: JSON.stringify('My Ecommerce Store'),
        category: 'email',
        description: 'From name',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Shipping settings
      {
        id: uuidv4(),
        key: 'free_shipping_threshold',
        value: JSON.stringify(50),
        category: 'shipping',
        description: 'Free shipping threshold',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'flat_rate',
        value: JSON.stringify(5.99),
        category: 'shipping',
        description: 'Flat rate shipping',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'weight_based',
        value: JSON.stringify(false),
        category: 'shipping',
        description: 'Enable weight-based shipping',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'shipping_zones',
        value: JSON.stringify([
          { name: 'Domestic', countries: ['US'], rate: 5.99 },
          { name: 'International', countries: ['CA', 'MX'], rate: 15.99 }
        ]),
        category: 'shipping',
        description: 'Shipping zones',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Tax settings
      {
        id: uuidv4(),
        key: 'tax_enabled',
        value: JSON.stringify(true),
        category: 'tax',
        description: 'Enable tax calculation',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'tax_rate',
        value: JSON.stringify(8.5),
        category: 'tax',
        description: 'Tax rate percentage',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'include_in_price',
        value: JSON.stringify(true),
        category: 'tax',
        description: 'Include tax in product prices',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'exempt_categories',
        value: JSON.stringify([]),
        category: 'tax',
        description: 'Tax exempt categories',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Security settings
      {
        id: uuidv4(),
        key: 'require_email_verification',
        value: JSON.stringify(true),
        category: 'security',
        description: 'Require email verification',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'require_phone_verification',
        value: JSON.stringify(false),
        category: 'security',
        description: 'Require phone verification',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'max_login_attempts',
        value: JSON.stringify(5),
        category: 'security',
        description: 'Maximum login attempts',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'session_timeout',
        value: JSON.stringify(24),
        category: 'security',
        description: 'Session timeout in hours',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'two_factor_auth',
        value: JSON.stringify(false),
        category: 'security',
        description: 'Enable two-factor authentication',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Media settings
      {
        id: uuidv4(),
        key: 'max_file_size',
        value: JSON.stringify(5),
        category: 'media',
        description: 'Maximum file size in MB',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'allowed_types',
        value: JSON.stringify(['jpg', 'jpeg', 'png', 'gif', 'webp']),
        category: 'media',
        description: 'Allowed file types',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'image_quality',
        value: JSON.stringify(85),
        category: 'media',
        description: 'Image quality percentage',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'thumbnail_size',
        value: JSON.stringify(300),
        category: 'media',
        description: 'Thumbnail size in pixels',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        key: 'watermark',
        value: JSON.stringify(false),
        category: 'media',
        description: 'Add watermark to images',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('settings', settings, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('settings', null, {});
  }
}; 