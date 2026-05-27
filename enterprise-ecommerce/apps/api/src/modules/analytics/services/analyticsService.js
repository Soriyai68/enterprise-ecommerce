const { Order, OrderItem } = require('../../orders/models');
const { Product, Category, Brand } = require('../../products/models');
const { User } = require('../../auth/models');
const { Cart, CartItem } = require('../../orders/models');
const { sequelize } = require('../../../common/config/database');
const { Op } = require('sequelize');

class AnalyticsService {
  /**
   * Get dashboard overview statistics
   */
  async getDashboardStats(startDate = null, endDate = null) {
    const dateFilter = this.getDateFilter(startDate, endDate);

    // Total Revenue
    const totalRevenue = await Order.sum('total_amount', {
      where: {
        payment_status: 'paid',
        ...dateFilter
      }
    });

    // Total Orders
    const totalOrders = await Order.count({
      where: dateFilter
    });

    // Total Customers
    const totalCustomers = await User.count({
      where: {
        role: 'customer',
        ...this.getDateFilter(startDate, endDate, 'created_at')
      }
    });

    // Total Products
    const totalProducts = await Product.count({
      where: {
        status: 'active'
      }
    });

    // Average Order Value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Orders by Status
    const ordersByStatus = await Order.findAll({
      where: dateFilter,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('order_id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Revenue Trend (last 7 days)
    const revenueTrend = await this.getRevenueTrend(7);

    return {
      totalRevenue: parseFloat(totalRevenue || 0).toFixed(2),
      totalOrders,
      totalCustomers,
      totalProducts,
      avgOrderValue: parseFloat(avgOrderValue).toFixed(2),
      ordersByStatus,
      revenueTrend
    };
  }

  /**
   * Get sales analytics
   */
  async getSalesAnalytics(period = 'daily', startDate = null, endDate = null) {
    const dateFilter = this.getDateFilter(startDate, endDate);

    // Sales by period
    const salesByPeriod = await this.getSalesByPeriod(period, startDate, endDate);

    // Top selling products
    const topProducts = await OrderItem.findAll({
      attributes: [
        'product_id',
        'product_name',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'total_revenue']
      ],
      include: [{
        model: Order,
        as: 'order',
        where: {
          payment_status: 'paid',
          ...dateFilter
        },
        attributes: []
      }],
      group: ['product_id', 'product_name'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: 10,
      raw: true
    });

    // Sales by category
    const salesByCategory = await this.getSalesByCategory(startDate, endDate);

    // Sales by payment method
    const salesByPaymentMethod = await Order.findAll({
      where: {
        payment_status: 'paid',
        ...dateFilter
      },
      attributes: [
        'payment_method',
        [sequelize.fn('COUNT', sequelize.col('order_id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'total']
      ],
      group: ['payment_method'],
      raw: true
    });

    return {
      salesByPeriod,
      topProducts,
      salesByCategory,
      salesByPaymentMethod
    };
  }

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics(startDate = null, endDate = null) {
    const dateFilter = this.getDateFilter(startDate, endDate, 'created_at');

    // New customers
    const newCustomers = await User.count({
      where: {
        role: 'customer',
        ...dateFilter
      }
    });

    // Customer growth trend
    const customerGrowth = await this.getCustomerGrowthTrend(30);

    // Top customers by revenue
    const topCustomers = await Order.findAll({
      where: {
        payment_status: 'paid'
      },
      attributes: [
        'user_id',
        [sequelize.fn('COUNT', sequelize.col('order_id')), 'order_count'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_spent']
      ],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }],
      group: ['user_id'],
      order: [[sequelize.fn('SUM', sequelize.col('total_amount')), 'DESC']],
      limit: 10,
      raw: false
    });

    // Customer retention rate
    const retentionRate = await this.getCustomerRetentionRate();

    // Average customer lifetime value
    const avgLifetimeValue = await this.getAverageLifetimeValue();

    return {
      newCustomers,
      customerGrowth,
      topCustomers,
      retentionRate,
      avgLifetimeValue: parseFloat(avgLifetimeValue).toFixed(2)
    };
  }

  /**
   * Get product analytics
   */
  async getProductAnalytics(startDate = null, endDate = null) {
    const dateFilter = this.getDateFilter(startDate, endDate);

    // Low stock products
    const lowStockProducts = await Product.findAll({
      where: {
        stock: {
          [Op.lte]: 10
        },
        status: 'active'
      },
      attributes: ['product_id', 'name', 'sku', 'stock', 'price'],
      order: [['stock', 'ASC']],
      limit: 20
    });

    // Out of stock products
    const outOfStockCount = await Product.count({
      where: {
        stock: 0,
        status: 'active'
      }
    });

    // Products by category
    const productsByCategory = await Product.findAll({
      attributes: [
        'category_id',
        [sequelize.fn('COUNT', sequelize.col('product_id')), 'count']
      ],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['category_id', 'category_name']
      }],
      group: ['category_id'],
      raw: false
    });

    // Product performance
    const productPerformance = await OrderItem.findAll({
      attributes: [
        'product_id',
        'product_name',
        [sequelize.fn('COUNT', sequelize.col('order_item_id')), 'times_ordered'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'total_revenue']
      ],
      include: [{
        model: Order,
        as: 'order',
        where: {
          payment_status: 'paid',
          ...dateFilter
        },
        attributes: []
      }],
      group: ['product_id', 'product_name'],
      order: [[sequelize.fn('SUM', sequelize.col('subtotal')), 'DESC']],
      limit: 20,
      raw: true
    });

    return {
      lowStockProducts,
      outOfStockCount,
      productsByCategory,
      productPerformance
    };
  }

  /**
   * Get cart analytics
   */
  async getCartAnalytics() {
    // Active carts
    const activeCarts = await Cart.count({
      where: {
        status: 'active'
      }
    });

    // Abandoned carts
    const abandonedCarts = await Cart.count({
      where: {
        status: 'abandoned'
      }
    });

    // Cart conversion rate
    const convertedCarts = await Cart.count({
      where: {
        status: 'converted'
      }
    });

    const totalCarts = activeCarts + abandonedCarts + convertedCarts;
    const conversionRate = totalCarts > 0 ? (convertedCarts / totalCarts) * 100 : 0;

    // Average cart value
    const avgCartValue = await this.getAverageCartValue();

    // Cart abandonment reasons (top products in abandoned carts)
    const abandonedCartItems = await CartItem.findAll({
      attributes: [
        'product_id',
        [sequelize.fn('COUNT', sequelize.col('cart_item_id')), 'count']
      ],
      include: [{
        model: Cart,
        as: 'cart',
        where: {
          status: 'abandoned'
        },
        attributes: []
      }, {
        model: Product,
        as: 'product',
        attributes: ['product_id', 'name', 'price']
      }],
      group: ['product_id'],
      order: [[sequelize.fn('COUNT', sequelize.col('cart_item_id')), 'DESC']],
      limit: 10,
      raw: false
    });

    return {
      activeCarts,
      abandonedCarts,
      convertedCarts,
      conversionRate: parseFloat(conversionRate).toFixed(2),
      avgCartValue: parseFloat(avgCartValue).toFixed(2),
      abandonedCartItems
    };
  }

  /**
   * Get revenue report
   */
  async getRevenueReport(period = 'monthly', year = new Date().getFullYear()) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const dateFormat = period === 'monthly' ? '%Y-%m' : '%Y-%m-%d';

    const revenueData = await Order.findAll({
      where: {
        payment_status: 'paid',
        order_date: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('order_date'), dateFormat), 'period'],
        [sequelize.fn('COUNT', sequelize.col('order_id')), 'order_count'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue'],
        [sequelize.fn('SUM', sequelize.col('tax_amount')), 'tax'],
        [sequelize.fn('SUM', sequelize.col('shipping_amount')), 'shipping']
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('order_date'), dateFormat)],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('order_date'), dateFormat), 'ASC']],
      raw: true
    });

    return revenueData;
  }

  // Helper methods

  getDateFilter(startDate, endDate, field = 'order_date') {
    const filter = {};
    if (startDate || endDate) {
      filter[field] = {};
      if (startDate) filter[field][Op.gte] = new Date(startDate);
      if (endDate) filter[field][Op.lte] = new Date(endDate);
    }
    return filter;
  }

  async getRevenueTrend(days = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trend = await Order.findAll({
      where: {
        payment_status: 'paid',
        order_date: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('order_date')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
      ],
      group: [sequelize.fn('DATE', sequelize.col('order_date'))],
      order: [[sequelize.fn('DATE', sequelize.col('order_date')), 'ASC']],
      raw: true
    });

    return trend;
  }

  async getSalesByPeriod(period, startDate, endDate) {
    const dateFilter = this.getDateFilter(startDate, endDate);
    const dateFormat = period === 'daily' ? '%Y-%m-%d' : period === 'weekly' ? '%Y-%u' : '%Y-%m';

    return await Order.findAll({
      where: {
        payment_status: 'paid',
        ...dateFilter
      },
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('order_date'), dateFormat), 'period'],
        [sequelize.fn('COUNT', sequelize.col('order_id')), 'order_count'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('order_date'), dateFormat)],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('order_date'), dateFormat), 'ASC']],
      raw: true
    });
  }

  async getSalesByCategory(startDate, endDate) {
    const dateFilter = this.getDateFilter(startDate, endDate);

    return await OrderItem.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'total_revenue']
      ],
      include: [{
        model: Order,
        as: 'order',
        where: {
          payment_status: 'paid',
          ...dateFilter
        },
        attributes: []
      }, {
        model: Product,
        as: 'product',
        attributes: [],
        include: [{
          model: Category,
          as: 'category',
          attributes: ['category_id', 'category_name']
        }]
      }],
      group: ['product.category.category_id'],
      raw: false
    });
  }

  async getCustomerGrowthTrend(days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await User.findAll({
      where: {
        role: 'customer',
        created_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });
  }

  async getCustomerRetentionRate() {
    // Customers who made more than one order
    const repeatCustomers = await Order.findAll({
      attributes: [
        'user_id',
        [sequelize.fn('COUNT', sequelize.col('order_id')), 'order_count']
      ],
      group: ['user_id'],
      having: sequelize.where(sequelize.fn('COUNT', sequelize.col('order_id')), '>', 1),
      raw: true
    });

    const totalCustomers = await User.count({ where: { role: 'customer' } });
    const retentionRate = totalCustomers > 0 ? (repeatCustomers.length / totalCustomers) * 100 : 0;

    return parseFloat(retentionRate).toFixed(2);
  }

  async getAverageLifetimeValue() {
    const result = await Order.findOne({
      where: {
        payment_status: 'paid'
      },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('total_amount')), 'avg_value']
      ],
      raw: true
    });

    return result?.avg_value || 0;
  }

  async getAverageCartValue() {
    const carts = await Cart.findAll({
      where: {
        status: 'active'
      },
      include: [{
        model: CartItem,
        as: 'items'
      }]
    });

    let totalValue = 0;
    for (const cart of carts) {
      const cartValue = await cart.getTotalPrice();
      totalValue += parseFloat(cartValue);
    }

    return carts.length > 0 ? totalValue / carts.length : 0;
  }
}

module.exports = new AnalyticsService();
