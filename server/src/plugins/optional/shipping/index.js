const PluginBase = require('../../PluginBase');
const { DataTypes } = require('sequelize');

class ShippingPlugin extends PluginBase {
  constructor() {
    super('shipping', '1.0.0');
    this.dependencies = ['products'];
  }

  async initialize(app, db) {
    super.initialize(app, db);
    this.ShippingMethod = this.createShippingMethodModel(db);
    this.ShippingZone = this.createShippingZoneModel(db);
    this.ShippingRate = this.createShippingRateModel(db);
    this.ShippingRule = this.createShippingRuleModel(db);
    
    await this.ShippingMethod.sync();
    await this.ShippingZone.sync();
    await this.ShippingRate.sync();
    await this.ShippingRule.sync();
    
    const shippingRoutes = require('./routes');
    app.use('/api/shipping', shippingRoutes);
    
    console.log('Shipping Plugin initialized');
  }

  createShippingMethodModel(db) {
    return db.define('ShippingMethod', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM('flat_rate', 'free', 'weight_based', 'price_based', 'custom'),
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      settings: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Method-specific settings'
      }
    }, {
      tableName: 'shipping_methods',
      timestamps: true
    });
  }

  createShippingZoneModel(db) {
    return db.define('ShippingZone', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      countries: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Array of country codes'
      },
      states: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of state codes (optional)'
      },
      zipCodes: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of zip code patterns'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'shipping_zones',
      timestamps: true
    });
  }

  createShippingRateModel(db) {
    return db.define('ShippingRate', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      methodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'shipping_methods',
          key: 'id'
        }
      },
      zoneId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'shipping_zones',
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      minOrderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Minimum order amount for this rate'
      },
      maxOrderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Maximum order amount for this rate'
      },
      minWeight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Minimum weight in kg'
      },
      maxWeight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Maximum weight in kg'
      },
      deliveryTime: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Estimated delivery time (e.g., "3-5 business days")'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      tableName: 'shipping_rates',
      timestamps: true,
      indexes: [
        {
          fields: ['methodId', 'zoneId']
        }
      ]
    });
  }

  createShippingRuleModel(db) {
    return db.define('ShippingRule', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('free_shipping', 'discount', 'surcharge', 'restriction'),
        allowNull: false
      },
      condition: {
        type: DataTypes.ENUM('order_total', 'order_weight', 'product_count', 'category', 'product'),
        allowNull: false
      },
      operator: {
        type: DataTypes.ENUM('equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal', 'contains', 'not_contains'),
        allowNull: false
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false
      },
      action: {
        type: DataTypes.ENUM('free_shipping', 'discount_amount', 'discount_percentage', 'surcharge_amount', 'surcharge_percentage', 'hide_method'),
        allowNull: false
      },
      actionValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      priority: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      tableName: 'shipping_rules',
      timestamps: true
    });
  }

  async calculateShippingRates(orderData, address) {
    try {
      const { items, subtotal, weight } = orderData;
      
      // Find applicable shipping zones
      const applicableZones = await this.findApplicableZones(address);
      
      if (applicableZones.length === 0) {
        return [];
      }

      const rates = [];
      
      for (const zone of applicableZones) {
        const zoneRates = await this.ShippingRate.findAll({
          where: { 
            zoneId: zone.id,
            isActive: true
          },
          include: [
            {
              model: this.ShippingMethod,
              as: 'method',
              where: { isActive: true }
            }
          ],
          order: [['sortOrder', 'ASC']]
        });

        for (const rate of zoneRates) {
          const calculatedRate = await this.calculateRate(rate, orderData, address);
          if (calculatedRate) {
            rates.push(calculatedRate);
          }
        }
      }

      // Apply shipping rules
      const rules = await this.ShippingRule.findAll({
        where: { isActive: true },
        order: [['priority', 'DESC']]
      });

      for (const rule of rules) {
        await this.applyShippingRule(rule, rates, orderData);
      }

      // Sort by cost
      rates.sort((a, b) => a.cost - b.cost);
      
      return rates;
    } catch (error) {
      console.error('Error calculating shipping rates:', error);
      return [];
    }
  }

  async findApplicableZones(address) {
    try {
      const zones = await this.ShippingZone.findAll({
        where: { isActive: true }
      });

      return zones.filter(zone => {
        // Check country
        if (!zone.countries.includes(address.country)) {
          return false;
        }

        // Check state if specified
        if (zone.states && zone.states.length > 0) {
          if (!zone.states.includes(address.state)) {
            return false;
          }
        }

        // Check zip code if specified
        if (zone.zipCodes && zone.zipCodes.length > 0) {
          const zipMatch = zone.zipCodes.some(pattern => {
            if (pattern.includes('*')) {
              const regex = new RegExp(pattern.replace(/\*/g, '.*'));
              return regex.test(address.zipCode);
            }
            return pattern === address.zipCode;
          });
          if (!zipMatch) {
            return false;
          }
        }

        return true;
      });
    } catch (error) {
      console.error('Error finding applicable zones:', error);
      return [];
    }
  }

  async calculateRate(rate, orderData, address) {
    try {
      const { subtotal, weight } = orderData;
      
      // Check minimum/maximum order amount
      if (rate.minOrderAmount && subtotal < rate.minOrderAmount) {
        return null;
      }
      if (rate.maxOrderAmount && subtotal > rate.maxOrderAmount) {
        return null;
      }

      // Check minimum/maximum weight
      if (rate.minWeight && weight < rate.minWeight) {
        return null;
      }
      if (rate.maxWeight && weight > rate.maxWeight) {
        return null;
      }

      let cost = parseFloat(rate.cost);

      // Apply method-specific calculations
      const method = rate.method;
      if (method.settings) {
        switch (method.type) {
          case 'weight_based':
            if (method.settings.costPerKg) {
              cost = weight * parseFloat(method.settings.costPerKg);
            }
            break;
          
          case 'price_based':
            if (method.settings.costPercentage) {
              cost = subtotal * (parseFloat(method.settings.costPercentage) / 100);
            }
            break;
        }
      }

      return {
        id: rate.id,
        name: rate.name,
        methodId: rate.methodId,
        methodName: rate.method.name,
        methodCode: rate.method.code,
        cost: Math.max(0, cost),
        deliveryTime: rate.deliveryTime,
        zoneId: rate.zoneId
      };
    } catch (error) {
      console.error('Error calculating rate:', error);
      return null;
    }
  }

  async applyShippingRule(rule, rates, orderData) {
    try {
      const { subtotal, weight, items } = orderData;
      let conditionMet = false;

      switch (rule.condition) {
        case 'order_total':
          conditionMet = this.evaluateCondition(subtotal, rule.operator, parseFloat(rule.value));
          break;
        
        case 'order_weight':
          conditionMet = this.evaluateCondition(weight, rule.operator, parseFloat(rule.value));
          break;
        
        case 'product_count':
          const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
          conditionMet = this.evaluateCondition(itemCount, rule.operator, parseInt(rule.value));
          break;
        
        case 'category':
          const categoryIds = items.map(item => item.categoryId).filter(Boolean);
          conditionMet = this.evaluateCondition(categoryIds, rule.operator, rule.value);
          break;
        
        case 'product':
          const productIds = items.map(item => item.productId);
          conditionMet = this.evaluateCondition(productIds, rule.operator, rule.value);
          break;
      }

      if (conditionMet) {
        switch (rule.action) {
          case 'free_shipping':
            rates.forEach(rate => {
              rate.cost = 0;
              rate.name += ' (Free)';
            });
            break;
          
          case 'discount_amount':
            rates.forEach(rate => {
              rate.cost = Math.max(0, rate.cost - parseFloat(rule.actionValue));
            });
            break;
          
          case 'discount_percentage':
            rates.forEach(rate => {
              rate.cost = rate.cost * (1 - parseFloat(rule.actionValue) / 100);
            });
            break;
          
          case 'surcharge_amount':
            rates.forEach(rate => {
              rate.cost += parseFloat(rule.actionValue);
            });
            break;
          
          case 'surcharge_percentage':
            rates.forEach(rate => {
              rate.cost = rate.cost * (1 + parseFloat(rule.actionValue) / 100);
            });
            break;
          
          case 'hide_method':
            const methodToHide = rule.value;
            const filteredRates = rates.filter(rate => rate.methodCode !== methodToHide);
            rates.length = 0;
            rates.push(...filteredRates);
            break;
        }
      }
    } catch (error) {
      console.error('Error applying shipping rule:', error);
    }
  }

  evaluateCondition(actualValue, operator, expectedValue) {
    switch (operator) {
      case 'equals':
        return actualValue === expectedValue;
      
      case 'greater_than':
        return actualValue > expectedValue;
      
      case 'less_than':
        return actualValue < expectedValue;
      
      case 'greater_than_or_equal':
        return actualValue >= expectedValue;
      
      case 'less_than_or_equal':
        return actualValue <= expectedValue;
      
      case 'contains':
        if (Array.isArray(actualValue)) {
          return actualValue.includes(expectedValue);
        }
        return actualValue.toString().includes(expectedValue);
      
      case 'not_contains':
        if (Array.isArray(actualValue)) {
          return !actualValue.includes(expectedValue);
        }
        return !actualValue.toString().includes(expectedValue);
      
      default:
        return false;
    }
  }

  async createShippingMethod(methodData) {
    try {
      return await this.ShippingMethod.create(methodData);
    } catch (error) {
      console.error('Error creating shipping method:', error);
      throw error;
    }
  }

  async updateShippingMethod(id, updateData) {
    try {
      const method = await this.ShippingMethod.findByPk(id);
      if (!method) {
        throw new Error('Shipping method not found');
      }

      await method.update(updateData);
      return method;
    } catch (error) {
      console.error('Error updating shipping method:', error);
      throw error;
    }
  }

  async deleteShippingMethod(id) {
    try {
      const method = await this.ShippingMethod.findByPk(id);
      if (!method) {
        throw new Error('Shipping method not found');
      }

      await method.destroy();
      return true;
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      throw error;
    }
  }

  async createShippingZone(zoneData) {
    try {
      return await this.ShippingZone.create(zoneData);
    } catch (error) {
      console.error('Error creating shipping zone:', error);
      throw error;
    }
  }

  async updateShippingZone(id, updateData) {
    try {
      const zone = await this.ShippingZone.findByPk(id);
      if (!zone) {
        throw new Error('Shipping zone not found');
      }

      await zone.update(updateData);
      return zone;
    } catch (error) {
      console.error('Error updating shipping zone:', error);
      throw error;
    }
  }

  async deleteShippingZone(id) {
    try {
      const zone = await this.ShippingZone.findByPk(id);
      if (!zone) {
        throw new Error('Shipping zone not found');
      }

      await zone.destroy();
      return true;
    } catch (error) {
      console.error('Error deleting shipping zone:', error);
      throw error;
    }
  }

  getRoutes() {
    return require('./routes');
  }

  getMiddleware() {
    return [];
  }

  getModels() {
    return {
      ShippingMethod: this.ShippingMethod,
      ShippingZone: this.ShippingZone,
      ShippingRate: this.ShippingRate,
      ShippingRule: this.ShippingRule
    };
  }
}

module.exports = ShippingPlugin; 