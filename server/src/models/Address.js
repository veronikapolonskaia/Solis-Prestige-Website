const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('billing', 'shipping'),
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'US'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'addresses',
  hooks: {
    beforeCreate: async (address) => {
      // If this is the first address of this type for the user, make it default
      if (!address.isDefault) {
        const existingAddresses = await Address.count({
          where: { 
            userId: address.userId,
            type: address.type
          }
        });
        if (existingAddresses === 0) {
          address.isDefault = true;
        }
      }
    },
    beforeUpdate: async (address) => {
      // If this address is being set as default, unset other default addresses of the same type
      if (address.changed('isDefault') && address.isDefault) {
        await Address.update(
          { isDefault: false },
          { 
            where: { 
              userId: address.userId,
              type: address.type,
              id: { [sequelize.Op.ne]: address.id }
            }
          }
        );
      }
    }
  }
});

// Instance method to get full name
Address.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Instance method to get formatted address
Address.prototype.getFormattedAddress = function() {
  let address = this.address1;
  if (this.address2) {
    address += `\n${this.address2}`;
  }
  address += `\n${this.city}, ${this.state} ${this.zipCode}`;
  address += `\n${this.country}`;
  return address;
};

// Instance method to get address for orders
Address.prototype.toOrderAddress = function() {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    company: this.company,
    address1: this.address1,
    address2: this.address2,
    city: this.city,
    state: this.state,
    zipCode: this.zipCode,
    country: this.country,
    phone: this.phone
  };
};

module.exports = Address; 