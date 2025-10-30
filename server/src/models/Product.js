const { DataTypes } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: true
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
  comparePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  trackQuantity: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  taxable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metaTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  }
}, {
  tableName: 'products',
  hooks: {
    // Ensure slug exists before validations run to satisfy NOT NULL constraint
    beforeValidate: async (product) => {
      if (product.name && !product.slug) {
        product.slug = slugify(product.name, { lower: true, strict: true });
      }
      // If name changed and slug wasn't explicitly changed, refresh slug
      if (product.changed && product.changed('name') && !product.changed('slug')) {
        product.slug = slugify(product.name, { lower: true, strict: true });
      }
    }
  }
});

// Instance method to check if product is in stock
Product.prototype.isInStock = function() {
  if (!this.trackQuantity) return true;
  return this.quantity > 0;
};

// Instance method to get sale price
Product.prototype.getSalePrice = function() {
  return this.comparePrice || this.price;
};

// Instance method to check if product is on sale
Product.prototype.isOnSale = function() {
  return this.comparePrice && this.comparePrice > this.price;
};

module.exports = Product; 