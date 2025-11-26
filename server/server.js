const app = require('./src/app');
const { testConnection, sequelize } = require('./src/config/database');

// Force API to always run on port 5000 (NGINX proxies to this)
const PORT = parseInt(process.env.PORT, 10) || 5000;

// Initialize database before starting server
async function startServer() {
  try {
    // Wait for database connection
    await testConnection();
    console.log('✅ Database connection verified');
    
    // Sync database models - only if SYNC_MODELS is enabled
    if (process.env.SYNC_MODELS === 'true') {
      const models = require('./src/models');
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synced');
    }
    
    // Start server - bind to 0.0.0.0 for Railway
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Ecommerce API server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'production'}`);
      console.log(`🔗 API Base URL: http://0.0.0.0:${PORT}/api`);
      console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/health`);
      console.log(`📚 API Documentation: http://0.0.0.0:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
