'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('addresses', [
      // John Doe's addresses
      {
        id: 'aa0e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        type: 'billing',
        first_name: 'John',
        last_name: 'Doe',
        company: 'Tech Solutions Inc.',
        address1: '123 Main Street',
        address2: 'Suite 100',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'US',
        phone: '+1234567891',
        is_default: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'aa0e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        type: 'shipping',
        first_name: 'John',
        last_name: 'Doe',
        company: '',
        address1: '456 Oak Avenue',
        address2: 'Apt 5B',
        city: 'Brooklyn',
        state: 'NY',
        zip_code: '11201',
        country: 'US',
        phone: '+1234567891',
        is_default: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'aa0e8400-e29b-41d4-a716-446655440003',
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        type: 'shipping',
        first_name: 'John',
        last_name: 'Doe',
        company: '',
        address1: '789 Work Street',
        address2: 'Floor 3',
        city: 'Manhattan',
        state: 'NY',
        zip_code: '10005',
        country: 'US',
        phone: '+1234567891',
        is_default: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Jane Smith's addresses
      {
        id: 'aa0e8400-e29b-41d4-a716-446655440004',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        type: 'billing',
        first_name: 'Jane',
        last_name: 'Smith',
        company: 'Design Studio LLC',
        address1: '321 Creative Lane',
        address2: '',
        city: 'Los Angeles',
        state: 'CA',
        zip_code: '90210',
        country: 'US',
        phone: '+1234567892',
        is_default: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'aa0e8400-e29b-41d4-a716-446655440005',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        type: 'shipping',
        first_name: 'Jane',
        last_name: 'Smith',
        company: '',
        address1: '654 Beach Road',
        address2: 'Unit 12',
        city: 'Santa Monica',
        state: 'CA',
        zip_code: '90401',
        country: 'US',
        phone: '+1234567892',
        is_default: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Mike Wilson's addresses
      {
        id: 'aa0e8400-e29b-41d4-a716-446655440006',
        user_id: '550e8400-e29b-41d4-a716-446655440004',
        type: 'billing',
        first_name: 'Mike',
        last_name: 'Wilson',
        company: '',
        address1: '987 University Blvd',
        address2: 'Apt 8C',
        city: 'Austin',
        state: 'TX',
        zip_code: '78701',
        country: 'US',
        phone: '+1234567893',
        is_default: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'aa0e8400-e29b-41d4-a716-446655440007',
        user_id: '550e8400-e29b-41d4-a716-446655440004',
        type: 'shipping',
        first_name: 'Mike',
        last_name: 'Wilson',
        company: '',
        address1: '987 University Blvd',
        address2: 'Apt 8C',
        city: 'Austin',
        state: 'TX',
        zip_code: '78701',
        country: 'US',
        phone: '+1234567893',
        is_default: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('addresses', null, {});
  }
}; 