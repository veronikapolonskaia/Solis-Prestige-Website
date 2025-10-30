const PluginBase = require('../../PluginBase');
const { DataTypes } = require('sequelize');

class CouponsPlugin extends PluginBase {
  constructor() {
    super('coupons', '1.0.0');
    this.dependencies = ['email']; // Depends on email plugin for notifications
  }

  async initialize(app, db) {
    super.initialize(app, db);
    
    // Create coupon model
    this.Coupon = this.createCouponModel(db);
    
    // Sync the model
    await this.Coupon.sync();
    
    // Add coupon routes
    const couponRoutes = require('./routes');
    app.use('/api/coupons', couponRoutes);
    
    console.log('Coupons Plugin initialized');
  }

  createCouponModel(db) {
    return db.define('Coupon', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50]
        }
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM('percentage', 'fixed', 'free_shipping'),
        allowNull: false,
        defaultValue: 'percentage'
      },
      value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      minimumOrderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
        field: 'minimum_order_amount'
      },
      maximumDiscount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'maximum_discount'
      },
      usageLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1
        },
        field: 'usage_limit'
      },
      usageCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'usage_count'
      },
      perUserLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1
        },
        field: 'per_user_limit'
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date'
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
      },
      applicableProducts: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of product IDs or "all"',
        field: 'applicable_products'
      },
      applicableCategories: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of category IDs or "all"',
        field: 'applicable_categories'
      },
      excludedProducts: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of product IDs to exclude',
        field: 'excluded_products'
      },
      excludedCategories: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of category IDs to exclude',
        field: 'excluded_categories'
      },
      firstTimeOnly: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'first_time_only'
      },
      stackable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      tableName: 'coupons',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['code']
        },
        {
          fields: ['is_active', 'start_date', 'end_date']
        }
      ]
    });
  }

  async validateCoupon(code, userId, orderAmount = 0, products = []) {
    try {
      const coupon = await this.Coupon.findOne({
        where: {
          code: code.toUpperCase(),
          isActive: true
        }
      });

      if (!coupon) {
        return { valid: false, message: 'Invalid coupon code' };
      }

      // Check if coupon is expired
      const now = new Date();
      if (now < coupon.startDate || now > coupon.endDate) {
        return { valid: false, message: 'Coupon is not active' };
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return { valid: false, message: 'Coupon usage limit reached' };
      }

      // Check minimum order amount
      if (coupon.minimumOrderAmount && orderAmount < coupon.minimumOrderAmount) {
        return { 
          valid: false, 
          message: `Minimum order amount of $${coupon.minimumOrderAmount} required` 
        };
      }

      // Check per user limit
      if (coupon.perUserLimit) {
        const userUsage = await this.getUserCouponUsage(coupon.id, userId);
        if (userUsage >= coupon.perUserLimit) {
          return { valid: false, message: 'You have reached the usage limit for this coupon' };
        }
      }

      // Check first time only
      if (coupon.firstTimeOnly) {
        const hasOrderedBefore = await this.hasUserOrderedBefore(userId);
        if (hasOrderedBefore) {
          return { valid: false, message: 'This coupon is for first-time customers only' };
        }
      }

      // Check product applicability
      const productValidation = this.validateProductApplicability(coupon, products);
      if (!productValidation.valid) {
        return productValidation;
      }

      return { 
        valid: true, 
        coupon: coupon.toJSON(),
        discount: this.calculateDiscount(coupon, orderAmount)
      };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return { valid: false, message: 'Error validating coupon' };
    }
  }

  validateProductApplicability(coupon, products) {
    // If no specific products/categories are set, coupon applies to all
    if (!coupon.applicableProducts && !coupon.applicableCategories) {
      return { valid: true };
    }

    // Check if products are in excluded categories
    if (coupon.excludedCategories && coupon.excludedCategories.length > 0) {
      for (const product of products) {
        if (coupon.excludedCategories.includes(product.categoryId)) {
          return { valid: false, message: 'Coupon cannot be applied to some items in your cart' };
        }
      }
    }

    // Check if products are in excluded products
    if (coupon.excludedProducts && coupon.excludedProducts.length > 0) {
      for (const product of products) {
        if (coupon.excludedProducts.includes(product.id)) {
          return { valid: false, message: 'Coupon cannot be applied to some items in your cart' };
        }
      }
    }

    // Check applicable products
    if (coupon.applicableProducts && coupon.applicableProducts !== 'all') {
      const applicableProductIds = coupon.applicableProducts;
      const hasApplicableProduct = products.some(product => 
        applicableProductIds.includes(product.id)
      );
      
      if (!hasApplicableProduct) {
        return { valid: false, message: 'Coupon is not applicable to items in your cart' };
      }
    }

    // Check applicable categories
    if (coupon.applicableCategories && coupon.applicableCategories !== 'all') {
      const applicableCategoryIds = coupon.applicableCategories;
      const hasApplicableCategory = products.some(product => 
        applicableCategoryIds.includes(product.categoryId)
      );
      
      if (!hasApplicableCategory) {
        return { valid: false, message: 'Coupon is not applicable to items in your cart' };
      }
    }

    return { valid: true };
  }

  calculateDiscount(coupon, orderAmount) {
    let discount = 0;

    switch (coupon.type) {
      case 'percentage':
        discount = (orderAmount * coupon.value) / 100;
        break;
      case 'fixed':
        discount = coupon.value;
        break;
      case 'free_shipping':
        // This would be handled separately in shipping calculation
        discount = 0;
        break;
    }

    // Apply maximum discount limit
    if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }

    // Ensure discount doesn't exceed order amount
    if (discount > orderAmount) {
      discount = orderAmount;
    }

    return Math.round(discount * 100) / 100; // Round to 2 decimal places
  }

  async applyCoupon(couponId, userId) {
    try {
      const coupon = await this.Coupon.findByPk(couponId);
      if (!coupon) {
        throw new Error('Coupon not found');
      }

      // Increment usage count
      await coupon.increment('usageCount');

      // Record user usage
      await this.recordUserCouponUsage(couponId, userId);

      return true;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }

  async getUserCouponUsage(couponId, userId) {
    // This would typically query a coupon_usage table
    // For now, we'll return 0 as a placeholder
    return 0;
  }

  async recordUserCouponUsage(couponId, userId) {
    // This would typically insert into a coupon_usage table
    // For now, we'll just log it
    console.log(`User ${userId} used coupon ${couponId}`);
  }

  async hasUserOrderedBefore(userId) {
    // This would typically query the orders table
    // For now, we'll return false as a placeholder
    return false;
  }

  async createCoupon(couponData) {
    try {
      const coupon = await this.Coupon.create({
        ...couponData,
        code: couponData.code.toUpperCase()
      });

      return coupon;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  }

  async updateCoupon(id, updateData) {
    try {
      const coupon = await this.Coupon.findByPk(id);
      if (!coupon) {
        throw new Error('Coupon not found');
      }

      if (updateData.code) {
        updateData.code = updateData.code.toUpperCase();
      }

      await coupon.update(updateData);
      return coupon;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  }

  async deleteCoupon(id) {
    try {
      const coupon = await this.Coupon.findByPk(id);
      if (!coupon) {
        throw new Error('Coupon not found');
      }

      await coupon.destroy();
      return true;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  }

  async getCoupons(filters = {}) {
    try {
      const whereClause = {};

      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      if (filters.type) {
        whereClause.type = filters.type;
      }

      const coupons = await this.Coupon.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']]
      });

      return coupons;
    } catch (error) {
      console.error('Error getting coupons:', error);
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
      Coupon: this.Coupon
    };
  }
}

module.exports = CouponsPlugin; 