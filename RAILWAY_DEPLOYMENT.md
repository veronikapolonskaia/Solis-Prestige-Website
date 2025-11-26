# 🚂 Railway Deployment Guide

Complete guide for deploying the E-commerce Platform (Frontend, Backend, Admin Dashboard) on Railway.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Railway Setup](#railway-setup)
3. [Database Setup](#database-setup)
4. [Backend/Server Deployment](#backendserver-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Admin Dashboard Deployment](#admin-dashboard-deployment)
7. [System Endpoints](#system-endpoints)
8. [Environment Variables Reference](#environment-variables-reference)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository with your code
- Basic understanding of environment variables

---

## Railway Setup

### 1. Create a New Project

1. Log in to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"** (or use Railway CLI)
4. Connect your repository

### 2. Create Services

You'll need to create **4 separate services**:

1. **PostgreSQL Database** (Railway managed)
2. **Backend/API Server** (Node.js)
3. **Travel Frontend** (Vite/React)
4. **Admin Dashboard** (Create React App)

---

## Database Setup

### 1. Create PostgreSQL Service

1. In your Railway project, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically create a PostgreSQL instance
3. Note the connection details (available in the **Variables** tab)

### 2. Database Connection Variables

Railway automatically provides these variables for your database service:
- `DATABASE_URL` - Full connection string (use this)
- `PGHOST` - Internal hostname
- `PGPORT` - Port (usually 5432)
- `PGDATABASE` - Database name
- `PGUSER` - Username
- `PGPASSWORD` - Password

**Important:** Use `DATABASE_URL` for the backend service connection.

---

## Backend/Server Deployment

### 1. Create Backend Service

1. In Railway project, click **"+ New"** → **"Empty Service"**
2. Name it: `Backend` or `API Server`
3. Connect your GitHub repository
4. Set the **Root Directory** to: `server`

### 2. Configure Build Settings

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Port:**
- Railway automatically sets `PORT` environment variable
- The server code uses: `const PORT = parseInt(process.env.PORT, 10) || 5000;`
- **Important:** Set `PORT=5000` in Railway environment variables to match your service configuration

### 3. Required Environment Variables

Add these in Railway → Your Backend Service → **Variables**:

#### Database
```
DATABASE_URL=<from-postgres-service>
# OR use individual variables:
DB_HOST=postgres.railway.internal
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASS=<from-postgres-variables>
```

#### JWT Configuration
```
JWT_SECRET=<generate-a-random-secret>
JWT_REFRESH_SECRET=<generate-another-random-secret>
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
```

#### Server Configuration
```
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.up.railway.app,https://your-admin-domain.up.railway.app
```

#### Migration Token (for system endpoints)
```
MIGRATION_TOKEN=<generate-a-secure-random-token>
```

#### Optional (Email, Stripe, etc.)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Deploy

1. Railway will automatically detect changes and deploy
2. Check **Logs** tab to verify deployment
3. You should see: `✅ Database connection verified` and `🚀 Ecommerce API server running on port 5000`

### 5. Verify Deployment

Test the health endpoint:
```bash
curl https://your-backend-domain.up.railway.app/health
```

Expected response:
```json
{
  "success": true,
  "message": "Ecommerce API is running",
  "timestamp": "2025-11-25T...",
  "environment": "production"
}
```

---

## Frontend Deployment

### 1. Create Frontend Service

1. In Railway project, click **"+ New"** → **"Empty Service"**
2. Name it: `Travel Frontend` or `Frontend`
3. Connect your GitHub repository
4. Set the **Root Directory** to: `travel-frontend`

### 2. Configure Build Settings

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run preview -- --port $PORT --host
```

**OR** use Railway's static file serving (recommended):
- After build, Railway can serve static files automatically
- No start command needed for static sites

### 3. Required Environment Variables

Add in Railway → Your Frontend Service → **Variables**:

```
VITE_API_URL=https://your-backend-domain.up.railway.app/api
NODE_ENV=production
```

**Critical:** 
- Vite only exposes environment variables prefixed with `VITE_`
- The variable must be `VITE_API_URL` (not `API_URL` or `REACT_APP_API_URL`)
- Rebuild after changing environment variables

### 4. Deploy

1. Railway will build and deploy automatically
2. Check **Logs** to verify build success
3. Your frontend will be available at: `https://your-frontend-domain.up.railway.app`

### 5. Verify Deployment

1. Open your frontend URL in a browser
2. Check browser console for API connection errors
3. Network tab should show requests to: `https://your-backend-domain.up.railway.app/api/...`

---

## Admin Dashboard Deployment

### 1. Create Admin Service

1. In Railway project, click **"+ New"** → **"Empty Service"**
2. Name it: `Admin Dashboard` or `Admin`
3. Connect your GitHub repository
4. Set the **Root Directory** to: `admin-dashboard`

### 2. Configure Build Settings

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm install -g serve && serve -s build -l $PORT
```

**OR** use Railway's static file serving:
- After build, Railway can serve static files automatically

### 3. Required Environment Variables

Add in Railway → Your Admin Service → **Variables**:

```
REACT_APP_API_BASE_URL=https://your-backend-domain.up.railway.app/api
NODE_ENV=production
```

**Critical:**
- Create React App only exposes variables prefixed with `REACT_APP_`
- The variable must be `REACT_APP_API_BASE_URL`
- Rebuild after changing environment variables

### 4. Deploy

1. Railway will build and deploy automatically
2. Check **Logs** to verify build success
3. Your admin dashboard will be available at: `https://your-admin-domain.up.railway.app`

---

## System Endpoints

The backend includes special system endpoints for database management. These are protected by `MIGRATION_TOKEN`.

### 1. Database Health Check

**Endpoint:** `GET /api/system/db-health`

**Usage:**
```bash
curl https://your-backend-domain.up.railway.app/api/system/db-health
```

**Response:**
```json
{
  "success": true,
  "message": "Database connection is healthy",
  "latencyMs": 15
}
```

### 2. Run Migrations

**Endpoint:** `POST /api/system/migrate`

**Usage:**
```bash
curl -X POST https://your-backend-domain.up.railway.app/api/system/migrate \
  -H "x-migration-token: your-migration-token"
```

**OR using query parameter:**
```bash
curl -X POST "https://your-backend-domain.up.railway.app/api/system/migrate?token=your-migration-token"
```

**Response:**
```json
{
  "success": true,
  "message": "Migrations executed successfully",
  "migrated": [
    "001-create-users.js",
    "002-create-categories.js",
    ...
  ]
}
```

**What it does:**
- Enables PostgreSQL UUID extension (`uuid-ossp`)
- Runs all pending database migrations
- Creates all required tables (users, products, categories, orders, etc.)

### 3. Run Seeders

**Endpoint:** `POST /api/system/seed`

**Actions:**
- `run` (default) - Run all seeders
- `undo` - Remove all seeded data
- `reset` - Undo all, then run all

**Usage:**

Run seeders:
```bash
curl -X POST "https://your-backend-domain.up.railway.app/api/system/seed?action=run" \
  -H "x-migration-token: your-migration-token"
```

Undo seeders:
```bash
curl -X POST "https://your-backend-domain.up.railway.app/api/system/seed?action=undo" \
  -H "x-migration-token: your-migration-token"
```

Reset (undo + run):
```bash
curl -X POST "https://your-backend-domain.up.railway.app/api/system/seed?action=reset" \
  -H "x-migration-token: your-migration-token"
```

**Response:**
```json
{
  "success": true,
  "message": "Seeders executed successfully",
  "executed": [
    "001-demo-users.js",
    "002-demo-categories.js",
    ...
  ],
  "summary": {
    "users": "4 demo users (admin + 3 customers)",
    "categories": "10 categories with hierarchical structure",
    "products": "10 products across different categories",
    "credentials": {
      "admin": "admin@ecommerce.com / password123",
      "customers": [
        "john.doe@example.com / password123",
        "jane.smith@example.com / password123",
        "mike.wilson@example.com / password123"
      ]
    }
  }
}
```

**What gets seeded:**
- 4 demo users (1 admin + 3 customers)
- 10 categories
- 10 products with images and variants
- Orders, cart items, addresses
- Gallery items
- Settings

**Demo Login Credentials:**
- **Admin:** `admin@ecommerce.com` / `password123`
- **Customers:** `john.doe@example.com` / `password123` (and others)

---

## Environment Variables Reference

### Backend Service

| Variable | Required | Description | Example |
|----------|----------|-------------|----------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `NODE_ENV` | Yes | Environment mode | `production` |
| `PORT` | Yes | Server port (must match Railway config) | `5000` |
| `JWT_SECRET` | Yes | Secret for JWT tokens | Random string |
| `JWT_REFRESH_SECRET` | Yes | Secret for refresh tokens | Random string |
| `JWT_EXPIRE` | No | JWT expiration | `24h` |
| `JWT_REFRESH_EXPIRE` | No | Refresh token expiration | `7d` |
| `CORS_ORIGIN` | Yes | Allowed frontend origins (comma-separated) | `https://frontend.up.railway.app,https://admin.up.railway.app` |
| `MIGRATION_TOKEN` | Recommended | Token for system endpoints | Random secure string |
| `SMTP_HOST` | No | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | No | Email server port | `587` |
| `SMTP_USER` | No | Email username | `your-email@gmail.com` |
| `SMTP_PASS` | No | Email password | `your-app-password` |
| `STRIPE_SECRET_KEY` | No | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook secret | `whsec_...` |

### Frontend Service (Travel Frontend)

| Variable | Required | Description | Example |
|----------|----------|-------------|----------|
| `VITE_API_URL` | Yes | Backend API URL | `https://backend.up.railway.app/api` |
| `NODE_ENV` | Yes | Environment mode | `production` |

### Admin Dashboard Service

| Variable | Required | Description | Example |
|----------|----------|-------------|----------|
| `REACT_APP_API_BASE_URL` | Yes | Backend API URL | `https://backend.up.railway.app/api` |
| `NODE_ENV` | Yes | Environment mode | `production` |

---

## Troubleshooting

### Backend Issues

#### 502 Bad Gateway

**Symptoms:** `{"status":"error","code":502,"message":"Application failed to respond"}`

**Causes & Solutions:**

1. **Server not listening on correct port**
   - Check Railway logs for: `🚀 Ecommerce API server running on port XXXX`
   - Ensure `PORT=5000` matches Railway service configuration
   - Verify server binds to `0.0.0.0` (not `localhost`)

2. **Database connection failed**
   - Check `DATABASE_URL` is set correctly
   - Verify database service is running
   - Check database logs for connection errors

3. **Missing environment variables**
   - Ensure all required variables are set
   - Check for typos in variable names

#### Connection Refused Errors

**Symptoms:** `"connection refused"` in Railway HTTP logs

**Solutions:**
- Verify server is actually running (check logs)
- Ensure `PORT` environment variable matches Railway's expected port
- Check that server binds to `0.0.0.0`, not `localhost`

#### Rate Limiter Error: X-Forwarded-For Header

**Symptoms:** `ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false`

**Solution:**
- Ensure `app.set('trust proxy', 1);` is set in `server/src/app.js` (before rate limiter)

#### Database Tables Don't Exist

**Symptoms:** `relation "users" does not exist`

**Solution:**
- Run migrations using the `/api/system/migrate` endpoint
- Ensure `MIGRATION_TOKEN` is set in backend environment variables

#### UUID Function Not Found

**Symptoms:** `function uuid_generate_v4() does not exist`

**Solution:**
- The migration endpoint automatically enables the UUID extension
- If it fails, manually run: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### Frontend Issues

#### API Calls Going to localhost

**Symptoms:** Network requests show `http://localhost:5000/api/...`

**Causes & Solutions:**

1. **Missing or incorrect environment variable**
   - For Vite: Must be `VITE_API_URL` (not `API_URL`)
   - For CRA: Must be `REACT_APP_API_BASE_URL`
   - Rebuild after changing environment variables

2. **Build cached old values**
   - Trigger a new deployment
   - Clear browser cache

3. **Variable not set before build**
   - Environment variables must be set before the build runs
   - Railway injects them during build, but you must redeploy after adding them

#### CORS Errors

**Symptoms:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Add your frontend URL to `CORS_ORIGIN` in backend environment variables
- Format: `https://frontend.up.railway.app,https://admin.up.railway.app`
- Redeploy backend after changing

### Admin Dashboard Issues

#### Same as Frontend Issues

- Follow the same troubleshooting steps
- Remember: Admin uses `REACT_APP_API_BASE_URL` (not `VITE_API_URL`)

### Migration/Seeding Issues

#### Migration Token Invalid

**Symptoms:** `Invalid or missing migration token`

**Solution:**
- Set `MIGRATION_TOKEN` in backend environment variables
- Use the same token in the request header: `x-migration-token: your-token`

#### Migrations Fail

**Symptoms:** Migration errors in response

**Solutions:**
- Check backend logs for detailed error messages
- Ensure database connection is working (`/api/system/db-health`)
- Verify UUID extension is enabled (migration endpoint does this automatically)

---

## Deployment Checklist

### Before Deployment

- [ ] All services created in Railway
- [ ] Database service created and running
- [ ] Environment variables prepared
- [ ] `MIGRATION_TOKEN` generated and saved securely

### Backend Deployment

- [ ] Root directory set to `server`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] `PORT=5000` set in environment variables
- [ ] `DATABASE_URL` set (from PostgreSQL service)
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` set
- [ ] `CORS_ORIGIN` includes all frontend URLs
- [ ] `MIGRATION_TOKEN` set
- [ ] Service deployed successfully
- [ ] Health check passes: `/health` endpoint works

### Database Setup

- [ ] Run migrations: `POST /api/system/migrate`
- [ ] Verify tables created (check logs or use db-health)
- [ ] (Optional) Run seeders: `POST /api/system/seed?action=run`

### Frontend Deployment

- [ ] Root directory set to `travel-frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] `VITE_API_URL` set to backend URL
- [ ] Service deployed successfully
- [ ] Test API calls in browser console

### Admin Dashboard Deployment

- [ ] Root directory set to `admin-dashboard`
- [ ] Build command: `npm install && npm run build`
- [ ] `REACT_APP_API_BASE_URL` set to backend URL
- [ ] Service deployed successfully
- [ ] Test login with admin credentials

### Post-Deployment

- [ ] All services accessible via Railway domains
- [ ] Frontend can communicate with backend
- [ ] Admin dashboard can communicate with backend
- [ ] Database migrations completed
- [ ] (Optional) Demo data seeded
- [ ] Test user registration/login
- [ ] Test admin login

---

## Quick Reference Commands

### Check Database Health
```bash
curl https://your-backend.up.railway.app/api/system/db-health
```

### Run Migrations
```bash
curl -X POST https://your-backend.up.railway.app/api/system/migrate \
  -H "x-migration-token: YOUR_TOKEN"
```

### Run Seeders
```bash
curl -X POST "https://your-backend.up.railway.app/api/system/seed?action=run" \
  -H "x-migration-token: YOUR_TOKEN"
```

### Undo Seeders
```bash
curl -X POST "https://your-backend.up.railway.app/api/system/seed?action=undo" \
  -H "x-migration-token: YOUR_TOKEN"
```

### Reset Database (Undo + Run Seeders)
```bash
curl -X POST "https://your-backend.up.railway.app/api/system/seed?action=reset" \
  -H "x-migration-token: YOUR_TOKEN"
```

---

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use strong, random values** for `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `MIGRATION_TOKEN`
3. **Keep `MIGRATION_TOKEN` secret** - it provides admin access to database operations
4. **Set `CORS_ORIGIN`** to only your production domains
5. **Use HTTPS** in production (Railway provides this automatically)
6. **Rotate secrets** periodically in production

---

## Support

If you encounter issues not covered in this guide:

1. Check Railway service logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure all services are deployed and running
5. Test database connectivity using `/api/system/db-health`

---

**Last Updated:** November 2025  
**Platform:** Railway  
**Stack:** PERN (PostgreSQL, Express, React, Node.js)

