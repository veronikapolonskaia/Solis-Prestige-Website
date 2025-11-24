const { Sequelize } = require('sequelize');
require('dotenv').config();

const getDbConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
      useUrl: true
    };
  }

  return {
    useUrl: false,
    database: process.env.DB_NAME || process.env.PGDATABASE || 'postgres',
    username: process.env.DB_USER || process.env.PGUSER || 'postgres',
    password: process.env.DB_PASS || process.env.PGPASSWORD || '',
    host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
    port: process.env.DB_PORT || process.env.PGPORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres'
  };
};

const shouldLogSql = (() => {
  if (process.env.SQL_LOGGING === 'true') return true;
  if (process.env.SQL_LOGGING === 'false') return false;
  return process.env.NODE_ENV === 'development';
})();

const sslEnabled = process.env.DB_SSL === 'false' ? false : true;
const dialectOptions = sslEnabled
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  : {};

const baseOptions = {
  logging: shouldLogSql ? console.log : false,
  dialectOptions,
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
};

const dbConfig = getDbConfig();

const sequelize = dbConfig.useUrl
  ? new Sequelize(dbConfig.url, baseOptions)
  : new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        ...baseOptions,
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect
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
    logging: shouldLogSql ? console.log : false,
    dialectOptions: sslConfig.ssl ? sslConfig : {}
  },
  sequelize,
  testConnection
}; 