require('dotenv').config();

module.exports = {
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
    database: 'school',
    username: 'postgres',
    password: '1111',
    host: '127.0.0.1',
    dialect: 'postgres',
  },

  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },
};
