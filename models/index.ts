import { Sequelize } from 'sequelize-typescript';
import config from '../config/db-config.json';
import Alarm from './alarm';
import AlarmFormat from './alarm-format';
import CategoryKeyword from './category-keyword';
import PromiseModel from './promise';
import PromiseUser from './promise-user';
import User from './user';
import TimeModel from './time';
import EventModel from './event';
import PromisingModel from './promising';
import PromisingDateModel from './promising-date';

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: 'mysql',
    define: { timestamps: false },
    dialectOptions: { connectTimeout: 150000 },
    pool: {
      max: 30000,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

sequelize.addModels([
  User,
  PromiseModel,
  PromiseUser,
  Alarm,
  AlarmFormat,
  CategoryKeyword,
  TimeModel,
  PromisingModel,
  EventModel,
  PromisingDateModel
]);
const db = { sequelize: sequelize, Sequelize };

export default db;
