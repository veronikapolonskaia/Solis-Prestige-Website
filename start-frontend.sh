#!/bin/bash

# Start script for LuxeTravel Frontend

echo "🚀 Starting LuxeTravel Frontend Development Server..."
echo ""

cd travel-frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "✨ Starting Vite dev server..."
echo "🌐 Frontend will be available at: http://localhost:5173 (or next available port)"
echo ""

npm run dev

