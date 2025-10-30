'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'admin@ecommerce.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        phone: '+1234567890',
        role: 'admin',
        is_active: true,
        email_verified: true,
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'john.doe@example.com',
        password: hashedPassword,
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567891',
        role: 'customer',
        is_active: true,
        email_verified: true,
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+1234567892',
        role: 'customer',
        is_active: true,
        email_verified: true,
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        email: 'mike.wilson@example.com',
        password: hashedPassword,
        first_name: 'Mike',
        last_name: 'Wilson',
        phone: '+1234567893',
        role: 'customer',
        is_active: true,
        email_verified: false,
        last_login: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
}; 