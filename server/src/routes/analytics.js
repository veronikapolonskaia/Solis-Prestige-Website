const express = require('express');
const { query, validationResult } = require('express-validator');
const { Order, OrderItem, Product, User, Category } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @route   GET /api/analytics/sales
 * @desc    Get sales analytics
 * @access  Private (Admin)
 */
router.get('/sales', authenticate, requireAdmin, [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid period'),
  query('groupBy').optional().isIn(['day', 'week', 'month', 'year']).withMessage('Invalid group by')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { startDate, endDate, period = 'monthly', groupBy = 'month' } = req.query;

    // Set default date range if not provided
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      start = new Date();
      start.setMonth(start.getMonth() - 12); // Default to last 12 months
    }

    // Build where clause
    const where = {
      createdAt: {
        [Op.between]: [start, end]
      },
      status: {
        [Op.notIn]: ['cancelled']
      }
    };

    // Get sales data
    const salesData = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn('DATE', sequelize.col('Order.created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('Order.id')), 'orderCount'],
        [sequelize.fn('SUM', sequelize.col('Order.total')), 'totalSales'],
        [sequelize.fn('AVG', sequelize.col('Order.total')), 'averageOrderValue']
      ],
      group: [sequelize.fn('DATE', sequelize.col('Order.created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('Order.created_at')), 'ASC']]
    });

    // Get summary statistics
    const summary = await Order.findOne({
      where,
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('Order.id')), 'totalOrders'],
        [sequelize.fn('SUM', sequelize.col('Order.total')), 'totalRevenue'],
        [sequelize.fn('AVG', sequelize.col('Order.total')), 'averageOrderValue'],
        [sequelize.fn('MIN', sequelize.col('Order.total')), 'minOrderValue'],
        [sequelize.fn('MAX', sequelize.col('Order.total')), 'maxOrderValue']
      ]
    });

    // Get payment method distribution
    const paymentMethods = await Order.findAll({
      where,
      attributes: [
        'paymentMethod',
        [sequelize.fn('COUNT', sequelize.col('Order.id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('Order.total')), 'total']
      ],
      group: ['paymentMethod']
    });

    const summarySafe = summary && summary.dataValues ? summary.dataValues : null;

    res.json({
      success: true,
      data: {
        period: {
          start: start.toISOString(),
          end: end.toISOString()
        },
        summary: {
          totalOrders: summarySafe ? parseInt(summarySafe.totalOrders) || 0 : 0,
          totalRevenue: summarySafe ? parseFloat(summarySafe.totalRevenue) || 0 : 0,
          averageOrderValue: summarySafe ? parseFloat(summarySafe.averageOrderValue) || 0 : 0,
          minOrderValue: summarySafe ? parseFloat(summarySafe.minOrderValue) || 0 : 0,
          maxOrderValue: summarySafe ? parseFloat(summarySafe.maxOrderValue) || 0 : 0
        },
        salesData: salesData.map(item => ({
          date: item.dataValues.date,
          orderCount: parseInt(item.dataValues.orderCount),
          totalSales: parseFloat(item.dataValues.totalSales),
          averageOrderValue: parseFloat(item.dataValues.averageOrderValue)
        })),
        paymentMethods: paymentMethods.map(item => ({
          method: item.paymentMethod,
          count: parseInt(item.dataValues.count),
          total: parseFloat(item.dataValues.total)
        }))
      }
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sales analytics'
    });
  }
});

/**
 * @route   GET /api/analytics/products
 * @desc    Get product performance analytics
 * @access  Private (Admin)
 */
router.get('/products', authenticate, requireAdmin, [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { startDate, endDate, limit = 20 } = req.query;

    // Set default date range if not provided
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      start = new Date();
      start.setMonth(start.getMonth() - 3); // Default to last 3 months
    }

    // Get top selling products
    const topProducts = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: 'order',
          where: {
            createdAt: {
              [Op.between]: [start, end]
            },
            status: {
              [Op.notIn]: ['cancelled']
            }
          },
          attributes: []
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'price', 'sku']
        }
      ],
      attributes: [
        [sequelize.col('OrderItem.product_id'), 'productId'],
        [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.col('OrderItem.total')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('OrderItem.order_id'))), 'orderCount']
      ],
      group: [sequelize.col('OrderItem.product_id'), 'product.id', 'product.name', 'product.slug', 'product.price', 'product.sku'],
      order: [[sequelize.fn('SUM', sequelize.col('OrderItem.total')), 'DESC']],
      limit: parseInt(limit)
    });

    // Get low stock products
    const lowStockProducts = await Product.findAll({
      where: {
        trackQuantity: true,
        quantity: {
          [Op.lte]: 10
        },
        isActive: true
      },
      attributes: ['id', 'name', 'slug', 'sku', 'quantity', 'price'],
      order: [['quantity', 'ASC']],
      limit: 10
    });

    // Get category performance
    const categoryPerformance = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: 'order',
          where: {
            createdAt: {
              [Op.between]: [start, end]
            },
            status: {
              [Op.notIn]: ['cancelled']
            }
          },
          attributes: []
        },
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name', 'slug']
            }
          ],
          attributes: []
        }
      ],
      attributes: [
        [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.col('OrderItem.total')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('OrderItem.order_id'))), 'orderCount']
      ],
      group: ['product.category.id', 'product.category.name', 'product.category.slug'],
      order: [[sequelize.fn('SUM', sequelize.col('OrderItem.total')), 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        period: {
          start: start.toISOString(),
          end: end.toISOString()
        },
        topProducts: topProducts.map(item => ({
          productId: item.productId,
          product: item.product || null,
          totalQuantity: parseInt(item.dataValues.totalQuantity),
          totalRevenue: parseFloat(item.dataValues.totalRevenue),
          orderCount: parseInt(item.dataValues.orderCount)
        })),
        lowStockProducts: lowStockProducts.map(product => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          quantity: product.quantity,
          price: product.price
        })),
        categoryPerformance: categoryPerformance.map(item => {
          const cat = item.product && item.product.category ? item.product.category : null;
          return {
            category: cat,
            totalQuantity: parseInt(item.dataValues.totalQuantity),
            totalRevenue: parseFloat(item.dataValues.totalRevenue),
            orderCount: parseInt(item.dataValues.orderCount)
          };
        })
      }
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get product analytics'
    });
  }
});

