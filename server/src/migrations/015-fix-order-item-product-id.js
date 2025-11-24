'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop FK to change nullability
    await queryInterface.sequelize.query(`
      ALTER TABLE "order_items"
      DROP CONSTRAINT IF EXISTS "order_items_product_id_fkey";
    `);

    await queryInterface.changeColumn('order_items', 'product_id', {
      type: Sequelize.UUID,
      allowNull: true
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "order_items"
      ADD CONSTRAINT "order_items_product_id_fkey"
      FOREIGN KEY ("product_id")
      REFERENCES "products" ("id")
      ON UPDATE CASCADE
      ON DELETE RESTRICT;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('order_items', 'product_id', {
      type: Sequelize.UUID,
      allowNull: false
    });
  }
};

