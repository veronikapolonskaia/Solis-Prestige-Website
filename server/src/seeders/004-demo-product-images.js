'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('product_images', [
      // iPhone 15 Pro Images
      {
        id: '880e8400-e29b-41d4-a716-446655440001',
        product_id: '770e8400-e29b-41d4-a716-446655440001',
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        alt_text: 'iPhone 15 Pro - Front View',
        sort_order: 1,
        is_main: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '880e8400-e29b-41d4-a716-446655440002',
        product_id: '770e8400-e29b-41d4-a716-446655440001',
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        alt_text: 'iPhone 15 Pro - Back View',
        sort_order: 2,
        is_main: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '880e8400-e29b-41d4-a716-446655440003',
        product_id: '770e8400-e29b-41d4-a716-446655440001',
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        alt_text: 'iPhone 15 Pro - Side View',
        sort_order: 3,
        is_main: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Samsung Galaxy S24 Images
      {
        id: '880e8400-e29b-41d4-a716-446655440004',
        product_id: '770e8400-e29b-41d4-a716-446655440002',
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        alt_text: 'Samsung Galaxy S24 - Front View',
        sort_order: 1,
        is_main: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '880e8400-e29b-41d4-a716-446655440005',
        product_id: '770e8400-e29b-41d4-a716-446655440002',
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        alt_text: 'Samsung Galaxy S24 - Back View',
        sort_order: 2,
        is_main: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // MacBook Pro Images
      {
        id: '880e8400-e29b-41d4-a716-446655440006',
        product_id: '770e8400-e29b-41d4-a716-446655440003',
        url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        alt_text: 'MacBook Pro 16" - Front View',
        sort_order: 1,
        is_main: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '880e8400-e29b-41d4-a716-446655440007',
        product_id: '770e8400-e29b-41d4-a716-446655440003',
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        alt_text: 'MacBook Pro 16" - Keyboard View',
        sort_order: 2,
        is_main: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Dell XPS 15 Images
      {
        id: '880e8400-e29b-41d4-a716-446655440008',
        product_id: '770e8400-e29b-41d4-a716-446655440004',
        url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        alt_text: 'Dell XPS 15 - Front View',
        sort_order: 1,
        is_main: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Men's T-Shirt Images
      {
        id: '880e8400-e29b-41d4-a716-446655440009',
        product_id: '770e8400-e29b-41d4-a716-446655440005',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        alt_text: 'Men\'s Classic T-Shirt - Front View',
        sort_order: 1,
        is_main: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '880e8400-e29b-41d4-a716-446655440010',
        product_id: '770e8400-e29b-41d4-a716-446655440005',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        alt_text: 'Men\'s Classic T-Shirt - Back View',
        sort_order: 2,
        is_main: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Women's Summer Dress Images
      {
        id: '880e8400-e29b-41d4-a716-446655440011',
        product_id: '770e8400-e29b-41d4-a716-446655440006',
        url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
        alt_text: 'Women\'s Summer Dress - Front View',
        sort_order: 1,
        is_main: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '880e8400-e29b-41d4-a716-446655440012',
        product_id: '770e8400-e29b-41d4-a716-446655440006',
        url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
        alt_text: 'Women\'s Summer Dress - Back View',
        sort_order: 2,
        is_main: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Kitchen Stand Mixer Images
      {
        id: '880e8400-e29b-41d4-a716-446655440013',
        product_id: '770e8400-e29b-41d4-a716-446655440007',
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        alt_text: 'Kitchen Stand Mixer - Main View',
        sort_order: 1,
        is_main: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // The Great Gatsby Book Images
      {
        id: '880e8400-e29b-41d4-a716-446655440014',
        product_id: '770e8400-e29b-41d4-a716-446655440008',
        url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
        alt_text: 'The Great Gatsby - Book Cover',
        sort_order: 1,
        is_main: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Wireless Bluetooth Headphones Images
      {
        id: '880e8400-e29b-41d4-a716-446655440015',
        product_id: '770e8400-e29b-41d4-a716-446655440009',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        alt_text: 'Wireless Bluetooth Headphones - Main View',
        sort_order: 1,
        is_main: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '880e8400-e29b-41d4-a716-446655440016',
        product_id: '770e8400-e29b-41d4-a716-446655440009',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        alt_text: 'Wireless Bluetooth Headphones - Side View',
        sort_order: 2,
        is_main: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Smart Home Security Camera Images
      {
        id: '880e8400-e29b-41d4-a716-446655440017',
        product_id: '770e8400-e29b-41d4-a716-446655440010',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt_text: 'Smart Home Security Camera - Main View',
        sort_order: 1,
        is_main: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_images', null, {});
  }
}; 