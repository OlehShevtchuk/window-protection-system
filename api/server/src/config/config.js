require('dotenv').config();

module.exports = {
  // If using onine database
  // development: {
  //   use_env_variable: 'DATABASE_URL'
  // },

  // for online db
  // development: {
  //   use_env_variable: 'DATABASE_URL',
  //   dialect: 'postgres',
  //   dialectOptions: {
  //     ssl: {
  //       require: true,
  //       rejectUnauthorized: false,
  //     },
  //     native: true,
  //   },
  //   ssl: true,
  // },

  development: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },

  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },

  test: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },

  // production: {
  //   database: process.env.DB_NAME,
  //   username: process.env.DB_USER,
  //   password: process.env.DB_PASS,
  //   host: process.env.DB_HOST,
  //   dialect: 'postgres'
  // }
};
