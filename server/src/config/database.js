const { Sequelize } = require('sequelize');
require('dotenv').config();

const shouldLogSql = (() => {
  if (process.env.SQL_LOGGING === 'true') return true;
  if (process.env.SQL_LOGGING === 'false') return false;
  return process.env.NODE_ENV === 'development';
})();

const sslOptions = process.env.DB_SSL === 'false' ? undefined : {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
};

const baseSequelizeOptions = {
  dialect: 'postgres',
  logging: shouldLogSql ? console.log : false,
  dialectOptions: sslOptions,
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

const resolveCredentials = () => ({
  username: process.env.DB_USER || process.env.PGUSER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.DB_PASS || process.env.PGPASSWORD || '',
  database: process.env.DB_NAME || process.env.PGDATABASE || 'postgres',
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  port: process.env.DB_PORT || process.env.PGPORT || 5432
});

const connection = resolveCredentials();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, baseSequelizeOptions)
  : new Sequelize(
      connection.database,
      connection.username,
      connection.password,
      {
        ...baseSequelizeOptions,
        host: connection.host,
        port: connection.port
      }
    );

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

const cliConfig = {
  username: connection.username,
  password: connection.password,
  database: connection.database,
  host: connection.host,
  port: connection.port,
  dialect: 'postgres',
  dialectOptions: sslOptions
};

module.exports = {
  development: cliConfig,
  test: cliConfig,
  production: cliConfig,
  sequelize,
  Sequelize,
  testConnection
};
