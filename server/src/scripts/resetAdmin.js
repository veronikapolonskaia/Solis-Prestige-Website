const { User } = require('../models');
const { sequelize } = require('../config/database');

async function resetAdminUser() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Delete existing admin user if exists
    const deletedCount = await User.destroy({ 
      where: { email: 'admin@example.com' } 
    });

    if (deletedCount > 0) {
      console.log('🗑️  Deleted existing admin user');
    } else {
      console.log('ℹ️  No existing admin user found');
    }

    // Create new admin user (password will be hashed automatically by the model hook)
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      emailVerified: true
    });

    console.log('✅ Admin user created successfully');
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('Active:', adminUser.isActive);
    console.log('\n📝 Login Credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error resetting admin user:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
resetAdminUser();
