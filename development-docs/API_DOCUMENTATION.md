# Ecommerce API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Optional message",
  "data": {},
  "error": "Error message (if success: false)",
  "details": "Additional error details (if applicable)"
}
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "role": "customer",
      "isActive": true,
      "emailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here"
  }
}
```

### 2. Login User
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here"
  }
}
```

### 3. Get Current User Profile
**GET** `/auth/me`

Get the current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "customer",
    "isActive": true,
    "emailVerified": false,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update User Profile
**PUT** `/auth/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1987654321"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1987654321",
    "role": "customer",
    "isActive": true,
    "emailVerified": false,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Change Password
**PUT** `/auth/password`

Change user password.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 6. Refresh Token
**POST** `/auth/refresh`

Get a new JWT token.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new-jwt-token-here"
  }
}
```

### 7. Logout
**POST** `/auth/logout`

Logout user (client should remove token).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Product Endpoints

### 1. Get All Products
**GET** `/products`

Get all products with filtering, search, and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12, max: 100)
- `search` (optional): Search term
- `category` (optional): Category slug
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `sortBy` (optional): Sort field (name, price, createdAt, rating)
- `sortOrder` (optional): Sort order (asc, desc)
- `inStock` (optional): Filter by stock availability

**Example Request:**
```
GET /api/products?page=1&limit=12&search=laptop&minPrice=500&maxPrice=2000&sortBy=price&sortOrder=asc&inStock=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "MacBook Pro",
        "slug": "macbook-pro",
        "description": "Professional laptop",
        "shortDescription": "High-performance laptop",
        "sku": "MBP-001",
        "price": "1299.99",
        "comparePrice": "1499.99",
        "quantity": 10,
        "isActive": true,
        "category": {
          "id": "uuid",
          "name": "Laptops",
          "slug": "laptops"
        },
        "images": [
          {
            "id": "uuid",
            "url": "https://example.com/image.jpg",
            "altText": "MacBook Pro",
            "isMain": true
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 12,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### 2. Get Single Product
**GET** `/products/:id`

Get a single product by ID.

**Example Request:**
```
GET /api/products/uuid-here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "MacBook Pro",
    "slug": "macbook-pro",
    "description": "Professional laptop with M2 chip",
    "shortDescription": "High-performance laptop",
    "sku": "MBP-001",
    "price": "1299.99",
    "comparePrice": "1499.99",
    "quantity": 10,
    "weight": "2.1",
    "isActive": true,
    "category": {
      "id": "uuid",
      "name": "Laptops",
      "slug": "laptops",
      "description": "Professional laptops"
    },
    "images": [
      {
        "id": "uuid",
        "url": "https://example.com/image1.jpg",
        "altText": "MacBook Pro Front",
        "sortOrder": 1,
        "isMain": true
      },
      {
        "id": "uuid",
        "url": "https://example.com/image2.jpg",
        "altText": "MacBook Pro Back",
        "sortOrder": 2,
        "isMain": false
      }
    ],
    "variants": [
      {
        "id": "uuid",
        "name": "16GB RAM",
        "sku": "MBP-001-16GB",
        "price": "1499.99",
        "quantity": 5,
        "image": "https://example.com/variant1.jpg",
        "attributes": {
          "ram": "16GB",
          "storage": "512GB"
        }
      }
    ]
  }
}
```

### 3. Get Product by Slug
**GET** `/products/slug/:slug`

Get a single product by slug.

**Example Request:**
```
GET /api/products/slug/macbook-pro
```

**Response:** Same as Get Single Product

### 4. Create Product (Admin Only)
**POST** `/products`

Create a new product.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "name": "MacBook Pro",
  "description": "Professional laptop with M2 chip",
  "shortDescription": "High-performance laptop",
  "sku": "MBP-001",
  "price": 1299.99,
  "comparePrice": 1499.99,
  "costPrice": 1000.00,
  "quantity": 10,
  "weight": 2.1,
  "categoryId": "uuid",
  "trackQuantity": true,
  "taxable": true,
  "metaTitle": "MacBook Pro - Professional Laptop",
  "metaDescription": "High-performance laptop for professionals"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "uuid",
    "name": "MacBook Pro",
    "slug": "macbook-pro",
    "sku": "MBP-001",
    "price": "1299.99",
    "quantity": 10,
    "isActive": true
  }
}
```

