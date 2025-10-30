const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  attributes: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'product_variants',
  hooks: {
    beforeCreate: async (variant) => {
      // Generate SKU if not provided
      if (!variant.sku) {
        const product = await require('./Product').findByPk(variant.productId);
        if (product) {
          variant.sku = `${product.sku}-${variant.name.toLowerCase().replace(/\s+/g, '-')}`;
        }
      }
    }
  }
});

// Instance method to check if variant is in stock
ProductVariant.prototype.isInStock = function() {
  return this.quantity > 0;
};

// Instance method to get attribute value
ProductVariant.prototype.getAttribute = function(key) {
  return this.attributes?.[key];
};

// Instance method to set attribute value
ProductVariant.prototype.setAttribute = function(key, value) {
  if (!this.attributes) this.attributes = {};
  this.attributes[key] = value;
};

module.exports = ProductVariant; 