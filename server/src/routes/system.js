const express = require('express');
const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const { sequelize } = require('../config/database');

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

    const umzug = new Umzug({
      migrations: { glob: path.join(__dirname, '../migrations/*.js') },
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

