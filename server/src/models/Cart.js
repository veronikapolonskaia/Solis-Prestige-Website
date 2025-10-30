const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // Allow guest carts
    references: {
      model: 'users',
      key: 'id'
    }
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true // For guest carts
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
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  attributes: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'carts',
  hooks: {
    beforeCreate: async (cartItem) => {
      // Get current product price if not provided
      if (!cartItem.price) {
        const product = await require('./Product').findByPk(cartItem.productId);
        if (product) {
          cartItem.price = product.price;
        }
        
        // If variant is selected, use variant price
        if (cartItem.variantId) {
          const variant = await require('./ProductVariant').findByPk(cartItem.variantId);
          if (variant) {
            cartItem.price = variant.price;
            cartItem.attributes = cartItem.attributes || variant.attributes;
          }
        }
      }
    }
  }
});

// Instance method to calculate total for this item
Cart.prototype.calculateTotal = function() {
  return this.price * this.quantity;
};

// Instance method to check if item is still available
Cart.prototype.isAvailable = async function() {
  const product = await require('./Product').findByPk(this.productId);
  if (!product || !product.isActive) return false;
  
  if (this.variantId) {
    const variant = await require('./ProductVariant').findByPk(this.variantId);
    return variant && variant.isInStock();
  }
  
  return product.isInStock();
};

module.exports = Cart; 