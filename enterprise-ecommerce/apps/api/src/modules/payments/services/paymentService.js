const { Payment } = require('../models');
const { Order } = require('../../orders/models');
const { User } = require('../../auth/models');
const { AppError } = require('../../../common/middleware/errorHandler');
const { Op } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

class PaymentService {
  /**
   * Create payment record
   */
  async createPayment(paymentData, userId) {
    const transaction = await sequelize.transaction();

    try {
      // Validate order exists
      const order = await Order.findByPk(paymentData.order_id, { transaction });
      if (!order) {
        throw new AppError('Order not found', 404);
      }

      // Check if payment already exists for this order
      const existingPayment = await Payment.findOne({
        where: {
          order_id: paymentData.order_id,
          payment_status: { [Op.in]: ['completed', 'processing'] }
        },
        transaction
      });

      if (existingPayment) {
        throw new AppError('Payment already exists for this order', 409);
      }

      // Generate transaction ID if not provided
      if (!paymentData.transaction_id) {
        paymentData.transaction_id = Payment.generateTransactionId();
      }

      // Create payment
      const payment = await Payment.create({
        ...paymentData,
        amount: order.total_amount,
        created_by: userId
      }, { transaction });

      await transaction.commit();

      // Reload with associations
      await payment.reload({
        include: [{
          model: Order,
          as: 'order',
          attributes: ['order_id', 'order_number', 'total_amount', 'status']
        }]
      });

      return payment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Process payment
   */
  async processPayment(paymentId, paymentDetails, userId) {
    const transaction = await sequelize.transaction();

    try {
      const payment = await Payment.findByPk(paymentId, {
        include: [{
          model: Order,
          as: 'order'
        }],
        transaction
      });

      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      if (payment.payment_status !== 'pending') {
        throw new AppError('Payment cannot be processed', 400);
      }

      // Update payment status to processing
      await payment.update({
        payment_status: 'processing',
        updated_by: userId
      }, { transaction });

      // Simulate payment gateway processing
      // In production, integrate with actual payment gateway (Stripe, PayPal, etc.)
      const gatewayResponse = await this.processWithGateway(payment, paymentDetails);

      if (gatewayResponse.success) {
        // Payment successful
        await payment.update({
          payment_status: 'completed',
          payment_date: new Date(),
          gateway_response: gatewayResponse,
          card_last_four: paymentDetails.card_last_four,
          card_brand: paymentDetails.card_brand,
          updated_by: userId
        }, { transaction });

        // Update order payment status
        await payment.order.update({
          payment_status: 'paid',
          status: 'confirmed',
          updated_by: userId
        }, { transaction });
      } else {
        // Payment failed
        await payment.update({
          payment_status: 'failed',
          gateway_response: gatewayResponse,
          notes: gatewayResponse.error_message,
          updated_by: userId
        }, { transaction });
      }

      await transaction.commit();

      await payment.reload({
        include: [{
          model: Order,
          as: 'order'
        }]
      });

      return payment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get all payments with pagination and filters
   */
  async getAllPayments(queryParams, userId, userRole) {
    const {
      page = 1,
      limit = 10,
      payment_status,
      payment_method,
      search = '',
      start_date,
      end_date,
      sort = '-created_at'
    } = queryParams;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    if (payment_status) {
      whereClause.payment_status = payment_status;
    }

    if (payment_method) {
      whereClause.payment_method = payment_method;
    }

    if (search) {
      whereClause[Op.or] = [
        { transaction_id: { [Op.like]: `%${search}%` } },
        { '$order.order_number$': { [Op.like]: `%${search}%` } }
      ];
    }

    if (start_date || end_date) {
      whereClause.created_at = {};
      if (start_date) whereClause.created_at[Op.gte] = new Date(start_date);
      if (end_date) whereClause.created_at[Op.lte] = new Date(end_date);
    }

    // Parse sort parameter
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

    const { count, rows } = await Payment.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortOrder]],
      include: [{
        model: Order,
        as: 'order',
        attributes: ['order_id', 'order_number', 'user_id', 'total_amount', 'status'],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName']
        }]
      }]
    });

    return {
      payments: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId) {
    const payment = await Payment.findByPk(paymentId, {
      include: [{
        model: Order,
        as: 'order',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName', 'phone']
        }]
      }]
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    return payment;
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId, refundData, userId) {
    const transaction = await sequelize.transaction();

    try {
      const payment = await this.getPaymentById(paymentId);

      if (!payment.canBeRefunded()) {
        throw new AppError('Payment cannot be refunded', 400);
      }

      const refundAmount = refundData.amount || payment.getRemainingAmount();

      if (refundAmount > payment.getRemainingAmount()) {
        throw new AppError('Refund amount exceeds remaining amount', 400);
      }

      // Process refund with gateway
      const refundResponse = await this.processRefundWithGateway(payment, refundAmount);

      if (refundResponse.success) {
        const totalRefunded = parseFloat(payment.refund_amount || 0) + parseFloat(refundAmount);
        const isFullRefund = totalRefunded >= parseFloat(payment.amount);

        await payment.update({
          payment_status: isFullRefund ? 'refunded' : 'completed',
          refund_amount: totalRefunded,
          refund_reason: refundData.reason,
          refund_date: new Date(),
          updated_by: userId
        }, { transaction });

        // Update order status if full refund
        if (isFullRefund) {
          await payment.order.update({
            payment_status: 'refunded',
            status: 'refunded',
            updated_by: userId
          }, { transaction });
        }

        await transaction.commit();
      } else {
        await transaction.rollback();
        throw new AppError('Refund failed: ' + refundResponse.error_message, 400);
      }

      await payment.reload({
        include: [{
          model: Order,
          as: 'order'
        }]
      });

      return payment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(queryParams = {}) {
    const { start_date, end_date } = queryParams;

    const whereClause = {};
    if (start_date || end_date) {
      whereClause.created_at = {};
      if (start_date) whereClause.created_at[Op.gte] = new Date(start_date);
      if (end_date) whereClause.created_at[Op.lte] = new Date(end_date);
    }

    const totalPayments = await Payment.count({ where: whereClause });
    const completedPayments = await Payment.count({
      where: { ...whereClause, payment_status: 'completed' }
    });
    const failedPayments = await Payment.count({
      where: { ...whereClause, payment_status: 'failed' }
    });
    const refundedPayments = await Payment.count({
      where: { ...whereClause, payment_status: 'refunded' }
    });

    const totalAmount = await Payment.sum('amount', {
      where: { ...whereClause, payment_status: 'completed' }
    });

    const totalRefunded = await Payment.sum('refund_amount', {
      where: whereClause
    });

    const paymentsByMethod = await Payment.findAll({
      where: { ...whereClause, payment_status: 'completed' },
      attributes: [
        'payment_method',
        [sequelize.fn('COUNT', sequelize.col('payment_id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['payment_method'],
      raw: true
    });

    return {
      totalPayments,
      completedPayments,
      failedPayments,
      refundedPayments,
      totalAmount: parseFloat(totalAmount || 0).toFixed(2),
      totalRefunded: parseFloat(totalRefunded || 0).toFixed(2),
      successRate: totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(2) : 0,
      paymentsByMethod
    };
  }

  // Helper methods for payment gateway integration

  async processWithGateway(payment, paymentDetails) {
    // Simulate payment gateway processing
    // In production, integrate with Stripe, PayPal, etc.
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;

    if (success) {
      return {
        success: true,
        transaction_id: Payment.generateTransactionId(),
        gateway: paymentDetails.gateway || 'stripe',
        timestamp: new Date()
      };
    } else {
      return {
        success: false,
        error_code: 'CARD_DECLINED',
        error_message: 'Card was declined by the issuing bank',
        timestamp: new Date()
      };
    }
  }

  async processRefundWithGateway(payment, amount) {
    // Simulate refund processing
    // In production, integrate with actual payment gateway
    
    return {
      success: true,
      refund_id: `REF-${Date.now()}`,
      amount: amount,
      timestamp: new Date()
    };
  }
}

module.exports = new PaymentService();
