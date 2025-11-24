#!/usr/bin/env node

/**
 * Lightweight migration runner that works without sequelize-cli.
 * Uses Umzug directly so we can run migrations in environments
 * (like Railway) where npm/npx are not available at runtime.
 */

const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const dbConfig = require('../src/config/database');

const sequelize = dbConfig.sequelize;
if (!sequelize) {
  console.error('Sequelize instance not found in config/database.js');
  process.exit(1);
}

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, '../src/migrations/*.js'),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

async function run() {
  try {
    await sequelize.authenticate();
    await umzug.up();
    await sequelize.close();
    console.log('✅ Database migrations complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to run migrations:', error);
    try {
      await sequelize.close();
    } catch (_) {}
    process.exit(1);
  }
}

run();

