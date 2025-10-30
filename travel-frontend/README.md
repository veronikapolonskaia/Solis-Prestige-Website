# Travel Application - Frontend

A modern, responsive travel application built with React, Vite, and Tailwind CSS.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **date-fns** - Date utility library

## 📁 Project Structure

```
travel-frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── context/         # React Context providers
│   ├── services/        # API service layer
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles with Tailwind
├── public/              # Public static files
├── .env                 # Environment variables
└── package.json
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env` and configure:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_APP_NAME=Travel App
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔑 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Key Features

### Authentication Context
- JWT-based authentication
- Persistent login state
- Protected routes
- User profile management

### API Service Layer
- Axios interceptors for auth tokens
- Global error handling
- Organized API endpoints
- Request/response transformation

### Utility Helpers
- Currency formatting
- Date formatting
- Text truncation
- Slug generation
- Email validation
- Image URL helpers
- Local storage wrapper

### Tailwind Components
- Pre-built button styles
- Card components
- Container utilities
- Responsive design classes

## 🎨 Styling

The project uses Tailwind CSS with custom configurations:

- **Primary Color Palette**: Blue shades (customizable in `tailwind.config.js`)
- **Custom Components**: Button styles, cards, containers
- **Font**: Inter (with system fallbacks)
- **Forms Plugin**: Enhanced form styling with `@tailwindcss/forms`

## 🔗 API Integration

The app is configured to connect to the backend API at `http://localhost:5000/api`.

Available API services:
- `authAPI` - Authentication endpoints
- `productsAPI` - Product management
- `categoriesAPI` - Category management
- `cartAPI` - Shopping cart
- `ordersAPI` - Order management
- `checkoutAPI` - Checkout process

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | `Travel App` |
| `VITE_APP_DESCRIPTION` | App description | `Your travel companion` |

## 🚧 Next Steps

1. Configure your travel-specific features
2. Add page components (Home, Destinations, Bookings, etc.)
3. Create reusable UI components
4. Implement routing structure
5. Add state management if needed
6. Configure API endpoints for travel features

## 📱 Responsive Design

The application is built mobile-first with Tailwind's responsive utilities:
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `xl:` - Extra large screens (1280px+)

## 🤝 Contributing

When adding new features:
1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Use the API service layer for backend calls
4. Follow the existing code style
5. Use Tailwind utilities for styling

## 📄 License

This project is part of the PERN ecommerce backend system.
