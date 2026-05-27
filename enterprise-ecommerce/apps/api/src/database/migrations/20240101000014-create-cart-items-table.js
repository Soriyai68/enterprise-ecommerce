'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cart_items', {
      cart_item_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      cart_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'carts',
          key: 'cart_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'product_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1
        }
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Price at the time of adding to cart'
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      deleted_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('cart_items', ['cart_id'], {
      name: 'cart_items_cart_id_index'
    });

    await queryInterface.addIndex('cart_items', ['product_id'], {
      name: 'cart_items_product_id_index'
    });

    await queryInterface.addIndex('cart_items', ['deleted_at'], {
      name: 'cart_items_deleted_at_index'
    });

    // Add unique constraint to prevent duplicate products in same cart
    await queryInterface.addIndex('cart_items', ['cart_id', 'product_id'], {
      unique: true,
      name: 'cart_items_cart_product_unique',
      where: {
        deleted_at: null
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cart_items');
  }
};
