"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("editorials", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
      },
      title: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      excerpt: { type: Sequelize.TEXT, allowNull: true },
      heroUrl: { type: Sequelize.STRING, allowNull: true },
      heroType: { type: Sequelize.ENUM('image', 'video'), defaultValue: 'image' },
      content: { type: Sequelize.TEXT, allowNull: false }, // HTML content
      author: { type: Sequelize.STRING, allowNull: true },
      tags: { type: Sequelize.JSONB, allowNull: true },
      status: { type: Sequelize.ENUM('draft', 'published'), defaultValue: 'draft' },
      publishedAt: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("editorials");
  }
};


