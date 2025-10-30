'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('settings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      value: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'general'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('settings', ['key']);
    await queryInterface.addIndex('settings', ['category']);
    await queryInterface.addIndex('settings', ['is_public']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('settings');
  }
}; 