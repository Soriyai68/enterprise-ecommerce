const { Cart, CartItem } = require('../models');
const { Product } = require('../../products/models');
const { AppError } = require('../../../common/middleware/errorHandler');
const { Op } = require('sequelize');

class CartService {
  /**
   * Get or create cart for user
   */
  async getOrCreateCart(userId) {
    let cart = await Cart.findOne({
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
              as: 'product',
              attributes: ['product_id', 'name', 'slug', 'image', 'stock', 'status']
            }
          ]
        }
      ]
    });

    if (!cart) {
      // Set expiration to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      cart = await Cart.create({
        user_id: userId,
        status: 'active',
        expires_at: expiresAt,
        created_by: userId
      });

      // Reload with associations
      await cart.reload({
        include: [
          {
            model: CartItem,
            as: 'items'
          }
        ]
      });
    }

    return cart;
  }

  /**
   * Get cart by ID
   */
  async getCartById(cartId, userId) {
    const cart = await Cart.findOne({
      where: {
        cart_id: cartId,
        user_id: userId
      },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['product_id', 'name', 'slug', 'price', 'image', 'stock', 'status']
            }
          ]
        }
      ]
    });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    return cart;
  }

  /**
   * Add item to cart
   */
  async addToCart(userId, productId, quantity) {
    // Get or create cart
    const cart = await this.getOrCreateCart(userId);

    // Validate product exists and is available
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.status !== 'active') {
      throw new AppError('Product is not available', 400);
    }

    if (product.stock < quantity) {
      throw new AppError(`Only ${product.stock} items available in stock`, 400);
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.cart_id,
        product_id: productId
      }
    });

    if (cartItem) {
      // Update quantity
      const newQuantity = cartItem.quantity + quantity;

      if (product.stock < newQuantity) {
        throw new AppError(`Only ${product.stock} items available in stock`, 400);
      }

      cartItem.quantity = newQuantity;
      cartItem.updated_by = userId;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cart_id: cart.cart_id,
        product_id: productId,
        quantity,
        price: product.price,
        created_by: userId
      });
    }

    // Update cart updated_by
    await cart.update({ updated_by: userId });

    // Reload cart with items
    await cart.reload({
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['product_id', 'name', 'slug', 'price', 'image', 'stock', 'status']
            }
          ]
        }
      ]
    });

    return cart;
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(userId, cartItemId, quantity) {
    const cartItem = await CartItem.findOne({
      where: { cart_item_id: cartItemId },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id: userId }
        },
        {
          model: Product,
          as: 'product'
        }
      ]
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    // Validate stock
    if (cartItem.product.stock < quantity) {
      throw new AppError(`Only ${cartItem.product.stock} items available in stock`, 400);
    }

    cartItem.quantity = quantity;
    cartItem.updated_by = userId;
    await cartItem.save();

    // Update cart
    await cartItem.cart.update({ updated_by: userId });

    // Reload cart with all items
    const cart = await this.getOrCreateCart(userId);
    return cart;
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(userId, cartItemId) {
    const cartItem = await CartItem.findOne({
      where: { cart_item_id: cartItemId },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id: userId }
        }
      ]
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    // Soft delete
    cartItem.deleted_by = userId;
    await cartItem.save();
    await cartItem.destroy();

    // Update cart
    await cartItem.cart.update({ updated_by: userId });

    // Reload cart with remaining items
    const cart = await this.getOrCreateCart(userId);
    return cart;
  }

  /**
   * Clear cart
   */
  async clearCart(userId) {
    const cart = await this.getOrCreateCart(userId);

    // Soft delete all items
    await CartItem.update(
      { deleted_by: userId },
      {
        where: { cart_id: cart.cart_id }
      }
    );

    await CartItem.destroy({
      where: { cart_id: cart.cart_id }
    });

    // Update cart
    await cart.update({ updated_by: userId });

    // Reload cart
    await cart.reload({
      include: [
        {
          model: CartItem,
          as: 'items'
        }
      ]
    });

    return cart;
  }

  /**
   * Get cart summary
   */
  async getCartSummary(userId) {
    const cart = await this.getOrCreateCart(userId);

    const totalItems = await cart.getTotalItems();
    const totalPrice = await cart.getTotalPrice();

    return {
      cart,
      summary: {
        totalItems,
        totalPrice: parseFloat(totalPrice).toFixed(2),
        itemCount: cart.items ? cart.items.length : 0
      }
    };
  }

  /**
   * Merge guest cart with user cart (for after login)
   */
  async mergeCarts(userId, guestCartId) {
    const userCart = await this.getOrCreateCart(userId);
    const guestCart = await Cart.findByPk(guestCartId, {
      include: [
        {
          model: CartItem,
          as: 'items'
        }
      ]
    });

    if (!guestCart) {
      return userCart;
    }

    // Merge items from guest cart to user cart
    for (const guestItem of guestCart.items) {
      const existingItem = await CartItem.findOne({
        where: {
          cart_id: userCart.cart_id,
          product_id: guestItem.product_id
        }
      });

      if (existingItem) {
        // Update quantity
        existingItem.quantity += guestItem.quantity;
        existingItem.updated_by = userId;
        await existingItem.save();
      } else {
        // Create new item
        await CartItem.create({
          cart_id: userCart.cart_id,
          product_id: guestItem.product_id,
          quantity: guestItem.quantity,
          price: guestItem.price,
          created_by: userId
        });
      }
    }

    // Mark guest cart as merged
    await guestCart.update({
      status: 'merged',
      updated_by: userId
    });

    // Reload user cart
    await userCart.reload({
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['product_id', 'name', 'slug', 'price', 'image', 'stock', 'status']
            }
          ]
        }
      ]
    });

    return userCart;
  }
}

module.exports = new CartService();
