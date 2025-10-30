'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('order_items', [
      // Order 1 - John Doe's delivered order
      {
        id: 'cc0e8400-e29b-41d4-a716-446655440001',
        order_id: 'bb0e8400-e29b-41d4-a716-446655440001',
        product_id: '770e8400-e29b-41d4-a716-446655440001',
        variant_id: '990e8400-e29b-41d4-a716-446655440001',
        quantity: 1,
        price: 999.00,
        total: 999.00,
        product_name: 'iPhone 15 Pro',
        variant_name: '128GB - Natural Titanium',
        sku: 'IPHONE-15-PRO-128-NATURAL',
        weight: 0.187,
        attributes: JSON.stringify({
          storage: '128GB',
          color: 'Natural Titanium'
        }),
        created_at: new Date('2024-12-01T09:30:00Z'),
        updated_at: new Date('2024-12-01T09:30:00Z')
      },
      {
        id: 'cc0e8400-e29b-41d4-a716-446655440002',
        order_id: 'bb0e8400-e29b-41d4-a716-446655440001',
        product_id: '770e8400-e29b-41d4-a716-446655440005',
        variant_id: '990e8400-e29b-41d4-a716-446655440011',
        quantity: 1,
        price: 24.99,
        total: 24.99,
        product_name: 'Men\'s Classic T-Shirt',
        variant_name: 'Medium - Black',
        sku: 'MENS-TSHIRT-CLASSIC-M-BLACK',
        weight: 0.2,
        attributes: JSON.stringify({
          size: 'Medium',
          color: 'Black'
        }),
        created_at: new Date('2024-12-01T09:30:00Z'),
        updated_at: new Date('2024-12-01T09:30:00Z')
      },
      
      // Order 2 - Jane Smith's shipped order
      {
        id: 'cc0e8400-e29b-41d4-a716-446655440003',
        order_id: 'bb0e8400-e29b-41d4-a716-446655440002',
        product_id: '770e8400-e29b-41d4-a716-446655440003',
        variant_id: '990e8400-e29b-41d4-a716-446655440006',
        quantity: 1,
        price: 2499.00,
        total: 2499.00,
        product_name: 'MacBook Pro 16"',
        variant_name: 'M3 Pro - 18GB RAM - 512GB SSD',
        sku: 'MACBOOK-PRO-16-M3-18-512',
        weight: 2.15,
        attributes: JSON.stringify({
          processor: 'M3 Pro',
          memory: '18GB RAM',
          storage: '512GB SSD'
        }),
        created_at: new Date('2024-12-02T15:45:00Z'),
        updated_at: new Date('2024-12-02T15:45:00Z')
      },
      
      // Order 3 - John Doe's processing order
      {
        id: 'cc0e8400-e29b-41d4-a716-446655440004',
        order_id: 'bb0e8400-e29b-41d4-a716-446655440003',
        product_id: '770e8400-e29b-41d4-a716-446655440008',
        variant_id: null,
        quantity: 1,
        price: 12.99,
        total: 12.99,
        product_name: 'The Great Gatsby',
        variant_name: null,
        sku: 'BOOK-GATSBY-PAPERBACK',
        weight: 0.3,
        attributes: JSON.stringify({}),
        created_at: new Date('2024-12-03T12:20:00Z'),
        updated_at: new Date('2024-12-03T12:20:00Z')
      },
      {
        id: 'cc0e8400-e29b-41d4-a716-446655440005',
        order_id: 'bb0e8400-e29b-41d4-a716-446655440003',
        product_id: '770e8400-e29b-41d4-a716-446655440006',
        variant_id: '990e8400-e29b-41d4-a716-446655440015',
        quantity: 1,
        price: 89.99,
        total: 89.99,
        product_name: 'Women\'s Summer Dress',
        variant_name: 'Medium - Floral Blue',
        sku: 'WOMENS-DRESS-SUMMER-M-FLORAL-BLUE',
        weight: 0.3,
        attributes: JSON.stringify({
          size: 'Medium',
          color: 'Floral Blue',
          pattern: 'Floral'
        }),
        created_at: new Date('2024-12-03T12:20:00Z'),
        updated_at: new Date('2024-12-03T12:20:00Z')
      },
      {
        id: 'cc0e8400-e29b-41d4-a716-446655440006',
        order_id: 'bb0e8400-e29b-41d4-a716-446655440003',
        product_id: '770e8400-e29b-41d4-a716-446655440005',
        variant_id: '990e8400-e29b-41d4-a716-446655440013',
        quantity: 1,
        price: 24.99,
        total: 24.99,
        product_name: 'Men\'s Classic T-Shirt',
        variant_name: 'Medium - White',
        sku: 'MENS-TSHIRT-CLASSIC-M-WHITE',
        weight: 0.2,
        attributes: JSON.stringify({
          size: 'Medium',
          color: 'White'
        }),
        created_at: new Date('2024-12-03T12:20:00Z'),
        updated_at: new Date('2024-12-03T12:20:00Z')
      },
      
      // Order 4 - Mike Wilson's pending order
      {
        id: 'cc0e8400-e29b-41d4-a716-446655440007',
        order_id: 'bb0e8400-e29b-41d4-a716-446655440004',
        product_id: '770e8400-e29b-41d4-a716-446655440007',
        variant_id: null,
        quantity: 1,
        price: 299.99,
        total: 299.99,
        product_name: 'Kitchen Stand Mixer',
        variant_name: null,
        sku: 'KITCHEN-MIXER-STAND',
        weight: 4.5,
        attributes: JSON.stringify({}),
        created_at: new Date('2024-12-04T10:15:00Z'),
        updated_at: new Date('2024-12-04T10:15:00Z')
      },
      
      // Order 5 - Guest cancelled order
      {
        id: 'cc0e8400-e29b-41d4-a716-446655440008',
        order_id: 'bb0e8400-e29b-41d4-a716-446655440005',
        product_id: '770e8400-e29b-41d4-a716-446655440009',
        variant_id: null,
        quantity: 1,
        price: 199.99,
        total: 199.99,
        product_name: 'Wireless Bluetooth Headphones',
        variant_name: null,
        sku: 'HEADPHONES-BLUETOOTH-WIRELESS',
        weight: 0.25,
        attributes: JSON.stringify({}),
        created_at: new Date('2024-12-05T14:30:00Z'),
        updated_at: new Date('2024-12-05T14:30:00Z')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('order_items', null, {});
  }
}; 