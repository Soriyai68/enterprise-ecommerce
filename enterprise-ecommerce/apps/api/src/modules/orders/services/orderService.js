const { Order, OrderItem, Cart, CartItem } = require('../models');
const { Product } = require('../../products/models');
const { User } = require('../../auth/models');
const { AppError } = require('../../../common/middleware/errorHandler');
const { Op } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

class OrderService {
  /**
   * Create order from cart
   */
  async createOrderFromCart(userId, orderData) {
    const transaction = await sequelize.transaction();

    try {
      // Get user's active cart
      const cart = await Cart.findOne({
        where: {
          user_id: userId,
          status: 'active'
        },
        include: [
          {
            model: CartItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          }
        ],
        transaction
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        throw new AppError('Cart is empty', 400);
      }

      // Validate stock for all items
      for (const cartItem of cart.items) {
        if (cartItem.product.stock < cartItem.quantity) {
          throw new AppError(`Insufficient stock for ${cartItem.product.name}`, 400);
        }
      }

      // Calculate totals
      let subtotal = 0;
      for (const item of cart.items) {
        subtotal += parseFloat(item.price) * item.quantity;
      }

      const taxRate = 0.10; // 10% tax
      const taxAmount = subtotal * taxRate;
      const shippingAmount = orderData.shipping_amount || 0;
      const discountAmount = orderData.discount_amount || 0;
      const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

      // Generate order number
      const orderNumber = Order.generateOrderNumber();

      // Create order
      const order = await Order.create({
        user_id: userId,
        order_number: orderNumber,
        subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending',
        payment_method: orderData.payment_method,
        shipping_address: orderData.shipping_address,
        billing_address: orderData.billing_address,
        notes: orderData.notes,
        order_date: new Date(),
        created_by: userId
      }, { transaction });

      // Create order items and update product stock
      for (const cartItem of cart.items) {
        await OrderItem.create({
          order_id: order.order_id,
          product_id: cartItem.product_id,
          product_name: cartItem.product.name,
          product_sku: cartItem.product.sku,
          quantity: cartItem.quantity,
          price: cartItem.price,
          subtotal: parseFloat(cartItem.price) * cartItem.quantity,
          created_by: userId
        }, { transaction });

        // Reduce product stock
        await cartItem.product.update({
          stock: cartItem.product.stock - cartItem.quantity,
          updated_by: userId
        }, { transaction });
      }

      // Mark cart as converted
      await cart.update({
        status: 'converted',
        updated_by: userId
      }, { transaction });

      await transaction.commit();

      // Reload order with items
      await order.reload({
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['product_id', 'name', 'slug', 'image']
              }
            ]
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'firstName', 'lastName']
          }
        ]
      });

      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get all orders with pagination and filters
   */
  async getAllOrders(queryParams, userId, userRole) {
    const {
      page = 1,
      limit = 10,
      status,
      payment_status,
      search = '',
      start_date,
      end_date,
      sort = '-order_date'
    } = queryParams;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    // If not admin, only show user's own orders
    if (userRole !== 'admin') {
      whereClause.user_id = userId;
    }

    if (status) {
      whereClause.status = status;
    }

    if (payment_status) {
      whereClause.payment_status = payment_status;
    }

    if (search) {
      whereClause[Op.or] = [
        { order_number: { [Op.like]: `%${search}%` } },
        { '$user.email$': { [Op.like]: `%${search}%` } }
      ];
    }

    if (start_date || end_date) {
      whereClause.order_date = {};
      if (start_date) whereClause.order_date[Op.gte] = new Date(start_date);
      if (end_date) whereClause.order_date[Op.lte] = new Date(end_date);
    }

    // Parse sort parameter
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortOrder]],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName']
        },
        {
          model: OrderItem,
          as: 'items'
        }
      ]
    });

    return {
      orders: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId, userId, userRole) {
    const whereClause = { order_id: orderId };

    // If not admin, only show user's own orders
    if (userRole !== 'admin') {
      whereClause.user_id = userId;
    }

    const order = await Order.findOne({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['product_id', 'name', 'slug', 'image', 'status']
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName', 'phone']
        }
      ]
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId, status, userId, userRole) {
    const order = await this.getOrderById(orderId, userId, userRole);

    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: ['refunded'],
      cancelled: [],
      refunded: []
    };

    if (!validTransitions[order.status].includes(status)) {
      throw new AppError(`Cannot transition from ${order.status} to ${status}`, 400);
    }

    const updateData = {
      status,
      updated_by: userId
    };

    if (status === 'shipped') {
      updateData.shipped_date = new Date();
    } else if (status === 'delivered') {
      updateData.delivered_date = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelled_date = new Date();
    }

    await order.update(updateData);

    return order;
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId, reason, userId, userRole) {
    const order = await this.getOrderById(orderId, userId, userRole);

    if (!order.canBeCancelled()) {
      throw new AppError('Order cannot be cancelled', 400);
    }

    await order.update({
      status: 'cancelled',
      cancelled_date: new Date(),
      cancellation_reason: reason,
      updated_by: userId
    });

    // Restore product stock
    const orderItems = await OrderItem.findAll({
      where: { order_id: orderId },
      include: [{ model: Product, as: 'product' }]
    });

    for (const item of orderItems) {
      await item.product.update({
        stock: item.product.stock + item.quantity,
        updated_by: userId
      });
    }

    return order;
  }

  /**
   * Get order statistics
   */
  async getOrderStats(userId, userRole) {
    const whereClause = userRole === 'admin' ? {} : { user_id: userId };

    const totalOrders = await Order.count({ where: whereClause });
    const pendingOrders = await Order.count({ where: { ...whereClause, status: 'pending' } });
    const completedOrders = await Order.count({ where: { ...whereClause, status: 'delivered' } });
    const cancelledOrders = await Order.count({ where: { ...whereClause, status: 'cancelled' } });

    const totalRevenue = await Order.sum('total_amount', {
      where: { ...whereClause, payment_status: 'paid' }
    });

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue: parseFloat(totalRevenue || 0).toFixed(2)
    };
  }
}

module.exports = new OrderService();
