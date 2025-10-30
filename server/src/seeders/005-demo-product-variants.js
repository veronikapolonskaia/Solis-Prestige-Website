'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('product_variants', [
      // iPhone 15 Pro Variants
      {
        id: '990e8400-e29b-41d4-a716-446655440001',
        product_id: '770e8400-e29b-41d4-a716-446655440001',
        name: '128GB - Natural Titanium',
        sku: 'IPHONE-15-PRO-128-NATURAL',
        price: 999.00,
        quantity: 25,
        weight: 0.187,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        attributes: JSON.stringify({
          storage: '128GB',
          color: 'Natural Titanium',
          capacity: '128GB'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440002',
        product_id: '770e8400-e29b-41d4-a716-446655440001',
        name: '256GB - Natural Titanium',
        sku: 'IPHONE-15-PRO-256-NATURAL',
        price: 1099.00,
        quantity: 15,
        weight: 0.187,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        attributes: JSON.stringify({
          storage: '256GB',
          color: 'Natural Titanium',
          capacity: '256GB'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440003',
        product_id: '770e8400-e29b-41d4-a716-446655440001',
        name: '128GB - Blue Titanium',
        sku: 'IPHONE-15-PRO-128-BLUE',
        price: 999.00,
        quantity: 10,
        weight: 0.187,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        attributes: JSON.stringify({
          storage: '128GB',
          color: 'Blue Titanium',
          capacity: '128GB'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Samsung Galaxy S24 Variants
      {
        id: '990e8400-e29b-41d4-a716-446655440004',
        product_id: '770e8400-e29b-41d4-a716-446655440002',
        name: '256GB - Phantom Black',
        sku: 'SAMSUNG-S24-256-BLACK',
        price: 899.00,
        quantity: 20,
        weight: 0.168,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        attributes: JSON.stringify({
          storage: '256GB',
          color: 'Phantom Black',
          capacity: '256GB'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440005',
        product_id: '770e8400-e29b-41d4-a716-446655440002',
        name: '512GB - Phantom Black',
        sku: 'SAMSUNG-S24-512-BLACK',
        price: 999.00,
        quantity: 15,
        weight: 0.168,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        attributes: JSON.stringify({
          storage: '512GB',
          color: 'Phantom Black',
          capacity: '512GB'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // MacBook Pro Variants
      {
        id: '990e8400-e29b-41d4-a716-446655440006',
        product_id: '770e8400-e29b-41d4-a716-446655440003',
        name: 'M3 Pro - 18GB RAM - 512GB SSD',
        sku: 'MACBOOK-PRO-16-M3-18-512',
        price: 2499.00,
        quantity: 10,
        weight: 2.15,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        attributes: JSON.stringify({
          processor: 'M3 Pro',
          memory: '18GB RAM',
          storage: '512GB SSD',
          configuration: 'M3 Pro - 18GB RAM - 512GB SSD'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440007',
        product_id: '770e8400-e29b-41d4-a716-446655440003',
        name: 'M3 Pro - 36GB RAM - 1TB SSD',
        sku: 'MACBOOK-PRO-16-M3-36-1TB',
        price: 2999.00,
        quantity: 10,
        weight: 2.15,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        attributes: JSON.stringify({
          processor: 'M3 Pro',
          memory: '36GB RAM',
          storage: '1TB SSD',
          configuration: 'M3 Pro - 36GB RAM - 1TB SSD'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Dell XPS 15 Variants
      {
        id: '990e8400-e29b-41d4-a716-446655440008',
        product_id: '770e8400-e29b-41d4-a716-446655440004',
        name: 'Intel i7 - 16GB RAM - 512GB SSD',
        sku: 'DELL-XPS-15-I7-16-512',
        price: 1899.00,
        quantity: 8,
        weight: 1.8,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        attributes: JSON.stringify({
          processor: 'Intel i7',
          memory: '16GB RAM',
          storage: '512GB SSD',
          configuration: 'Intel i7 - 16GB RAM - 512GB SSD'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440009',
        product_id: '770e8400-e29b-41d4-a716-446655440004',
        name: 'Intel i9 - 32GB RAM - 1TB SSD',
        sku: 'DELL-XPS-15-I9-32-1TB',
        price: 2499.00,
        quantity: 7,
        weight: 1.8,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        attributes: JSON.stringify({
          processor: 'Intel i9',
          memory: '32GB RAM',
          storage: '1TB SSD',
          configuration: 'Intel i9 - 32GB RAM - 1TB SSD'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Men's T-Shirt Variants
      {
        id: '990e8400-e29b-41d4-a716-446655440010',
        product_id: '770e8400-e29b-41d4-a716-446655440005',
        name: 'Small - Black',
        sku: 'MENS-TSHIRT-CLASSIC-S-BLACK',
        price: 24.99,
        quantity: 25,
        weight: 0.2,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        attributes: JSON.stringify({
          size: 'Small',
          color: 'Black',
          fit: 'Regular'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440011',
        product_id: '770e8400-e29b-41d4-a716-446655440005',
        name: 'Medium - Black',
        sku: 'MENS-TSHIRT-CLASSIC-M-BLACK',
        price: 24.99,
        quantity: 30,
        weight: 0.2,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        attributes: JSON.stringify({
          size: 'Medium',
          color: 'Black',
          fit: 'Regular'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440012',
        product_id: '770e8400-e29b-41d4-a716-446655440005',
        name: 'Large - Black',
        sku: 'MENS-TSHIRT-CLASSIC-L-BLACK',
        price: 24.99,
        quantity: 25,
        weight: 0.2,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        attributes: JSON.stringify({
          size: 'Large',
          color: 'Black',
          fit: 'Regular'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440013',
        product_id: '770e8400-e29b-41d4-a716-446655440005',
        name: 'Medium - White',
        sku: 'MENS-TSHIRT-CLASSIC-M-WHITE',
        price: 24.99,
        quantity: 20,
        weight: 0.2,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        attributes: JSON.stringify({
          size: 'Medium',
          color: 'White',
          fit: 'Regular'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Women's Summer Dress Variants
      {
        id: '990e8400-e29b-41d4-a716-446655440014',
        product_id: '770e8400-e29b-41d4-a716-446655440006',
        name: 'Small - Floral Blue',
        sku: 'WOMENS-DRESS-SUMMER-S-FLORAL-BLUE',
        price: 89.99,
        quantity: 15,
        weight: 0.3,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
        attributes: JSON.stringify({
          size: 'Small',
          color: 'Floral Blue',
          pattern: 'Floral'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440015',
        product_id: '770e8400-e29b-41d4-a716-446655440006',
        name: 'Medium - Floral Blue',
        sku: 'WOMENS-DRESS-SUMMER-M-FLORAL-BLUE',
        price: 89.99,
        quantity: 20,
        weight: 0.3,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
        attributes: JSON.stringify({
          size: 'Medium',
          color: 'Floral Blue',
          pattern: 'Floral'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440016',
        product_id: '770e8400-e29b-41d4-a716-446655440006',
        name: 'Large - Floral Blue',
        sku: 'WOMENS-DRESS-SUMMER-L-FLORAL-BLUE',
        price: 89.99,
        quantity: 15,
        weight: 0.3,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
        attributes: JSON.stringify({
          size: 'Large',
          color: 'Floral Blue',
          pattern: 'Floral'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440017',
        product_id: '770e8400-e29b-41d4-a716-446655440006',
        name: 'Medium - Solid White',
        sku: 'WOMENS-DRESS-SUMMER-M-SOLID-WHITE',
        price: 89.99,
        quantity: 25,
        weight: 0.3,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
        attributes: JSON.stringify({
          size: 'Medium',
          color: 'Solid White',
          pattern: 'Solid'
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_variants', null, {});
  }
}; 