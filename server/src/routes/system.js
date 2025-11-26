const express = require('express');
const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const { sequelize, Sequelize } = require('../config/database');

const router = express.Router();

/**
 * @route   GET /api/system/db-health
 * @desc    Check database connectivity status
 * @access  Public (read-only)
 */
router.get('/db-health', async (_req, res) => {
  const startedAt = Date.now();
  try {
    await sequelize.authenticate();
    return res.json({
      success: true,
      message: 'Database connection is healthy',
      latencyMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error('Database healthcheck failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to connect to the database',
      details: error.message,
    });
  }
});

/**
 * @route   POST /api/system/migrate
 * @desc    Temporary endpoint to trigger database migrations
 * @access  Protected via MIGRATION_TOKEN header/query param
 */
router.post('/migrate', async (req, res) => {
  const expectedToken = process.env.MIGRATION_TOKEN;
  const providedToken = req.headers['x-migration-token'] || req.query.token;

  if (!expectedToken) {
    return res.status(403).json({
      success: false,
      error: 'Migration endpoint disabled. Set MIGRATION_TOKEN to enable it.',
    });
  }

  if (expectedToken !== providedToken) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or missing migration token.',
    });
  }

  try {
    await sequelize.authenticate();

    // Enable UUID extension if it doesn't exist
    try {
      await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
      console.log('✅ UUID extension enabled');
    } catch (extError) {
      // Extension might already exist or there might be a permission issue
      console.warn('⚠️  Could not enable UUID extension (may already exist):', extError.message);
    }

    const umzug = new Umzug({
      migrations: { 
        glob: path.join(__dirname, '../migrations/*.js'),
        resolve: ({ name, path: migrationPath, context }) => {
          const migration = require(migrationPath);
          return {
            name,
            up: async () => migration.up(context, Sequelize),
            down: async () => migration.down(context, Sequelize),
          };
        },
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });

    const pending = await umzug.pending();

    if (!pending.length) {
      return res.json({
        success: true,
        message: 'No pending migrations. Database is up to date.',
      });
    }

    const executed = await umzug.up();

    return res.json({
      success: true,
      message: 'Migrations executed successfully',
      migrated: executed.map((migration) => migration.name),
    });
  } catch (error) {
    console.error('Migration endpoint failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to run migrations',
      details: error.message,
    });
  }
});

module.exports = router;

