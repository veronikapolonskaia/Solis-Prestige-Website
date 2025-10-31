const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Editorial = sequelize.define('Editorial', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  excerpt: { type: DataTypes.TEXT, allowNull: true },
  heroUrl: { type: DataTypes.STRING, allowNull: true },
  heroType: { type: DataTypes.ENUM('image', 'video'), defaultValue: 'image' },
  content: { type: DataTypes.TEXT, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: true },
  tags: { type: DataTypes.JSONB, allowNull: true },
  status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' },
  publishedAt: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'editorials'
});

module.exports = Editorial;


