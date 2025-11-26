"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure extension exists before renaming
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    const tableName = "editorials";

    const columnExists = async (columnName) => {
      const [results] = await queryInterface.sequelize.query(
        `
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = :table
            AND column_name = :column;
        `,
        { replacements: { table: tableName, column: columnName } }
      );
      return results.length > 0;
    };

    if (await columnExists("heroUrl")) {
      await queryInterface.renameColumn(tableName, "heroUrl", "hero_url");
    }

    if (await columnExists("heroType")) {
      await queryInterface.renameColumn(tableName, "heroType", "hero_type");
    }

    if (await columnExists("publishedAt")) {
      await queryInterface.renameColumn(tableName, "publishedAt", "published_at");
    }
  },

  async down(queryInterface, Sequelize) {
    const tableName = "editorials";

    const columnExists = async (columnName) => {
      const [results] = await queryInterface.sequelize.query(
        `
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = :table
            AND column_name = :column;
        `,
        { replacements: { table: tableName, column: columnName } }
      );
      return results.length > 0;
    };

    if (await columnExists("hero_url")) {
      await queryInterface.renameColumn(tableName, "hero_url", "heroUrl");
    }

    if (await columnExists("hero_type")) {
      await queryInterface.renameColumn(tableName, "hero_type", "heroType");
    }

    if (await columnExists("published_at")) {
      await queryInterface.renameColumn(tableName, "published_at", "publishedAt");
    }
  }
};