/**
 * @route   GET /api/analytics/customers
 * @desc    Get customer analytics
 * @access  Private (Admin)
 */
router.get('/customers', authenticate, requireAdmin, [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { startDate, endDate, limit = 20 } = req.query;

    // Set default date range if not provided
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      start = new Date();
      start.setMonth(start.getMonth() - 12); // Default to last 12 months
    }

    // Get top customers
    const topCustomers = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end]
        },
        status: {
          [Op.notIn]: ['cancelled']
        },
        userId: {
          [Op.not]: null
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt']
        }
      ],
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('Order.id')), 'orderCount'],
        [sequelize.fn('SUM', sequelize.col('Order.total')), 'totalSpent'],
        [sequelize.fn('AVG', sequelize.col('Order.total')), 'averageOrderValue'],
        [sequelize.fn('MAX', sequelize.col('Order.created_at')), 'lastOrderDate']
      ],
      group: ['userId', 'user.id', 'user.first_name', 'user.last_name', 'user.email', 'user.created_at'],
      order: [[sequelize.fn('SUM', sequelize.col('Order.total')), 'DESC']],
      limit: parseInt(limit)
    });

    // Get customer acquisition data
    const customerAcquisition = await User.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end]
        },
        role: 'customer'
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('User.created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('User.id')), 'newCustomers']
      ],
      group: [sequelize.fn('DATE', sequelize.col('User.created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('User.created_at')), 'ASC']]
    });

    // Get customer retention data
    const customerRetention = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end]
        },
        status: {
          [Op.notIn]: ['cancelled']
        },
        userId: {
          [Op.not]: null
        }
      },
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('Order.id')), 'orderCount']
      ],
      group: ['userId'],
      having: sequelize.literal('COUNT("Order"."id") > 1')
    });

    res.json({
      success: true,
      data: {
        period: {
          start: start.toISOString(),
          end: end.toISOString()
        },
        topCustomers: topCustomers.map(item => ({
          userId: item.userId,
          user: item.user,
          orderCount: parseInt(item.dataValues.orderCount),
          totalSpent: parseFloat(item.dataValues.totalSpent),
          averageOrderValue: parseFloat(item.dataValues.averageOrderValue),
          lastOrderDate: item.dataValues.lastOrderDate
        })),
        customerAcquisition: customerAcquisition.map(item => ({
          date: item.dataValues.date,
          newCustomers: parseInt(item.dataValues.newCustomers)
        })),
        customerRetention: {
          repeatCustomers: customerRetention.length,
          totalCustomers: topCustomers.length,
          retentionRate: topCustomers.length > 0 ? (customerRetention.length / topCustomers.length) * 100 : 0
        }
      }
    });
  } catch (error) {
    console.error('Get customer analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get customer analytics'
    });
  }
});

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard overview analytics
 * @access  Private (Admin)
 */
