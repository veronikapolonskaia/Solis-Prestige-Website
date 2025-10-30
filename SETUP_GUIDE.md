# 🚀 Deluxe Soirée - Complete Setup Guide

Welcome to the Deluxe Soirée e-commerce platform! This guide will help you set up and run the entire project for the first time.

## 📋 Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (version 13 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** (for version control) - [Download here](https://git-scm.com/)

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 2GB free space
- **Internet**: Required for downloading dependencies

## 🛠️ Installation Steps

### Step 1: Download the Project

```bash
# If you have the project files, navigate to the project directory
cd /path/to/your/project

# Or if you need to clone from a repository:
# git clone <repository-url>
# cd ecommerce-backend-admin-PERN-main
```

### Step 2: Install Dependencies

The project has three main components that need their dependencies installed:

```bash
# Install server dependencies
cd server
npm install

# Install frontend dependencies  
cd ../frontend
npm install

# Install admin dashboard dependencies
cd ../admin-dashboard
npm install

# Return to project root
cd ..
```

### Step 3: Database Setup

#### 3.1 Create PostgreSQL Database

```bash
# Connect to PostgreSQL (you may need to enter your password)
psql -U postgres

# Create the database
CREATE DATABASE ecommerce_db;

# Exit PostgreSQL
\q
```

#### 3.2 Configure Database Connection

Edit the file `server/.env` and update the database settings:

```env
# Database Configuration  
DB_HOST=localhost  
DB_PORT=5432  
DB_NAME=ecommerce_db  # Change this to your database name
DB_USER=postgres       # Your PostgreSQL username
DB_PASS=your_password  # Your PostgreSQL password
```

### Step 4: Run Database Migrations

```bash
# Navigate to server directory
cd server

# Run database migrations to create tables
npm run db:migrate

# Seed the database with sample data
npm run seed
```

### Step 5: Configure Environment Variables

#### 5.1 Server Configuration (`server/.env`)

Update the following important settings:

```env
# Server Configuration 
NODE_ENV=development  
PORT=5000  
API_BASE_URL=http://localhost:5000 

# Database Configuration (already configured above)
DB_HOST=localhost  
DB_PORT=5432  
DB_NAME=ecommerce_db  
DB_USER=postgres  
DB_PASS=your_password  

# JWT Configuration (keep these secure)
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRE=24h  
JWT_REFRESH_EXPIRE=7d 

# Admin Configuration (change these!)
ADMIN_EMAIL=admin@deluxesoireeco.com
ADMIN_PASSWORD=your-secure-password



# CORS Configuration (allows frontend to connect)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

#### 5.2 Frontend Configuration (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Option 1: Quick Start (Recommended)

Use the provided script to start all applications at once:

```bash
# Make the script executable (Linux/macOS)
chmod +x start-all.sh

# Run the start script
./start-all.sh
```

**Or on Windows:**
```bash
bash start-all.sh
```

### Option 2: Manual Start

If you prefer to start each component separately:

#### Terminal 1 - Backend Server
```bash
cd server
npm run start
```

#### Terminal 2 - Admin Dashboard
```bash
cd admin-dashboard
npm run start
```

#### Terminal 3 - Frontend
```bash
cd frontend
npm run dev
```

## 🌐 Access Your Applications

Once all services are running, you can access:

- **🏪 Frontend (Customer Store)**: http://localhost:5173
- **⚙️ Admin Dashboard**: http://localhost:3000
- **🔌 API Server**: http://localhost:5000/api

## 👤 Default Admin Access

After running the seed script, you can log in to the admin dashboard with:

- **Email**: `admin@deluxesoireeco.com` 
- **Password**: `admin123456` 

## 🛍️ What You'll See

### Frontend (Customer Store)
- **Inquiry Form**: Single-page form for event inquiries
- **Product Selection**: Choose from available products
- **Contact Form**: Customer contact details
- **Professional Design**: Clean, luxury branding

### Admin Dashboard
- **Orders Management**: View and manage all inquiries
- **Product Management**: Add, edit, and organize products
- **Customer Management**: View customer information
- **Analytics**: Sales and performance metrics
- **Settings**: Configure your store settings

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# If you get "port already in use" errors:
# Kill processes using the ports
lsof -ti:3000 | xargs kill -9  # Admin dashboard
lsof -ti:5000 | xargs kill -9  # Backend server  
lsof -ti:5173 | xargs kill -9  # Frontend
```

#### 2. Database Connection Issues
- Ensure PostgreSQL is running
- Check your database credentials in `server/.env`
- Verify the database `ecommerce_db` exists

#### 3. Dependencies Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 4. Permission Issues (Linux/macOS)
```bash
# Make scripts executable
chmod +x start-all.sh
```

### Getting Help

If you encounter issues:

1. **Check the logs** in each terminal window for error messages
2. **Verify all prerequisites** are installed correctly
3. **Ensure all ports** (3000, 5000, 5173) are available
4. **Check database connection** settings

## 📁 Project Structure

```
ecommerce-backend-admin-PERN-main/
├── 📁 frontend/                 # Customer-facing store
│   ├── src/pages/Home.jsx      # Main inquiry form
│   └── public/                 # Static assets
├── 📁 admin-dashboard/         # Admin panel
│   ├── src/pages/              # Admin pages
│   └── src/components/         # Admin components
├── 📁 server/                 # Backend API
│   ├── src/routes/             # API endpoints
│   ├── src/models/             # Database models
│   └── src/seeders/            # Sample data
├── 📁 development-docs/       # Documentation
└── start-all.sh              # Quick start script
```

### For Customers
- **Event Inquiry Form**: Comprehensive form for event planning
- **Product Selection**: Choose from available packages and add-ons
- **Contact Information**: Easy contact form submission
- **Responsive Design**: Works on all devices

### For Administrators
- **Order Management**: View all inquiries and orders
- **Product Catalog**: Manage your product offerings
- **Customer Data**: Access customer information
- **Invoice Generation**: Download PDF invoices
- **Analytics Dashboard**: Track performance metrics


### Starting the Application
```bash
# Quick start (recommended)
./start-all.sh

# Or manually start each service
```

