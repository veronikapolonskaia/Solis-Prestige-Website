const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gallery = sequelize.define('Gallery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true,
      is: [/^https?:\/\//i]
    }
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      is: [/^https?:\/\//i]
    }
  },
  category: {
    type: DataTypes.ENUM('birthday', 'corporate', 'wedding', 'school', 'festival', 'other'),
    allowNull: false,
    defaultValue: 'other'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  alt_text: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'galleries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['featured']
    },
    {
      fields: ['status']
    },
    {
      fields: ['display_order']
    }
  ]
});

module.exports = Gallery;
