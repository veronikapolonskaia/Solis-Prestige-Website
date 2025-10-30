const PluginBase = require('../../PluginBase');

/**
 * Inventory Plugin
 * Provides inventory tracking, low stock alerts, and stock management
 */
class InventoryPlugin extends PluginBase {
  constructor() {
    super('inventory', '1.0.0');
    this.dependencies = [];
  }

  /**
   * Plugin-specific initialization
   */
  async onInitialize() {
    // Set up inventory tracking
    this.setupInventoryTracking();
    
    // Set up low stock alerts
    this.setupLowStockAlerts();
    
    console.log('Inventory plugin initialized');
  }

  /**
   * Set up inventory tracking hooks
   */
  setupInventoryTracking() {
    const { Product, ProductVariant, OrderItem } = this.db.models;
    
    // Track inventory changes when orders are created
    OrderItem.addHook('afterCreate', async (orderItem) => {
      await this.updateInventory(orderItem);
    });

    // Track inventory changes when orders are updated
    OrderItem.addHook('afterUpdate', async (orderItem) => {
      await this.updateInventory(orderItem);
    });
  }

  /**
   * Set up low stock alerts
   */
  setupLowStockAlerts() {
    // Check for low stock items periodically
    setInterval(async () => {
      await this.checkLowStock();
    }, 24 * 60 * 60 * 1000); // Check daily
  }

  /**
   * Update inventory levels
   * @param {Object} orderItem - Order item that was created/updated
   */
  async updateInventory(orderItem) {
    try {
      const { Product, ProductVariant } = this.db.models;
      
      if (orderItem.variantId) {
        // Update variant inventory
        const variant = await ProductVariant.findByPk(orderItem.variantId);
        if (variant) {
          variant.quantity = Math.max(0, variant.quantity - orderItem.quantity);
          await variant.save();
        }
      } else {
        // Update product inventory
        const product = await Product.findByPk(orderItem.productId);
        if (product && product.trackQuantity) {
          product.quantity = Math.max(0, product.quantity - orderItem.quantity);
          await product.save();
        }
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  }

  /**
   * Check for low stock items
   */
  async checkLowStock() {
    try {
      const { Product, ProductVariant } = this.db.models;
      
      // Find products with low stock
      const lowStockProducts = await Product.findAll({
        where: {
          trackQuantity: true,
          quantity: {
            [this.db.Sequelize.Op.lte]: 10 // Low stock threshold
          },
          isActive: true
        }
      });

      // Find variants with low stock
      const lowStockVariants = await ProductVariant.findAll({
        where: {
          quantity: {
            [this.db.Sequelize.Op.lte]: 5 // Low stock threshold for variants
          }
        },
        include: [{
          model: Product,
          as: 'product',
          where: { isActive: true }
        }]
      });

      // Send alerts if any low stock items found
      if (lowStockProducts.length > 0 || lowStockVariants.length > 0) {
        await this.sendLowStockAlert(lowStockProducts, lowStockVariants);
      }
    } catch (error) {
      console.error('Error checking low stock:', error);
    }
  }

  /**
   * Send low stock alert
   * @param {Array} products - Low stock products
   * @param {Array} variants - Low stock variants
   */
  async sendLowStockAlert(products, variants) {
    // This would typically send an email or notification
    console.log('Low stock alert:', {
      products: products.map(p => ({ name: p.name, quantity: p.quantity })),
      variants: variants.map(v => ({ 
        name: `${v.product.name} - ${v.name}`, 
        quantity: v.quantity 
      }))
    });
  }

  /**
   * Get inventory routes
   */
  getRoutes() {
    const express = require('express');
    const router = express.Router();

    // Get inventory levels
    router.get('/levels', async (req, res) => {
      try {
        const { Product, ProductVariant } = this.db.models;
        
        const products = await Product.findAll({
          where: { trackQuantity: true },
          include: [{
            model: ProductVariant,
            as: 'variants'
          }]
        });

        res.json({
          success: true,
          data: products.map(product => ({
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            variants: product.variants.map(variant => ({
              id: variant.id,
              name: variant.name,
              quantity: variant.quantity
            }))
          }))
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to get inventory levels'
        });
      }
    });

    // Update inventory levels
    router.put('/levels/:productId', async (req, res) => {
      try {
        const { productId } = req.params;
        const { quantity, variantId } = req.body;

        const { Product, ProductVariant } = this.db.models;

        if (variantId) {
          const variant = await ProductVariant.findByPk(variantId);
          if (variant) {
            variant.quantity = quantity;
            await variant.save();
          }
        } else {
          const product = await Product.findByPk(productId);
          if (product) {
            product.quantity = quantity;
            await product.save();
          }
        }

        res.json({ success: true });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to update inventory'
        });
      }
    });

    // Get low stock items
    router.get('/low-stock', async (req, res) => {
      try {
        const { Product, ProductVariant } = this.db.models;
        
        const lowStockProducts = await Product.findAll({
          where: {
            trackQuantity: true,
            quantity: {
              [this.db.Sequelize.Op.lte]: 10
            },
            isActive: true
          }
        });

        const lowStockVariants = await ProductVariant.findAll({
          where: {
            quantity: {
              [this.db.Sequelize.Op.lte]: 5
            }
          },
          include: [{
            model: Product,
            as: 'product',
            where: { isActive: true }
          }]
        });

        res.json({
          success: true,
          data: {
            products: lowStockProducts,
            variants: lowStockVariants
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to get low stock items'
        });
      }
    });

    return [{
      path: '/api/inventory',
      router,
      middleware: []
    }];
  }

  /**
   * Get inventory middleware
   */
  getMiddleware() {
    return [];
  }

  /**
   * Get inventory models (none needed for this plugin)
   */
  getModels() {
    return {};
  }

  /**
   * Plugin-specific installation
   */
  async onInstall() {
    console.log('Inventory plugin installed');
  }

  /**
   * Plugin-specific uninstallation
   */
  async onUninstall() {
    console.log('Inventory plugin uninstalled');
  }
}

module.exports = InventoryPlugin; 