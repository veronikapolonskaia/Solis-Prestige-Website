const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sequelize } = require('../config/database');

async function createAdminUser() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@example.com' } 
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('Active:', existingAdmin.isActive);
      return;
    }

    // Create admin user (password will be hashed automatically by the model hook)
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
    console.error('❌ Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
createAdminUser(); 