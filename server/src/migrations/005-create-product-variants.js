'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_variants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
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
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      weight: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      attributes: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
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
    await queryInterface.addIndex('product_variants', ['product_id']);
    await queryInterface.addIndex('product_variants', ['sku']);
    await queryInterface.addIndex('product_variants', ['quantity']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_variants');
  }
}; 