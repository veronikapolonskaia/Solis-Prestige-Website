const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // Allow guest orders
    references: {
      model: 'users',
      key: 'id'
    }
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    defaultValue: 'pending'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  shippingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shippingAddress: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  billingAddress: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  hooks: {
    // Generate order number before validations to satisfy NOT NULL constraint
    beforeValidate: async (order) => {
      if (!order.orderNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        order.orderNumber = `ORD-${year}${month}${day}-${random}`;
      }
    }
  }
});

// Instance method to calculate total
Order.prototype.calculateTotal = function() {
  return this.subtotal + this.taxAmount + this.shippingAmount - this.discountAmount;
};

// Instance method to check if order is paid
Order.prototype.isPaid = function() {
  return this.paymentStatus === 'paid';
};

// Instance method to check if order is completed
Order.prototype.isCompleted = function() {
  return this.status === 'delivered';
};

// Instance method to get order status display name
Order.prototype.getStatusDisplay = function() {
  const statusMap = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded'
  };
  return statusMap[this.status] || this.status;
};

module.exports = Order; 