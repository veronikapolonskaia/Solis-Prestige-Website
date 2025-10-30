'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('carts', [
      // John Doe's cart items
      {
        id: 'dd0e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        session_id: null,
        product_id: '770e8400-e29b-41d4-a716-446655440002',
        variant_id: '990e8400-e29b-41d4-a716-446655440004',
        quantity: 1,
        price: 899.00,
        attributes: JSON.stringify({
          storage: '256GB',
          color: 'Phantom Black'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'dd0e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        session_id: null,
        product_id: '770e8400-e29b-41d4-a716-446655440009',
        variant_id: null,
        quantity: 2,
        price: 199.99,
        attributes: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Jane Smith's cart items
      {
        id: 'dd0e8400-e29b-41d4-a716-446655440003',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        session_id: null,
        product_id: '770e8400-e29b-41d4-a716-446655440004',
        variant_id: '990e8400-e29b-41d4-a716-446655440008',
        quantity: 1,
        price: 1899.00,
        attributes: JSON.stringify({
          processor: 'Intel i7',
          memory: '16GB RAM',
          storage: '512GB SSD'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'dd0e8400-e29b-41d4-a716-446655440004',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        session_id: null,
        product_id: '770e8400-e29b-41d4-a716-446655440010',
        variant_id: null,
        quantity: 1,
        price: 149.99,
        attributes: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Mike Wilson's cart items
      {
        id: 'dd0e8400-e29b-41d4-a716-446655440005',
        user_id: '550e8400-e29b-41d4-a716-446655440004',
        session_id: null,
        product_id: '770e8400-e29b-41d4-a716-446655440005',
        variant_id: '990e8400-e29b-41d4-a716-446655440012',
        quantity: 3,
        price: 24.99,
        attributes: JSON.stringify({
          size: 'Large',
          color: 'Black'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Guest cart items (no user_id, using session_id)
      {
        id: 'dd0e8400-e29b-41d4-a716-446655440006',
        user_id: null,
        session_id: 'guest-session-001',
        product_id: '770e8400-e29b-41d4-a716-446655440008',
        variant_id: null,
        quantity: 1,
        price: 12.99,
        attributes: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'dd0e8400-e29b-41d4-a716-446655440007',
        user_id: null,
        session_id: 'guest-session-001',
        product_id: '770e8400-e29b-41d4-a716-446655440006',
        variant_id: '990e8400-e29b-41d4-a716-446655440017',
        quantity: 1,
        price: 89.99,
        attributes: JSON.stringify({
          size: 'Medium',
          color: 'Solid White',
          pattern: 'Solid'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Another guest session
      {
        id: 'dd0e8400-e29b-41d4-a716-446655440008',
        user_id: null,
        session_id: 'guest-session-002',
        product_id: '770e8400-e29b-41d4-a716-446655440001',
        variant_id: '990e8400-e29b-41d4-a716-446655440003',
        quantity: 1,
        price: 999.00,
        attributes: JSON.stringify({
          storage: '128GB',
          color: 'Blue Titanium'
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('carts', null, {});
  }
}; 