'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categories', [
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronic gadgets and devices',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        parent_id: null,
        is_active: true,
        sort_order: 1,
        meta_title: 'Electronics - Best Deals on Gadgets',
        meta_description: 'Shop the latest electronics including smartphones, laptops, and smart devices',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones from top brands',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        parent_id: '660e8400-e29b-41d4-a716-446655440001',
        is_active: true,
        sort_order: 1,
        meta_title: 'Smartphones - Latest Models',
        meta_description: 'Discover the latest smartphones with cutting-edge features',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        name: 'Laptops',
        slug: 'laptops',
        description: 'High-performance laptops for work and gaming',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        parent_id: '660e8400-e29b-41d4-a716-446655440001',
        is_active: true,
        sort_order: 2,
        meta_title: 'Laptops - Work and Gaming',
        meta_description: 'Powerful laptops for productivity and entertainment',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440004',
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
        parent_id: null,
        is_active: true,
        sort_order: 2,
        meta_title: 'Fashion - Latest Trends',
        meta_description: 'Discover the latest fashion trends and styles',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440005',
        name: 'Men\'s Clothing',
        slug: 'mens-clothing',
        description: 'Stylish clothing for men',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        parent_id: '660e8400-e29b-41d4-a716-446655440004',
        is_active: true,
        sort_order: 1,
        meta_title: 'Men\'s Clothing - Style & Comfort',
        meta_description: 'Premium men\'s clothing for every occasion',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440006',
        name: 'Women\'s Clothing',
        slug: 'womens-clothing',
        description: 'Elegant clothing for women',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
        parent_id: '660e8400-e29b-41d4-a716-446655440004',
        is_active: true,
        sort_order: 2,
        meta_title: 'Women\'s Clothing - Elegant Styles',
        meta_description: 'Beautiful women\'s clothing for every style',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440007',
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Everything for your home and garden',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        parent_id: null,
        is_active: true,
        sort_order: 3,
        meta_title: 'Home & Garden - Make Your Space Beautiful',
        meta_description: 'Transform your home and garden with our quality products',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440008',
        name: 'Kitchen & Dining',
        slug: 'kitchen-dining',
        description: 'Kitchen appliances and dining essentials',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        parent_id: '660e8400-e29b-41d4-a716-446655440007',
        is_active: true,
        sort_order: 1,
        meta_title: 'Kitchen & Dining - Culinary Excellence',
        meta_description: 'Professional kitchen equipment and dining accessories',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440009',
        name: 'Books',
        slug: 'books',
        description: 'Books for all ages and interests',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        parent_id: null,
        is_active: true,
        sort_order: 4,
        meta_title: 'Books - Knowledge & Entertainment',
        meta_description: 'Explore our vast collection of books across all genres',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440010',
        name: 'Fiction',
        slug: 'fiction',
        description: 'Fiction books and novels',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        parent_id: '660e8400-e29b-41d4-a716-446655440009',
        is_active: true,
        sort_order: 1,
        meta_title: 'Fiction Books - Stories That Inspire',
        meta_description: 'Discover captivating fiction books and novels',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
}; 