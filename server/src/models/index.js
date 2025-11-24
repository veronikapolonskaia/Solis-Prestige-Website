const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const ProductVariant = require('./ProductVariant');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const Address = require('./Address');
const Setting = require('./Setting');
const Gallery = require('./Gallery');
const Editorial = require('./Editorial');
const Hotel = require('./Hotel');

// User Associations
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
User.hasMany(Cart, { foreignKey: 'userId', as: 'cartItems' });
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });

Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Category Associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Product Associations
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
Product.hasMany(Cart, { foreignKey: 'productId', as: 'cartItems' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// ProductVariant Associations
ProductVariant.hasMany(Cart, { foreignKey: 'variantId', as: 'cartItems' });
ProductVariant.hasMany(OrderItem, { foreignKey: 'variantId', as: 'orderItems' });

Cart.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

// Order Associations
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Hotel Associations
Hotel.hasMany(OrderItem, { foreignKey: 'hotelId', as: 'orderItems' });
OrderItem.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

// Export all models
module.exports = {
  User,
  Category,
  Product,
  ProductImage,
  ProductVariant,
  Order,
  OrderItem,
  Cart,
  Address,
  Setting,
  Gallery,
  Editorial,
  Hotel
};