import fs from 'fs';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import startsWith from 'lodash/startsWith'
import path from 'path';
import Sequelize from 'sequelize';
import configJson from '../config/config';

const basename = path.basename(__filename);
const environment = process.env.NODE_ENV || 'development';

const config = configJson[environment];

console.log('this is the environment:', environment);

const database = {};

let sequelize;
if (config.environment === 'production') {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
  // sequelize = new Sequelize(
  //   process.env.DB_NAME,
  //   process.env.DB_USER,
  //   process.env.DB_PASS,
  //   {
  //     host: process.env.DB_HOST,
  //     port: process.env.DB_PORT,
  //     dialect: 'postgres',
  //     dialectOption: {
  //       ssl: true,
  //       native: true,
  //     },
  //     logging: true,
  //   },
  // );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
  // sequelize = new Sequelize(process.env[config.use_env_variable], config);
}

forEach(
  filter(fs.readdirSync(__dirname), file => {
    return (
      !startsWith(file, '.') && file !== basename && file.slice(-3) === '.js'
    );
  }),
  file => {
    const model = sequelize.import(path.join(__dirname, file));
    database[model.name] = model;
  },
);

forEach(keys(database), modelName => {
  if (database[modelName].associate) {
    database[modelName].associate(database);
  }
});

database.sequelize = sequelize;
database.Sequelize = Sequelize;

export default database;
