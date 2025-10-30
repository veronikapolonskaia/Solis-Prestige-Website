const { Gallery } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const galleryItems = [
      {
        title: 'Princess Birthday Party',
        description: 'A magical princess-themed birthday party with elegant decorations, custom centerpieces, and a beautiful cake display that made the birthday girl feel like royalty.',
        image_url: '/uploads/placeholder-gallery-1.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-1.jpg',
        category: 'birthday',
        featured: true,
        display_order: 1,
        alt_text: 'Princess birthday party setup with pink and gold decorations',
        tags: ['princess', 'birthday', 'pink', 'gold', 'elegant'],
        metadata: {
          event_date: '2024-01-15',
          guest_count: 25,
          theme: 'Princess'
        },
        status: 'active'
      },
      {
        title: 'Corporate Team Building Event',
        description: 'A professional corporate event featuring modern decor, branded elements, and sophisticated lighting for a company team building celebration.',
        image_url: '/uploads/placeholder-gallery-2.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-2.jpg',
        category: 'corporate',
        featured: true,
        display_order: 2,
        alt_text: 'Corporate team building event with modern decorations',
        tags: ['corporate', 'team building', 'professional', 'modern'],
        metadata: {
          event_date: '2024-02-20',
          guest_count: 150,
          company: 'Tech Solutions Inc'
        },
        status: 'active'
      },
      {
        title: 'Garden Wedding Reception',
        description: 'A romantic outdoor wedding reception with flowing fabrics, floral arrangements, and twinkling lights creating an enchanting atmosphere.',
        image_url: '/uploads/placeholder-gallery-3.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-3.jpg',
        category: 'wedding',
        featured: true,
        display_order: 3,
        alt_text: 'Romantic garden wedding reception setup',
        tags: ['wedding', 'garden', 'romantic', 'outdoor', 'floral'],
        metadata: {
          event_date: '2024-03-10',
          guest_count: 80,
          couple: 'Sarah & Michael'
        },
        status: 'active'
      },
      {
        title: 'School Spring Carnival',
        description: 'A vibrant school carnival with colorful decorations, fun games, and festive atmosphere that brought joy to students and families.',
        image_url: '/uploads/placeholder-gallery-4.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-4.jpg',
        category: 'school',
        featured: false,
        display_order: 4,
        alt_text: 'Colorful school spring carnival setup',
        tags: ['school', 'carnival', 'spring', 'colorful', 'fun'],
        metadata: {
          event_date: '2024-04-15',
          guest_count: 200,
          school: 'Lincoln Elementary'
        },
        status: 'active'
      },
      {
        title: 'Community Summer Festival',
        description: 'A large community festival celebrating summer with food vendors, entertainment stages, and family-friendly activities.',
        image_url: '/uploads/placeholder-gallery-5.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-5.jpg',
        category: 'festival',
        featured: false,
        display_order: 5,
        alt_text: 'Community summer festival with multiple activity areas',
        tags: ['festival', 'community', 'summer', 'outdoor', 'family'],
        metadata: {
          event_date: '2024-06-22',
          guest_count: 500,
          location: 'Central Park'
        },
        status: 'active'
      },
      {
        title: 'Superhero Birthday Bash',
        description: 'An action-packed superhero themed birthday party with custom decorations, hero capes, and exciting activities for young heroes.',
        image_url: '/uploads/placeholder-gallery-6.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-6.jpg',
        category: 'birthday',
        featured: false,
        display_order: 6,
        alt_text: 'Superhero themed birthday party with action decorations',
        tags: ['superhero', 'birthday', 'action', 'kids', 'adventure'],
        metadata: {
          event_date: '2024-01-30',
          guest_count: 20,
          theme: 'Superhero'
        },
        status: 'active'
      },
      {
        title: 'Product Launch Event',
        description: 'A sleek product launch event with modern design elements, interactive displays, and professional lighting to showcase the new product.',
        image_url: '/uploads/placeholder-gallery-7.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-7.jpg',
        category: 'corporate',
        featured: false,
        display_order: 7,
        alt_text: 'Modern product launch event setup',
        tags: ['corporate', 'product launch', 'modern', 'professional', 'tech'],
        metadata: {
          event_date: '2024-02-28',
          guest_count: 100,
          product: 'NextGen Mobile App'
        },
        status: 'active'
      },
      {
        title: 'Beach Wedding Celebration',
        description: 'A stunning beach wedding with ocean views, elegant beach decor, and a romantic sunset ceremony that created unforgettable memories.',
        image_url: '/uploads/placeholder-gallery-8.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-8.jpg',
        category: 'wedding',
        featured: false,
        display_order: 8,
        alt_text: 'Beautiful beach wedding with ocean backdrop',
        tags: ['wedding', 'beach', 'ocean', 'romantic', 'sunset'],
        metadata: {
          event_date: '2024-05-18',
          guest_count: 60,
          couple: 'Emma & James',
          location: 'Malibu Beach'
        },
        status: 'active'
      },
      {
        title: 'Graduation Celebration',
        description: 'A proud graduation celebration honoring academic achievements with elegant decorations, photo backdrops, and celebratory atmosphere.',
        image_url: '/uploads/placeholder-gallery-9.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-9.jpg',
        category: 'school',
        featured: false,
        display_order: 9,
        alt_text: 'Graduation celebration with academic decorations',
        tags: ['graduation', 'school', 'achievement', 'celebration', 'academic'],
        metadata: {
          event_date: '2024-05-25',
          guest_count: 120,
          school: 'Riverside High School'
        },
        status: 'active'
      },
      {
        title: 'Holiday Winter Festival',
        description: 'A festive winter holiday celebration with twinkling lights, warm decorations, and seasonal activities that brought holiday cheer to the community.',
        image_url: '/uploads/placeholder-gallery-10.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-10.jpg',
        category: 'festival',
        featured: false,
        display_order: 10,
        alt_text: 'Winter holiday festival with festive decorations',
        tags: ['holiday', 'winter', 'festival', 'christmas', 'festive'],
        metadata: {
          event_date: '2024-12-15',
          guest_count: 300,
          season: 'Winter'
        },
        status: 'active'
      },
      {
        title: 'Princess Tea Party',
        description: 'An elegant princess tea party with delicate china, floral arrangements, and sophisticated decorations for a refined celebration.',
        image_url: '/uploads/placeholder-gallery-11.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-11.jpg',
        category: 'birthday',
        featured: false,
        display_order: 11,
        alt_text: 'Elegant princess tea party setup',
        tags: ['princess', 'tea party', 'elegant', 'floral', 'sophisticated'],
        metadata: {
          event_date: '2024-03-05',
          guest_count: 15,
          theme: 'Princess Tea Party'
        },
        status: 'active'
      },
      {
        title: 'Annual Conference',
        description: 'A professional annual conference with modern presentation areas, networking spaces, and high-tech equipment for a successful business event.',
        image_url: '/uploads/placeholder-gallery-12.jpg',
        thumbnail_url: '/uploads/placeholder-gallery-12.jpg',
        category: 'corporate',
        featured: false,
        display_order: 12,
        alt_text: 'Professional annual conference setup',
        tags: ['conference', 'corporate', 'professional', 'business', 'networking'],
        metadata: {
          event_date: '2024-04-08',
          guest_count: 300,
          industry: 'Technology'
        },
        status: 'active'
      }
    ];

    // Create placeholder images if they don't exist
    const placeholderImages = [
      '/uploads/placeholder-gallery-1.jpg',
      '/uploads/placeholder-gallery-2.jpg',
      '/uploads/placeholder-gallery-3.jpg',
      '/uploads/placeholder-gallery-4.jpg',
      '/uploads/placeholder-gallery-5.jpg',
      '/uploads/placeholder-gallery-6.jpg',
      '/uploads/placeholder-gallery-7.jpg',
      '/uploads/placeholder-gallery-8.jpg',
      '/uploads/placeholder-gallery-9.jpg',
      '/uploads/placeholder-gallery-10.jpg',
      '/uploads/placeholder-gallery-11.jpg',
      '/uploads/placeholder-gallery-12.jpg'
    ];

    // For now, we'll use a generic placeholder for all images
    // In a real application, you would upload actual images
    const genericPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdhbGxlcnkgSW1hZ2U8L3RleHQ+PC9zdmc+';

    // Update all gallery items to use the generic placeholder
    const updatedGalleryItems = galleryItems.map(item => ({
      ...item,
      image_url: genericPlaceholder,
      thumbnail_url: genericPlaceholder
    }));

    await Gallery.bulkCreate(updatedGalleryItems);
  },

  down: async (queryInterface, Sequelize) => {
    await Gallery.destroy({ where: {} });
  }
};
