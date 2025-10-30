'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_images', {
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
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      alt_text: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      is_main: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.addIndex('product_images', ['product_id']);
    await queryInterface.addIndex('product_images', ['sort_order']);
    await queryInterface.addIndex('product_images', ['is_main']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_images');
  }
}; 