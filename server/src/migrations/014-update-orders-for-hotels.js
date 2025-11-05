const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if column already exists
    const columnExists = async (table, column) => {
      const result = await queryInterface.sequelize.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = '${table}' 
          AND column_name = '${column}'
        );`
      );
      return result[0][0].exists;
    };

    // Add orderType to orders table
    if (!await columnExists('orders', 'order_type')) {
      await queryInterface.addColumn('orders', 'order_type', {
        type: DataTypes.ENUM('product', 'hotel'),
        allowNull: false,
        defaultValue: 'product'
      });
    }

    // Update status enum to include hotel booking statuses
    try {
      await queryInterface.sequelize.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'confirmed' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_orders_status')) THEN
            ALTER TYPE "enum_orders_status" ADD VALUE 'confirmed';
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'checked_in' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_orders_status')) THEN
            ALTER TYPE "enum_orders_status" ADD VALUE 'checked_in';
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'checked_out' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_orders_status')) THEN
            ALTER TYPE "enum_orders_status" ADD VALUE 'checked_out';
          END IF;
        END $$;
      `);
    } catch (error) {
      // If enum already has these values, ignore error
      console.log('Enum values may already exist, continuing...');
    }

    // Add hotel booking fields to orders
    if (!await columnExists('orders', 'booking_details')) {
      await queryInterface.addColumn('orders', 'booking_details', {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {}
      });
    }

    if (!await columnExists('orders', 'check_in')) {
      await queryInterface.addColumn('orders', 'check_in', {
        type: DataTypes.DATE,
        allowNull: true
      });
    }

    if (!await columnExists('orders', 'check_out')) {
      await queryInterface.addColumn('orders', 'check_out', {
        type: DataTypes.DATE,
        allowNull: true
      });
    }

    if (!await columnExists('orders', 'number_of_guests')) {
      await queryInterface.addColumn('orders', 'number_of_guests', {
        type: DataTypes.INTEGER,
        allowNull: true
      });
    }

    if (!await columnExists('orders', 'special_requests')) {
      await queryInterface.addColumn('orders', 'special_requests', {
        type: DataTypes.TEXT,
        allowNull: true
      });
    }

    // Add itemType to order_items table
    if (!await columnExists('order_items', 'item_type')) {
      await queryInterface.addColumn('order_items', 'item_type', {
        type: DataTypes.ENUM('product', 'hotel'),
        allowNull: false,
        defaultValue: 'product'
      });
    }

    // Make productId nullable (for hotel items)
    // First drop the foreign key constraint if it exists
    try {
      await queryInterface.sequelize.query(`
        ALTER TABLE "order_items" 
        DROP CONSTRAINT IF EXISTS "order_items_product_id_fkey";
      `);
    } catch (error) {
      console.log('Could not drop foreign key constraint (might not exist):', error.message);
    }
    
    // Now change the column to allow null
    try {
      await queryInterface.changeColumn('order_items', 'product_id', {
        type: DataTypes.UUID,
        allowNull: true
      });
      
      // Re-add the foreign key constraint
      await queryInterface.sequelize.query(`
        ALTER TABLE "order_items" 
        ADD CONSTRAINT "order_items_product_id_fkey" 
        FOREIGN KEY ("product_id") 
        REFERENCES "products" ("id") 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT;
      `);
    } catch (error) {
      console.log('Could not change product_id column (might already be nullable):', error.message);
    }

    // Add hotelId to order_items
    if (!await columnExists('order_items', 'hotel_id')) {
      await queryInterface.addColumn('order_items', 'hotel_id', {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'hotels',
          key: 'id'
        }
      });
    }

    // Add hotel-specific fields to order_items
    if (!await columnExists('order_items', 'hotel_name')) {
      await queryInterface.addColumn('order_items', 'hotel_name', {
        type: DataTypes.STRING,
        allowNull: true
      });
    }

    if (!await columnExists('order_items', 'hotel_location')) {
      await queryInterface.addColumn('order_items', 'hotel_location', {
        type: DataTypes.STRING,
        allowNull: true
      });
    }

    if (!await columnExists('order_items', 'booking_dates')) {
      await queryInterface.addColumn('order_items', 'booking_dates', {
        type: DataTypes.JSONB,
        allowNull: true
      });
    }

    // Add indexes
    await queryInterface.addIndex('orders', ['order_type']);
    await queryInterface.addIndex('order_items', ['item_type']);
    await queryInterface.addIndex('order_items', ['hotel_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('order_items', ['hotel_id']);
    await queryInterface.removeIndex('order_items', ['item_type']);
    await queryInterface.removeIndex('orders', ['order_type']);

    await queryInterface.removeColumn('order_items', 'booking_dates');
    await queryInterface.removeColumn('order_items', 'hotel_location');
    await queryInterface.removeColumn('order_items', 'hotel_name');
    await queryInterface.removeColumn('order_items', 'hotel_id');
    await queryInterface.removeColumn('order_items', 'item_type');
    
    await queryInterface.removeColumn('orders', 'special_requests');
    await queryInterface.removeColumn('orders', 'number_of_guests');
    await queryInterface.removeColumn('orders', 'check_out');
    await queryInterface.removeColumn('orders', 'check_in');
    await queryInterface.removeColumn('orders', 'booking_details');
    await queryInterface.removeColumn('orders', 'order_type');
  }
};

