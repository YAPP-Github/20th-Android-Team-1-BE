import { Sequelize } from 'sequelize';
import config from '../config/db-config.json';

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: 'mysql',
    define: { timestamps: false },
    timezone: '+09:00',
    dialectOptions: { connectTimeout: 150000 },
    pool: {
      max: 30000,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = { sequelize: sequelize, Sequelize };
sequelize.sync();

export default db;
