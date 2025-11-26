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
  heroUrl: { type: DataTypes.STRING, allowNull: true, field: 'hero_url' },
  heroType: { type: DataTypes.ENUM('image', 'video'), defaultValue: 'image', field: 'hero_type' },
  content: { type: DataTypes.TEXT, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: true },
  tags: { type: DataTypes.JSONB, allowNull: true },
  status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' },
  publishedAt: { type: DataTypes.DATE, allowNull: true, field: 'published_at' }
}, {
  tableName: 'editorials'
});

module.exports = Editorial;


