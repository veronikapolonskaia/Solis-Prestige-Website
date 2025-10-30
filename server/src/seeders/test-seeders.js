const { sequelize } = require('../config/database');
const { runAllSeeders, undoAllSeeders } = require('./index');

/**
 * Test script to verify seeder functionality
 */
async function testSeeders() {
  try {
    console.log('🧪 Testing seeder functionality...\n');
    
    // Test 1: Run all seeders
    console.log('📦 Test 1: Running all seeders...');
    await runAllSeeders();
    console.log('✅ Test 1 passed: Seeders ran successfully\n');
    
    // Test 2: Verify data was created
    console.log('🔍 Test 2: Verifying seeded data...');
    
    const userCount = await sequelize.models.User.count();
    const categoryCount = await sequelize.models.Category.count();
    const productCount = await sequelize.models.Product.count();
    const productImageCount = await sequelize.models.ProductImage.count();
    const productVariantCount = await sequelize.models.ProductVariant.count();
    const addressCount = await sequelize.models.Address.count();
    const orderCount = await sequelize.models.Order.count();
    const orderItemCount = await sequelize.models.OrderItem.count();
    const cartCount = await sequelize.models.Cart.count();
    
    console.log(`   Users: ${userCount} (expected: 4)`);
    console.log(`   Categories: ${categoryCount} (expected: 10)`);
    console.log(`   Products: ${productCount} (expected: 10)`);
    console.log(`   Product Images: ${productImageCount} (expected: 17)`);
    console.log(`   Product Variants: ${productVariantCount} (expected: 17)`);
    console.log(`   Addresses: ${addressCount} (expected: 7)`);
    console.log(`   Orders: ${orderCount} (expected: 5)`);
    console.log(`   Order Items: ${orderItemCount} (expected: 8)`);
    console.log(`   Cart Items: ${cartCount} (expected: 8)`);
    
    const expectedCounts = {
      users: 4,
      categories: 10,
      products: 10,
      productImages: 17,
      productVariants: 17,
      addresses: 7,
      orders: 5,
      orderItems: 8,
      cartItems: 8
    };
    
    const actualCounts = {
      users: userCount,
      categories: categoryCount,
      products: productCount,
      productImages: productImageCount,
      productVariants: productVariantCount,
      addresses: addressCount,
      orders: orderCount,
      orderItems: orderItemCount,
      cartItems: cartCount
    };
    
    let allTestsPassed = true;
    for (const [key, actual] of Object.entries(actualCounts)) {
      const expected = expectedCounts[key];
      if (actual !== expected) {
        console.log(`❌ ${key}: expected ${expected}, got ${actual}`);
        allTestsPassed = false;
      }
    }
    
    if (allTestsPassed) {
      console.log('✅ Test 2 passed: All data counts match expectations\n');
    } else {
      console.log('❌ Test 2 failed: Some data counts do not match expectations\n');
    }
    
    // Test 3: Verify relationships
    console.log('🔗 Test 3: Verifying relationships...');
    
    // Test user with orders
    const userWithOrders = await sequelize.models.User.findOne({
      include: [{
        model: sequelize.models.Order,
        as: 'orders'
      }]
    });
    
    if (userWithOrders && userWithOrders.orders.length > 0) {
      console.log('✅ User-Order relationship: OK');
    } else {
      console.log('❌ User-Order relationship: Failed');
      allTestsPassed = false;
    }
    
    // Test product with images and variants
    const productWithDetails = await sequelize.models.Product.findOne({
      include: [
        {
          model: sequelize.models.ProductImage,
          as: 'images'
        },
        {
          model: sequelize.models.ProductVariant,
          as: 'variants'
        }
      ]
    });
    
    if (productWithDetails && productWithDetails.images.length > 0 && productWithDetails.variants.length > 0) {
      console.log('✅ Product-Image-Variant relationships: OK');
    } else {
      console.log('❌ Product-Image-Variant relationships: Failed');
      allTestsPassed = false;
    }
    
    // Test order with items
    const orderWithItems = await sequelize.models.Order.findOne({
      include: [{
        model: sequelize.models.OrderItem,
        as: 'items'
      }]
    });
    
    if (orderWithItems && orderWithItems.items.length > 0) {
      console.log('✅ Order-OrderItem relationship: OK');
    } else {
      console.log('❌ Order-OrderItem relationship: Failed');
      allTestsPassed = false;
    }
    
    if (allTestsPassed) {
      console.log('✅ Test 3 passed: All relationships verified\n');
    } else {
      console.log('❌ Test 3 failed: Some relationships failed\n');
    }
    
    // Test 4: Undo all seeders
    console.log('🗑️  Test 4: Undoing all seeders...');
    await undoAllSeeders();
    console.log('✅ Test 4 passed: Seeders undone successfully\n');
    
    // Test 5: Verify data was removed
    console.log('🔍 Test 5: Verifying data removal...');
    
    const finalUserCount = await sequelize.models.User.count();
    const finalProductCount = await sequelize.models.Product.count();
    const finalOrderCount = await sequelize.models.Order.count();
    
    if (finalUserCount === 0 && finalProductCount === 0 && finalOrderCount === 0) {
      console.log('✅ Test 5 passed: All data removed successfully');
    } else {
      console.log(`❌ Test 5 failed: Data not fully removed (Users: ${finalUserCount}, Products: ${finalProductCount}, Orders: ${finalOrderCount})`);
      allTestsPassed = false;
    }
    
    // Final result
    console.log('\n' + '='.repeat(50));
    if (allTestsPassed) {
      console.log('🎉 All seeder tests passed!');
    } else {
      console.log('❌ Some seeder tests failed!');
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testSeeders()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { testSeeders }; 