### 5. Update Product (Admin Only)
**PUT** `/products/:id`

Update an existing product.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "name": "MacBook Pro M2",
  "price": 1399.99,
  "quantity": 15,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "uuid",
    "name": "MacBook Pro M2",
    "price": "1399.99",
    "quantity": 15,
    "isActive": true
  }
}
```

### 6. Delete Product (Admin Only)
**DELETE** `/products/:id`

Soft delete a product.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### 7. Get Featured Products
**GET** `/products/featured`

Get featured products.

**Query Parameters:**
- `limit` (optional): Number of products (default: 8)

**Example Request:**
```
GET /api/products/featured?limit=6
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "MacBook Pro",
      "slug": "macbook-pro",
      "price": "1299.99",
      "category": {
        "id": "uuid",
        "name": "Laptops",
        "slug": "laptops"
      },
      "images": [
        {
          "id": "uuid",
          "url": "https://example.com/image.jpg",
          "altText": "MacBook Pro",
          "isMain": true
        }
      ]
    }
  ]
}
```

### 8. Get Related Products
**GET** `/products/related/:id`

Get related products from the same category.

**Query Parameters:**
- `limit` (optional): Number of products (default: 4)

**Example Request:**
```
GET /api/products/related/uuid-here?limit=6
```

**Response:** Same format as Get Featured Products

---

## Cart Endpoints

### 1. Get Cart
**GET** `/cart`

Get user's cart items.

**Headers:**
```
Authorization: Bearer <jwt-token>
# OR
X-Session-ID: <session-id> (for guest carts)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "quantity": 2,
        "price": "1299.99",
        "attributes": {
          "color": "Silver"
        },
        "product": {
          "id": "uuid",
          "name": "MacBook Pro",
          "slug": "macbook-pro",
          "price": "1299.99",
          "comparePrice": "1499.99",
          "image": "https://example.com/image.jpg",
          "isActive": true
        },
        "variant": {
          "id": "uuid",
          "name": "16GB RAM",
          "price": "1499.99",
          "image": "https://example.com/variant.jpg",
          "attributes": {
            "ram": "16GB",
            "storage": "512GB"
          }
        }
      }
    ],
    "total": 2999.98,
    "itemCount": 2
  }
}
```

### 2. Add Item to Cart
**POST** `/cart`

Add an item to the cart.

**Headers:**
```
Authorization: Bearer <jwt-token>
# OR
X-Session-ID: <session-id> (for guest carts)
```

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 2,
  "variantId": "uuid",
  "attributes": {
    "color": "Silver",
    "size": "Large"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully"
}
```

### 3. Update Cart Item
**PUT** `/cart/:id`

Update cart item quantity.

**Headers:**
```
Authorization: Bearer <jwt-token>
# OR
X-Session-ID: <session-id> (for guest carts)
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart item updated successfully"
}
```

### 4. Remove Cart Item
**DELETE** `/cart/:id`

Remove an item from the cart.

**Headers:**
```
Authorization: Bearer <jwt-token>
# OR
X-Session-ID: <session-id> (for guest carts)
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

### 5. Clear Cart
**DELETE** `/cart`

Clear the entire cart.

**Headers:**
```
Authorization: Bearer <jwt-token>
# OR
X-Session-ID: <session-id> (for guest carts)
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

### 6. Merge Guest Cart
**POST** `/cart/merge`

Merge guest cart with user cart after login.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "sessionId": "guest-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart merged successfully"
}
```

### 7. Get Cart Count
**GET** `/cart/count`

Get the total number of items in the cart.

**Headers:**
```
Authorization: Bearer <jwt-token>
# OR
X-Session-ID: <session-id> (for guest carts)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

## Payment Endpoints

### 1. Process Payment
**POST** `/payments/process`

Process payment for an order.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "orderId": "uuid",
  "paymentMethod": "cod",
  "paymentData": {
    "cardNumber": "4111111111111111",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "orderId": "uuid",
    "paymentStatus": "paid",
    "transactionId": "CC_1234567890_abc123",
    "paymentMethod": "credit_card"
  }
}
```

### 2. Confirm COD Payment (Admin Only)
**POST** `/payments/cod/confirm`

Confirm cash on delivery payment.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "orderId": "uuid",
  "receivedAmount": 150.00,
  "notes": "Payment received in cash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "COD payment confirmed successfully",
  "data": {
    "orderId": "uuid",
    "receivedAmount": 150.00,
    "expectedAmount": 150.00,
    "change": 0.00
  }
}
```

