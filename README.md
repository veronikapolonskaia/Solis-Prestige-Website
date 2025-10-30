# 🛍️ Deluxe Soiree - E-commerce Platform

A modern, full-stack e-commerce solution built with the PERN stack (PostgreSQL, Express.js, React, Node.js) featuring a beautiful frontend, comprehensive admin dashboard, and robust backend API.

![PERN Stack](https://img.shields.io/badge/PERN-Stack-4CAF50?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-316192?style=for-the-badge&logo=postgresql)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd ecommerce-backend-admin-PERN-main

# Install all dependencies
cd server && npm install
cd ../frontend && npm install  
cd ../admin-dashboard && npm install
```

2. **Environment Setup**
```bash
# Copy environment files
cp server/.env.example server/.env
cp frontend/.env.example frontend/.env
cp admin-dashboard/.env.example admin-dashboard/.env
```

3. **Database Setup**
```bash
# Create PostgreSQL database
createdb ecommerce_db

# Run migrations and seed data
cd server
npm run db:migrate
npm run seed
```

4. **Start Development Servers**
```bash
# Terminal 1 - Backend Server
cd server
npm run start

# Terminal 2 - Admin Dashboard  
cd admin-dashboard
npm run start

# Terminal 3 - Frontend
cd frontend
npm run dev
```

### ▶️ One-command start (all apps)

Use the helper script to start Backend, Admin, and Frontend together:

```bash
# From the project root
bash start-all.sh

# Optional: make it executable once and run directly
chmod +x start-all.sh
./start-all.sh
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Admin Dashboard**: http://localhost:3000  
- **API**: http://localhost:5000/api

## 🏗️ Project Structure

```
ecommerce-backend-admin-PERN-main/
├── 📁 frontend/                 # React customer frontend
├── 📁 admin-dashboard/         # React admin panel
├── 📁 server/                 # Node.js backend API
└── 📁 development-docs/       # Documentation
```

## 🔧 Key Features

### Frontend
- Modern UI/UX with luxury branding
- Product catalog with filtering
- Shopping cart functionality
- User authentication
- Responsive design with Tailwind CSS

### Admin Dashboard
- Modern glass morphism design
- Dashboard analytics and reporting
- Product and order management
- Customer management
- Settings and plugin management

### Backend API
- RESTful API with 50+ endpoints
- JWT authentication
- PostgreSQL with Sequelize ORM
- File upload with image processing
- Plugin architecture system

## 🛡️ Security & Performance

- JWT-based authentication
- Rate limiting and CORS protection
- Input validation and SQL injection protection
- Image optimization with Sharp
- Database indexing and caching

## 📚 Documentation

- **API Documentation**: http://localhost:5000/api-docs
- **Development Guide**: See `development-docs/` folder
- **Plugin Development**: Modular plugin system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Deluxe Soiree - Luxury soft play & event rentals**