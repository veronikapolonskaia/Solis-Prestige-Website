const express = require('express');
const path = require('path');
const fs = require('fs');
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

/**
 * @route   POST /api/system/seed
 * @desc    Run database seeders to populate with demo data
 * @access  Protected via MIGRATION_TOKEN header/query param
 * @query   action: 'run' (default), 'undo', or 'reset'
 */
router.post('/seed', async (req, res) => {
  const expectedToken = process.env.MIGRATION_TOKEN;
  const providedToken = req.headers['x-migration-token'] || req.query.token;
  const action = req.query.action || req.body.action || 'run'; // run, undo, or reset

  if (!expectedToken) {
    return res.status(403).json({
      success: false,
      error: 'Seeding endpoint disabled. Set MIGRATION_TOKEN to enable it.',
    });
  }

  if (expectedToken !== providedToken) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or missing migration token.',
    });
  }

  if (!['run', 'undo', 'reset'].includes(action)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid action. Use "run", "undo", or "reset".',
    });
  }

  try {
    await sequelize.authenticate();

    const seederDir = path.join(__dirname, '../seeders');
    const seederFiles = fs.readdirSync(seederDir)
      .filter(file => file.endsWith('.js') && file !== 'index.js' && file !== 'test-seeders.js' && file !== 'README.md')
      .sort();

    if (action === 'undo') {
      // Undo seeders in reverse order
      const reversedFiles = [...seederFiles].reverse();
      const undone = [];

      for (const file of reversedFiles) {
        try {
          const seeder = require(path.join(seederDir, file));
          if (typeof seeder.down === 'function') {
            await seeder.down(sequelize.getQueryInterface(), Sequelize);
            undone.push(file);
            console.log(`✅ Undone seeder: ${file}`);
          }
        } catch (error) {
          console.error(`❌ Error undoing ${file}:`, error);
          throw error;
        }
      }

      return res.json({
        success: true,
        message: 'Seeders undone successfully',
        undone: undone,
      });
    } else if (action === 'reset') {
      // Undo all, then run all
      const reversedFiles = [...seederFiles].reverse();
      
      // Undo phase
      for (const file of reversedFiles) {
        const seeder = require(path.join(seederDir, file));
        if (typeof seeder.down === 'function') {
          await seeder.down(sequelize.getQueryInterface(), Sequelize);
          console.log(`✅ Undone seeder: ${file}`);
        }
      }

      // Run phase
      const executed = [];
      for (const file of seederFiles) {
        const seeder = require(path.join(seederDir, file));
        if (typeof seeder.up === 'function') {
          await seeder.up(sequelize.getQueryInterface(), Sequelize);
          executed.push(file);
          console.log(`✅ Executed seeder: ${file}`);
        }
      }

      return res.json({
        success: true,
        message: 'Database reset (unseed + seed) completed successfully',
        executed: executed,
      });
    } else {
      // Run seeders in order
      const executed = [];

      for (const file of seederFiles) {
        try {
          const seeder = require(path.join(seederDir, file));
          if (typeof seeder.up === 'function') {
            await seeder.up(sequelize.getQueryInterface(), Sequelize);
            executed.push(file);
            console.log(`✅ Executed seeder: ${file}`);
          }
        } catch (error) {
          console.error(`❌ Error running ${file}:`, error);
          throw error;
        }
      }

      return res.json({
        success: true,
        message: 'Seeders executed successfully',
        executed: executed,
        summary: {
          users: '4 demo users (admin + 3 customers)',
          categories: '10 categories with hierarchical structure',
          products: '10 products across different categories',
          images: '17 product images',
          variants: '17 product variants',
          addresses: '7 user addresses',
          orders: '5 orders with various statuses',
          orderItems: '8 order items',
          cartItems: '8 cart items',
          gallery: '12 gallery items',
          credentials: {
            admin: 'admin@ecommerce.com / password123',
            customers: [
              'john.doe@example.com / password123',
              'jane.smith@example.com / password123',
              'mike.wilson@example.com / password123'
            ]
          }
        }
      });
    }
  } catch (error) {
    console.error('Seeding endpoint failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to run seeders',
      details: error.message,
    });
  }
});

module.exports = router;