### 3. Get Payment Methods
**GET** `/payments/methods`

Get available payment methods.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cod",
      "name": "Cash on Delivery",
      "description": "Pay when you receive your order",
      "icon": "💰",
      "enabled": true,
      "requiresOnlinePayment": false,
      "processingTime": "immediate",
      "fees": 0,
      "minAmount": 0,
      "maxAmount": 10000
    },
    {
      "id": "credit_card",
      "name": "Credit Card",
      "description": "Pay securely with your credit card",
      "icon": "💳",
      "enabled": true,
      "requiresOnlinePayment": true,
      "processingTime": "instant",
      "fees": 2.5,
      "minAmount": 1,
      "maxAmount": 50000
    }
  ]
}
```

### 4. Get Payment Information
**GET** `/payments/orders/:orderId`

Get payment information for an order.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-20240101-0001",
    "total": "150.00",
    "currency": "USD",
    "paymentStatus": "paid",
    "paymentMethod": "cod",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Process Refund (Admin Only)
**POST** `/payments/refund`

Process refund for an order.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "orderId": "uuid",
  "refundAmount": 150.00,
  "reason": "Customer requested refund",
  "refundMethod": "original_payment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "orderId": "uuid",
    "refundAmount": 150.00,
    "refundMethod": "original_payment",
    "transactionId": "REFUND_1234567890_abc123"
  }
}
```

---

## Checkout Endpoints

### 1. Calculate Checkout
**POST** `/checkout/calculate`

Calculate order totals and shipping.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "variantId": "uuid"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "couponCode": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "uuid",
        "variantId": "uuid",
        "quantity": 2,
        "price": "75.00",
        "total": "150.00",
        "productName": "MacBook Pro",
        "variantName": "16GB RAM",
        "sku": "MBP-001-16GB",
        "weight": "2.1",
        "image": "https://example.com/image.jpg"
      }
    ],
    "subtotal": 150.00,
    "taxAmount": 15.00,
    "shippingAmount": 10.00,
    "discountAmount": 0.00,
    "total": 175.00,
    "totalItems": 2,
    "currency": "USD"
  }
}
```

### 2. Create Order
**POST** `/checkout/create-order`

Create order from checkout.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "variantId": "uuid"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "paymentMethod": "cod",
  "notes": "Please deliver after 6 PM",
  "clearCart": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-20240101-0001",
    "total": "175.00",
    "paymentStatus": "pending",
    "paymentMethod": "cod"
  }
}
```

### 3. Create Guest Order
**POST** `/checkout/guest`

Create guest order (without authentication).

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "variantId": "uuid"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "paymentMethod": "cod",
  "customerEmail": "john@example.com",
  "customerName": "John Doe",
  "notes": "Please deliver after 6 PM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Guest order created successfully",
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-20240101-0001",
    "total": "175.00",
    "paymentStatus": "pending",
    "paymentMethod": "cod"
  }
}
```

### 4. Get Shipping Options
**GET** `/checkout/shipping-options`

Get available shipping options.

**Query Parameters:**
- `address` (optional): Shipping address
- `items` (optional): Order items

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "standard",
      "name": "Standard Shipping",
      "description": "5-7 business days",
      "price": 10.00,
      "currency": "USD",
      "estimatedDays": "5-7",
      "available": true
    },
    {
      "id": "express",
      "name": "Express Shipping",
      "description": "2-3 business days",
      "price": 25.00,
      "currency": "USD",
      "estimatedDays": "2-3",
      "available": true
    },
    {
      "id": "overnight",
      "name": "Overnight Shipping",
      "description": "Next business day",
      "price": 50.00,
      "currency": "USD",
      "estimatedDays": "1",
      "available": true
    },
    {
      "id": "free",
      "name": "Free Shipping",
      "description": "Free shipping on orders over $100",
      "price": 0.00,
      "currency": "USD",
      "estimatedDays": "5-7",
      "available": true,
      "minOrderAmount": 100.00
    }
  ]
}
```

### 5. Validate Coupon
**POST** `/checkout/validate-coupon`

Validate coupon code.

**Request Body:**
```json
{
  "couponCode": "SAVE10",
  "subtotal": 150.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "coupon": {
      "code": "SAVE10",
      "type": "percentage",
      "value": 10,
      "minOrderAmount": 50,
      "maxDiscount": 100,
      "valid": true
    },
    "discountAmount": 15.00,
    "newSubtotal": 135.00
  }
}
```

