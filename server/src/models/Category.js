const { DataTypes } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
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
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metaTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'categories',
  hooks: {
    beforeCreate: async (category) => {
      if (category.name && !category.slug) {
        category.slug = slugify(category.name, { lower: true, strict: true });
      }
    },
    beforeUpdate: async (category) => {
      if (category.changed('name') && !category.changed('slug')) {
        category.slug = slugify(category.name, { lower: true, strict: true });
      }
    }
  }
});

// Self-referential association for hierarchical categories
Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });

module.exports = Category; 