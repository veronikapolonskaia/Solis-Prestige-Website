# Database Seeders

This directory contains database seeders for the ecommerce module. Seeders are used to populate the database with demo data for development and testing purposes.

## Overview

The seeders create a comprehensive demo ecommerce store with:

- **Users**: Admin and customer accounts with different roles
- **Categories**: Hierarchical product categories (Electronics, Fashion, Home & Garden, Books)
- **Products**: Various products across different categories with realistic data
- **Product Images**: Multiple images per product with proper relationships
- **Product Variants**: Different configurations, sizes, colors, and specifications
- **Addresses**: Billing and shipping addresses for users
- **Orders**: Sample orders with different statuses and payment methods
- **Order Items**: Detailed order line items with variants and attributes
- **Cart Items**: Shopping cart items for both users and guest sessions

## Seeder Files

### 001-demo-users.js
Creates demo user accounts:
- **Admin**: `admin@ecommerce.com` / `password123`
- **Customers**: 
  - `john.doe@example.com` / `password123`
  - `jane.smith@example.com` / `password123`
  - `mike.wilson@example.com` / `password123`

### 002-demo-categories.js
Creates a hierarchical category structure:
- Electronics
  - Smartphones
  - Laptops
- Fashion
  - Men's Clothing
  - Women's Clothing
- Home & Garden
  - Kitchen & Dining
- Books
  - Fiction

### 003-demo-products.js
Creates 10 products across different categories:
- iPhone 15 Pro (Smartphones)
- Samsung Galaxy S24 (Smartphones)
- MacBook Pro 16" (Laptops)
- Dell XPS 15 (Laptops)
- Men's Classic T-Shirt (Men's Clothing)
- Women's Summer Dress (Women's Clothing)
- Kitchen Stand Mixer (Kitchen & Dining)
- The Great Gatsby (Fiction Books)
- Wireless Bluetooth Headphones (Electronics)
- Smart Home Security Camera (Electronics)

### 004-demo-product-images.js
Creates product images with proper relationships:
- Multiple images per product
- Main image designation
- Alt text for accessibility
- Sort order for display

### 005-demo-product-variants.js
Creates product variants with different configurations:
- **Smartphones**: Storage capacity and colors
- **Laptops**: Processor, RAM, and storage configurations
- **Clothing**: Sizes and colors
- **Books**: Single variant (no variants needed)

### 006-demo-addresses.js
Creates billing and shipping addresses for users:
- Multiple addresses per user
- Default address designation
- Complete address information

### 007-demo-orders.js
Creates sample orders with various statuses:
- **Delivered**: Completed orders with tracking
- **Shipped**: Orders in transit
- **Processing**: Orders being prepared
- **Pending**: New orders awaiting payment
- **Cancelled**: Cancelled orders (including guest order)

### 008-demo-order-items.js
Creates order line items with:
- Product and variant relationships
- Quantity and pricing
- Product attributes and specifications

### 009-demo-cart-items.js
Creates shopping cart items for:
- **Registered users**: Items in their carts
- **Guest sessions**: Items in guest shopping carts

## Usage

### Running Seeders

```bash
# Run all seeders
npm run seed

# Undo all seeders
npm run seed:undo

# Reset database (undo + run)
npm run seed:reset
```

### Individual Seeder Commands

```bash
# Run specific seeder
node src/seeders/index.js

# Undo all seeders
node src/seeders/index.js undo

# Reset database
node src/seeders/index.js reset
```

### Sequelize CLI Commands

```bash
# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Undo all migrations
npm run db:migrate:undo:all

# Run all seeders (Sequelize CLI)
npm run db:seed

# Undo all seeders (Sequelize CLI)
npm run db:seed:undo

# Complete database reset
npm run db:reset
```

## Demo Data Details

### Users
- **Admin User**: Full access to all features
- **Customer Users**: Regular customer accounts with orders and addresses
- **Password**: All users have password `password123`

### Products
- **Realistic Pricing**: Based on actual market prices
- **Inventory Tracking**: Proper stock quantities
- **Variants**: Multiple configurations for complex products
- **Images**: High-quality product images from Unsplash
- **SEO**: Meta titles and descriptions for products

### Orders
- **Multiple Statuses**: Covers all order lifecycle stages
- **Payment Methods**: Credit card, PayPal examples
- **Guest Orders**: Demonstrates guest checkout functionality
- **Tracking**: Realistic tracking numbers and delivery dates

### Cart Items
- **User Carts**: Items for registered users
- **Guest Carts**: Items for anonymous users
- **Variants**: Proper variant selection in carts
- **Quantities**: Realistic shopping quantities

## Database Relationships

The seeders maintain proper relationships:
- Users → Orders → Order Items
- Users → Addresses
- Users → Cart Items
- Categories → Products
- Products → Product Images
- Products → Product Variants
- Products → Cart Items
- Products → Order Items

## Customization

To customize the demo data:

1. **Modify Seeder Files**: Edit the data arrays in each seeder
2. **Add New Seeders**: Create new numbered seeder files
3. **Update Relationships**: Ensure foreign keys match between seeders
4. **Test Data**: Verify relationships work correctly

## Notes

- All UUIDs are pre-generated for consistency
- Dates are realistic and sequential
- Prices include tax calculations
- Images use Unsplash URLs for demo purposes
- Guest orders demonstrate anonymous checkout
- Cart items show both user and session-based carts

## Troubleshooting

### Common Issues

1. **Foreign Key Errors**: Ensure referenced IDs exist in previous seeders
2. **Duplicate Data**: Check for unique constraints (emails, SKUs, etc.)
3. **Date Issues**: Verify date formats match database expectations
4. **JSON Fields**: Ensure JSON.stringify() for JSONB fields

### Reset Database

If you encounter issues, reset the entire database:

```bash
npm run db:reset
```

This will:
1. Undo all migrations
2. Run all migrations
3. Run all seeders

## Development

When adding new seeders:

1. Use the next available number (010, 011, etc.)
2. Include both `up` and `down` functions
3. Test the seeder individually
4. Update this README with new data details
5. Ensure proper relationships with existing data 