---

## Analytics Endpoints

### 1. Get Sales Analytics
**GET** `/analytics/sales`

Get sales analytics (Admin only).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `period` (optional): Period (daily, weekly, monthly, yearly)
- `groupBy` (optional): Group by (day, week, month, year)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-01-01T00:00:00.000Z",
      "end": "2024-12-31T23:59:59.999Z"
    },
    "summary": {
      "totalOrders": 150,
      "totalRevenue": 15000.00,
      "averageOrderValue": 100.00,
      "minOrderValue": 10.00,
      "maxOrderValue": 500.00
    },
    "salesData": [
      {
        "date": "2024-01-01",
        "orderCount": 5,
        "totalSales": 500.00,
        "averageOrderValue": 100.00
      }
    ],
    "paymentMethods": [
      {
        "method": "cod",
        "count": 50,
        "total": 5000.00
      },
      {
        "method": "credit_card",
        "count": 100,
        "total": 10000.00
      }
    ]
  }
}
```

### 2. Get Product Analytics
**GET** `/analytics/products`

Get product performance analytics (Admin only).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `limit` (optional): Number of products (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-01-01T00:00:00.000Z",
      "end": "2024-12-31T23:59:59.999Z"
    },
    "topProducts": [
      {
        "productId": "uuid",
        "product": {
          "id": "uuid",
          "name": "MacBook Pro",
          "slug": "macbook-pro",
          "price": "1299.99",
          "sku": "MBP-001"
        },
        "totalQuantity": 50,
        "totalRevenue": 64999.50,
        "orderCount": 25
      }
    ],
    "lowStockProducts": [
      {
        "id": "uuid",
        "name": "iPhone 15",
        "slug": "iphone-15",
        "sku": "IPH-001",
        "quantity": 5,
        "price": "999.99"
      }
    ],
    "categoryPerformance": [
      {
        "category": {
          "id": "uuid",
          "name": "Laptops",
          "slug": "laptops"
        },
        "totalQuantity": 100,
        "totalRevenue": 129999.00,
        "orderCount": 50
      }
    ]
  }
}
```

### 3. Get Customer Analytics
**GET** `/analytics/customers`

Get customer analytics (Admin only).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `limit` (optional): Number of customers (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-01-01T00:00:00.000Z",
      "end": "2024-12-31T23:59:59.999Z"
    },
    "topCustomers": [
      {
        "userId": "uuid",
        "user": {
          "id": "uuid",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "createdAt": "2024-01-01T00:00:00.000Z"
        },
        "orderCount": 10,
        "totalSpent": 5000.00,
        "averageOrderValue": 500.00,
        "lastOrderDate": "2024-12-15T00:00:00.000Z"
      }
    ],
    "customerAcquisition": [
      {
        "date": "2024-01-01",
        "newCustomers": 5
      }
    ],
    "customerRetention": {
      "repeatCustomers": 50,
      "totalCustomers": 100,
      "retentionRate": 50.0
    }
  }
}
```

### 4. Get Dashboard Analytics
**GET** `/analytics/dashboard`

Get dashboard overview analytics (Admin only).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "today": {
      "orders": 5,
      "revenue": 500.00
    },
    "thisMonth": {
      "orders": 150,
      "revenue": 15000.00
    },
    "lastMonth": {
      "orders": 120,
      "revenue": 12000.00
    },
    "alerts": {
      "pendingOrders": 10,
      "lowStockProducts": 5
    },
    "recentOrders": [
      {
        "id": "uuid",
        "orderNumber": "ORD-20240101-0001",
        "total": "150.00",
        "status": "pending",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "customer": "John Doe"
      }
    ],
    "topProducts": [
      {
        "productId": "uuid",
        "productName": "MacBook Pro",
        "totalQuantity": 25,
        "totalRevenue": 32499.75
      }
    ]
  }
}
```

### 5. Export Analytics Data
**GET** `/analytics/export`

