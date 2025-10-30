const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductImage = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  altText: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isMain: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'product_images',
  hooks: {
    beforeCreate: async (image) => {
      // If this is the first image for the product, make it the main image
      if (!image.isMain) {
        const existingImages = await ProductImage.count({
          where: { productId: image.productId }
        });
        if (existingImages === 0) {
          image.isMain = true;
        }
      }
    },
    beforeUpdate: async (image) => {
      // If this image is being set as main, unset other main images
      if (image.changed('isMain') && image.isMain) {
        await ProductImage.update(
          { isMain: false },
          { 
            where: { 
              productId: image.productId,
              id: { [sequelize.Op.ne]: image.id }
            }
          }
        );
      }
    }
  }
});

module.exports = ProductImage; 