router.get('/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Today's metrics
    const todayOrders = await Order.count({
      where: {
        createdAt: {
          [Op.gte]: today
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });

    const todayRevenue = await Order.sum('total', {
      where: {
        createdAt: {
          [Op.gte]: today
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });

    // This month's metrics
    const thisMonthOrders = await Order.count({
      where: {
        createdAt: {
          [Op.gte]: thisMonth
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });

    const thisMonthRevenue = await Order.sum('total', {
      where: {
        createdAt: {
          [Op.gte]: thisMonth
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });

    // Last month's metrics for comparison
    const lastMonthOrders = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [lastMonth, thisMonth]
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });

    const lastMonthRevenue = await Order.sum('total', {
      where: {
        createdAt: {
          [Op.between]: [lastMonth, thisMonth]
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });

    // Pending orders
    const pendingOrders = await Order.count({
      where: {
        status: 'pending'
      }
    });

    // Low stock products
    const lowStockProducts = await Product.count({
      where: {
        trackQuantity: true,
        quantity: {
          [Op.lte]: 10
        },
        isActive: true
      }
    });

    // Recent orders
    const recentOrders = await Order.findAll({
      where: {
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Top selling products (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const topProducts = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: 'order',
          where: {
            createdAt: {
              [Op.gte]: thirtyDaysAgo
            },
            status: {
              [Op.notIn]: ['cancelled']
            }
          },
          attributes: []
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'slug']
        }
      ],
      attributes: [
        'productId',
        [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.col('OrderItem.total')), 'totalRevenue']
      ],
      group: ['productId', 'product.id', 'product.name', 'product.slug'],
      order: [[sequelize.fn('SUM', sequelize.col('OrderItem.total')), 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        today: {
          orders: todayOrders,
          revenue: parseFloat(todayRevenue) || 0
        },
        thisMonth: {
          orders: thisMonthOrders,
          revenue: parseFloat(thisMonthRevenue) || 0
        },
        lastMonth: {
          orders: lastMonthOrders,
          revenue: parseFloat(lastMonthRevenue) || 0
        },
        alerts: {
          pendingOrders,
          lowStockProducts
        },
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          customer: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'
        })),
        topProducts: topProducts.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          totalQuantity: parseInt(item.dataValues.totalQuantity),
          totalRevenue: parseFloat(item.dataValues.totalRevenue)
        }))
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard analytics'
    });
  }
});

/**
 * @route   GET /api/analytics/export
 * @desc    Export analytics data
 * @access  Private (Admin)
 */
router.get('/export', authenticate, requireAdmin, [
  query('type').isIn(['sales', 'products', 'customers']).withMessage('Valid export type is required'),
  query('format').optional().isIn(['csv', 'json']).withMessage('Valid format is required'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { type, format = 'json', startDate, endDate } = req.query;

    // Set default date range if not provided
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      start = new Date();
      start.setMonth(start.getMonth() - 1); // Default to last month
    }

    let data;
    let filename;

    switch (type) {
      case 'sales':
        data = await getSalesExportData(start, end);
        filename = `sales-export-${start.toISOString().split('T')[0]}-${end.toISOString().split('T')[0]}`;
        break;
      case 'products':
        data = await getProductsExportData(start, end);
        filename = `products-export-${start.toISOString().split('T')[0]}-${end.toISOString().split('T')[0]}`;
        break;
      case 'customers':
        data = await getCustomersExportData(start, end);
        filename = `customers-export-${start.toISOString().split('T')[0]}-${end.toISOString().split('T')[0]}`;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid export type'
        });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvData);
    } else {
      res.json({
        success: true,
        data: {
          filename: `${filename}.json`,
          data
        }
      });
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export analytics data'
    });
  }
});

// Helper functions for export data
async function getSalesExportData(start, end) {
  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.between]: [start, end]
      },
      status: {
        [Op.notIn]: ['cancelled']
      }
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }
    ],
    order: [['createdAt', 'ASC']]
  });

  return orders.map(order => ({
    orderNumber: order.orderNumber,
    date: order.createdAt,
    customer: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest',
    email: order.user ? order.user.email : 'N/A',
    subtotal: order.subtotal,
    tax: order.taxAmount,
    shipping: order.shippingAmount,
    total: order.total,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus
  }));
}

async function getProductsExportData(start, end) {
  const orderItems = await OrderItem.findAll({
    include: [
      {
        model: Order,
        as: 'order',
        where: {
          createdAt: {
            [Op.between]: [start, end]
          },
          status: {
            [Op.notIn]: ['cancelled']
          }
        },
        attributes: []
      },
      {
        model: Product,
        as: 'product',
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['name']
          }
        ],
        attributes: ['name', 'sku', 'price']
      }
    ],
    attributes: ['quantity', 'price', 'total'],
    order: [['order.createdAt', 'ASC']]
  });

  return orderItems.map(item => ({
    productName: item.product.name,
    sku: item.product.sku,
    category: item.product.category ? item.product.category.name : 'N/A',
    quantity: item.quantity,
    unitPrice: item.price,
    total: item.total,
    orderDate: item.order.createdAt
  }));
}

async function getCustomersExportData(start, end) {
  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.between]: [start, end]
      },
      status: {
        [Op.notIn]: ['cancelled']
      },
      userId: {
        [Op.not]: null
      }
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email', 'createdAt']
      }
    ],
    order: [['createdAt', 'ASC']]
  });

  // Group by customer
  const customerData = {};
  orders.forEach(order => {
    const userId = order.userId;
    if (!customerData[userId]) {
      customerData[userId] = {
        customerId: userId,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        email: order.user.email,
        joinDate: order.user.createdAt,
        orderCount: 0,
        totalSpent: 0,
        firstOrder: order.createdAt,
        lastOrder: order.createdAt
      };
    }
    customerData[userId].orderCount++;
    customerData[userId].totalSpent += parseFloat(order.total);
    customerData[userId].lastOrder = order.createdAt;
  });

  return Object.values(customerData);
}

function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

module.exports = router; 