Export analytics data (Admin only).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Query Parameters:**
- `type`: Export type (sales, products, customers)
- `format` (optional): Export format (csv, json)
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "sales-export-2024-01-01-2024-12-31.json",
    "data": [
      {
        "orderNumber": "ORD-20240101-0001",
        "date": "2024-01-01T00:00:00.000Z",
        "customer": "John Doe",
        "email": "john@example.com",
        "subtotal": "150.00",
        "tax": "15.00",
        "shipping": "10.00",
        "total": "175.00",
        "status": "delivered",
        "paymentMethod": "cod",
        "paymentStatus": "paid"
      }
    ]
  }
}
```

---

## Settings Endpoints

### 1. Get All Settings (Admin Only)
**GET** `/settings`

Get all application settings.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "general": {
      "store_name": "My Ecommerce Store",
      "store_email": "admin@myecommercestore.com",
      "currency": "USD"
    },
    "payment": {
      "stripe_enabled": true,
      "paypal_enabled": false,
      "cash_on_delivery": true
    },
    "shipping": {
      "free_shipping_threshold": 50,
      "flat_rate": 5.99
    },
    "tax": {
      "tax_enabled": true,
      "tax_rate": 8.5
    }
  }
}
```

### 2. Get Public Settings
**GET** `/settings/public`

Get public settings (no authentication required).

**Response:**
```json
{
  "success": true,
  "data": {
    "general": {
      "store_name": "My Ecommerce Store",
      "currency": "USD"
    }
  }
}
```

### 3. Get Settings by Category (Admin Only)
**GET** `/settings/:category`

Get settings by category.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stripe_enabled": true,
    "paypal_enabled": false,
    "cash_on_delivery": true
  }
}
```

### 4. Get Setting by Key (Admin Only)
**GET** `/settings/key/:key`

Get a specific setting by key.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "key": "stripe_enabled",
    "value": true
  }
}
```

### 5. Update Settings by Category (Admin Only)
**PUT** `/settings/:category`

Update settings by category.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "stripe_enabled": true,
  "paypal_enabled": false,
  "cash_on_delivery": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "payment settings updated successfully",
  "data": {
    "stripe_enabled": true,
    "paypal_enabled": false,
    "cash_on_delivery": true
  }
}
```

### 6. Update Setting by Key (Admin Only)
**PUT** `/settings/key/:key`

Update a specific setting by key.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "value": true,
  "category": "payment",
  "description": "Enable Stripe payments",
  "isPublic": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Setting updated successfully",
  "data": {
    "key": "stripe_enabled",
    "value": true,
    "category": "payment",
    "description": "Enable Stripe payments",
    "isPublic": false
  }
}
```

### 7. Initialize Default Settings (Admin Only)
**POST** `/settings/initialize`

Initialize default settings.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Default settings initialized successfully"
}
```

### 8. Delete Setting by Key (Admin Only)
**DELETE** `/settings/key/:key`

Delete a specific setting by key.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Setting deleted successfully"
}
```

### 9. Export Settings (Admin Only)
**GET** `/settings/export`

Export all settings.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "key": "stripe_enabled",
      "value": true,
      "category": "payment",
      "description": "Enable Stripe payments",
      "isPublic": false
    }
  ]
}
```

### 10. Import Settings (Admin Only)
**POST** `/settings/import`

Import settings.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "settings": [
    {
      "key": "stripe_enabled",
      "value": true,
      "category": "payment",
      "description": "Enable Stripe payments",
      "isPublic": false
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "1 settings imported successfully",
  "data": [
    {
      "key": "stripe_enabled",
      "value": true,
      "category": "payment"
    }
  ]
}
```

---

## Plugin Management Endpoints

### 1. Get All Plugins
**GET** `/plugins`

