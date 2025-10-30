const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

/**
 * Run all seeders in order
 */
async function runAllSeeders() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Get all seeder files in order
    const seederFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.js') && file !== 'index.js')
      .sort(); // This will sort them numerically (001, 002, etc.)
    
    console.log(`Found ${seederFiles.length} seeder files`);
    
    for (const file of seederFiles) {
      console.log(`\n📦 Running seeder: ${file}`);
      
      const seeder = require(path.join(__dirname, file));
      
      if (typeof seeder.up === 'function') {
        await seeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        console.log(`✅ Completed: ${file}`);
      } else {
        console.log(`⚠️  Skipping ${file} - no up function found`);
      }
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeded data includes:');
    console.log('   • 4 demo users (admin + 3 customers)');
    console.log('   • 10 categories with hierarchical structure');
    console.log('   • 10 products across different categories');
    console.log('   • 17 product images');
    console.log('   • 17 product variants with different configurations');
    console.log('   • 7 user addresses');
    console.log('   • 5 orders with various statuses');
    console.log('   • 8 order items');
    console.log('   • 8 cart items (users + guests)');
    console.log('   • 12 gallery items with categories and metadata');
    
    console.log('\n🔑 Demo login credentials:');
    console.log('   Admin: admin@ecommerce.com / password123');
    console.log('   Customer: john.doe@example.com / password123');
    console.log('   Customer: jane.smith@example.com / password123');
    console.log('   Customer: mike.wilson@example.com / password123');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

/**
 * Undo all seeders in reverse order
 */
async function undoAllSeeders() {
  try {
    console.log('🗑️  Starting database unseeding...');
    
    // Get all seeder files in reverse order
    const seederFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.js') && file !== 'index.js')
      .sort()
      .reverse(); // Reverse to undo in correct order
    
    console.log(`Found ${seederFiles.length} seeder files to undo`);
    
    for (const file of seederFiles) {
      console.log(`\n🗑️  Undoing seeder: ${file}`);
      
      const seeder = require(path.join(__dirname, file));
      
      if (typeof seeder.down === 'function') {
        await seeder.down(sequelize.getQueryInterface(), sequelize.Sequelize);
        console.log(`✅ Undone: ${file}`);
      } else {
        console.log(`⚠️  Skipping ${file} - no down function found`);
      }
    }
    
    console.log('\n🎉 Database unseeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during unseeding:', error);
    throw error;
  }
}

/**
 * Reset database (undo all + run all)
 */
async function resetDatabase() {
  try {
    console.log('🔄 Starting database reset...');
    await undoAllSeeders();
    console.log('\n' + '='.repeat(50) + '\n');
    await runAllSeeders();
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  }
}

// Export functions for use in scripts
module.exports = {
  runAllSeeders,
  undoAllSeeders,
  resetDatabase
};

// If this file is run directly, run all seeders
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'undo':
      undoAllSeeders()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
    case 'reset':
      resetDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
    default:
      runAllSeeders()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
  }
} 