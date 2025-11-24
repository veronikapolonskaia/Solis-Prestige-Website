const { Sequelize } = require('sequelize');
require('dotenv').config();

const shouldLogSql = (() => {
  if (process.env.SQL_LOGGING === 'true') return true;
  if (process.env.SQL_LOGGING === 'false') return false;
  return process.env.NODE_ENV === 'development';
})();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: shouldLogSql ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV !== 'production') {
      console.log('Database connection has been established successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Sequelize CLI configuration
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: shouldLogSql ? console.log : false
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: shouldLogSql ? console.log : false
  },
  sequelize,
  testConnection
}; 