Get information about all loaded plugins.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "inventory",
      "version": "1.0.0",
      "enabled": true,
      "dependencies": [],
      "config": {}
    },
    {
      "name": "reviews",
      "version": "1.0.0",
      "enabled": true,
      "dependencies": [],
      "config": {}
    }
  ]
}
```

### 2. Get Plugin Information
**GET** `/plugins/:pluginName`

Get information about a specific plugin.

**Example Request:**
```
GET /api/plugins/inventory
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "inventory",
    "version": "1.0.0",
    "enabled": true,
    "dependencies": [],
    "config": {}
  }
}
```

### 3. Enable Plugin
**POST** `/plugins/:pluginName/enable`

Enable a plugin.

**Example Request:**
```
POST /api/plugins/reviews/enable
```

**Response:**
```json
{
  "success": true,
  "message": "Plugin reviews enabled successfully"
}
```

### 4. Disable Plugin
**POST** `/plugins/:pluginName/disable`

Disable a plugin.

**Example Request:**
```
POST /api/plugins/reviews/disable
```

**Response:**
```json
{
  "success": true,
  "message": "Plugin reviews disabled successfully"
}
```

### 5. Install Plugin
**POST** `/plugins/:pluginName/install`

Install a plugin.

**Example Request:**
```
POST /api/plugins/reviews/install
```

**Response:**
```json
{
  "success": true,
  "message": "Plugin reviews installed successfully"
}
```

### 6. Uninstall Plugin
**POST** `/plugins/:pluginName/uninstall`

Uninstall a plugin.

**Example Request:**
```
POST /api/plugins/reviews/uninstall
```

**Response:**
```json
{
  "success": true,
  "message": "Plugin reviews uninstalled successfully"
}
```

### 7. Get Plugin Status
**GET** `/plugins/:pluginName/status`

Get the status of a plugin.

**Example Request:**
```
GET /api/plugins/reviews/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "reviews",
    "loaded": true,
    "enabled": true
  }
}
```

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    {
      "type": "field",
      "value": "",
      "msg": "Product name is required",
      "path": "name",
      "location": "body"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

### Not Found Error
```json
{
  "success": false,
  "error": "Product not found"
}
```

### Server Error
```json
{
  "success": false,
  "error": "Server Error",
  "stack": "Error stack trace (development only)"
}
```

---

## Usage Examples

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register user
async function registerUser(userData) {
  try {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('token', response.data.data.token);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response.data);
    throw error;
  }
}

// Login user
async function loginUser(credentials) {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.data.token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error;
  }
}

// Get products with filters
async function getProducts(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/products?${params}`);
    return response.data;
  } catch (error) {
    console.error('Get products error:', error.response.data);
    throw error;
  }
}

// Add item to cart
async function addToCart(cartData) {
  try {
    const response = await api.post('/cart', cartData);
    return response.data;
  } catch (error) {
    console.error('Add to cart error:', error.response.data);
    throw error;
  }
}

// Get cart
async function getCart() {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Get cart error:', error.response.data);
    throw error;
  }
}

// Usage examples
async function example() {
  try {
    // Register a new user
    const user = await registerUser({
      email: 'user@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });
    console.log('User registered:', user);

    // Get products
    const products = await getProducts({
      page: 1,
      limit: 12,
      search: 'laptop',
      minPrice: 500,
      maxPrice: 2000
    });
    console.log('Products:', products);

    // Add item to cart
    await addToCart({
      productId: 'product-uuid',
      quantity: 2,
      variantId: 'variant-uuid'
    });

    // Get cart
    const cart = await getCart();
    console.log('Cart:', cart);

  } catch (error) {
    console.error('Example error:', error);
  }
}
```

### cURL Examples

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get products with filters
curl -X GET "http://localhost:5000/api/products?page=1&limit=12&search=laptop&minPrice=500&maxPrice=2000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add item to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": "product-uuid",
    "quantity": 2,
    "variantId": "variant-uuid"
  }'

# Get cart
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000/api

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASS=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourstore.com
FROM_NAME=Your Store

# File Upload Configuration
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Payment Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin Configuration
ADMIN_EMAIL=admin@yourstore.com
ADMIN_PASSWORD=admin123

# Plugin Configuration
PLUGINS_ENABLED=reviews,inventory

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

---

## Testing the API

You can test the API using tools like:
- **Postman**: Import the endpoints and test them
- **Insomnia**: Similar to Postman
- **cURL**: Command line tool
- **Thunder Client**: VS Code extension

### Quick Test Script

```javascript
// test-api.js
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    // Test health endpoint
    const health = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('Health check:', health.data);

    // Test products endpoint
    const products = await axios.get(`${API_BASE_URL}/products?limit=5`);
    console.log('Products:', products.data);

    // Test registration
    const register = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('Registration:', register.data);

    // Test login
    const login = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login:', login.data);

    // Test authenticated endpoint
    const profile = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${login.data.data.token}`
      }
    });
    console.log('Profile:', profile.data);

  } catch (error) {
    console.error('Test error:', error.response?.data || error.message);
  }
}

testAPI();
```

Run the test script:
```bash
node test-api.js
```

This comprehensive API documentation provides all the information needed to integrate with the ecommerce API, including authentication, product management, cart operations, and plugin management. 