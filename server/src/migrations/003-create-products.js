'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      short_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      compare_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      cost_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      track_quantity: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      weight: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true
      },
      taxable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      meta_title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('products', ['slug']);
    await queryInterface.addIndex('products', ['sku']);
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['is_active']);
    await queryInterface.addIndex('products', ['price']);
    await queryInterface.addIndex('products', ['quantity']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
}; 