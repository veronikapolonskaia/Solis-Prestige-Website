const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    }
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
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
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Images must be an array');
        }
      }
    }
  },
  mainImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  specialOffer: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  offerTitle: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  offerDetails: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  offerValidUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  offerBookingDeadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  offerBlackoutDates: {
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
  vipBenefits: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  hotelDetails: {
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
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  metaTitle: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'hotels',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['slug'],
      unique: true,
      name: 'hotels_slug_unique'
    }
    // Note: Other indexes are created via migration to avoid underscored naming conflicts
  ],
  hooks: {
    beforeValidate: (hotel) => {
      // Generate slug from name if not provided
      if (hotel.name && !hotel.slug) {
        hotel.slug = hotel.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    }
  }
});

module.exports = Hotel;

