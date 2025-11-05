const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if table already exists
    const tableExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hotels'
      );`
    );
    
    if (tableExists[0][0].exists) {
      console.log('Hotels table already exists, skipping creation');
      return;
    }

    await queryInterface.createTable('hotels', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      short_description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      images: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
      main_image: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      special_offer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      offer_title: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      offer_details: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      offer_valid_until: {
        type: DataTypes.DATE,
        allowNull: true
      },
      offer_booking_deadline: {
        type: DataTypes.DATE,
        allowNull: true
      },
      offer_blackout_dates: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD'
      },
      vip_benefits: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      hotel_details: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      popular: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      display_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      meta_title: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      meta_description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // Add indexes (only if they don't exist)
    const checkIndex = async (indexName) => {
      const indexExists = await queryInterface.sequelize.query(
        `SELECT EXISTS (
          SELECT FROM pg_indexes 
          WHERE schemaname = 'public' 
          AND indexname = '${indexName}'
        );`
      );
      return indexExists[0][0].exists;
    };

    if (!await checkIndex('hotels_slug')) {
      await queryInterface.addIndex('hotels', ['slug'], { unique: true, name: 'hotels_slug' });
    }
    if (!await checkIndex('hotels_is_active_idx')) {
      await queryInterface.addIndex('hotels', ['is_active'], { name: 'hotels_is_active_idx' });
    }
    if (!await checkIndex('hotels_featured_idx')) {
      await queryInterface.addIndex('hotels', ['featured'], { name: 'hotels_featured_idx' });
    }
    if (!await checkIndex('hotels_popular_idx')) {
      await queryInterface.addIndex('hotels', ['popular'], { name: 'hotels_popular_idx' });
    }
    if (!await checkIndex('hotels_special_offer_idx')) {
      await queryInterface.addIndex('hotels', ['special_offer'], { name: 'hotels_special_offer_idx' });
    }
    if (!await checkIndex('hotels_city_idx')) {
      await queryInterface.addIndex('hotels', ['city'], { name: 'hotels_city_idx' });
    }
    if (!await checkIndex('hotels_country_idx')) {
      await queryInterface.addIndex('hotels', ['country'], { name: 'hotels_country_idx' });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hotels');
  }
};

