const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  variantId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'product_variants',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  variantName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  attributes: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'order_items',
  hooks: {
    beforeCreate: async (item) => {
      // Calculate total if not provided
      if (!item.total) {
        item.total = item.price * item.quantity;
      }
      
      // Get product details if not provided
      if (!item.productName || !item.sku) {
        const product = await require('./Product').findByPk(item.productId);
        if (product) {
          item.productName = item.productName || product.name;
          item.sku = item.sku || product.sku;
        }
      }
      
      // Get variant details if not provided
      if (item.variantId && !item.variantName) {
        const variant = await require('./ProductVariant').findByPk(item.variantId);
        if (variant) {
          item.variantName = variant.name;
          item.sku = item.sku || variant.sku;
          item.attributes = item.attributes || variant.attributes;
        }
      }
    }
  }
});

// Instance method to calculate total
OrderItem.prototype.calculateTotal = function() {
  return this.price * this.quantity;
};

// Instance method to get full product name
OrderItem.prototype.getFullProductName = function() {
  if (this.variantName) {
    return `${this.productName} - ${this.variantName}`;
  }
  return this.productName;
};

module.exports = OrderItem; 