const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('galleries', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      image_url: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      thumbnail_url: {
        type: DataTypes.STRING(500),
        allowNull: true
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
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('galleries', ['category']);
    await queryInterface.addIndex('galleries', ['featured']);
    await queryInterface.addIndex('galleries', ['status']);
    await queryInterface.addIndex('galleries', ['display_order']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('galleries');
  }
};
