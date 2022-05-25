import {
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize';

import db from '.';

interface PromiseModel
  extends Model<InferAttributes<PromiseModel>, InferCreationAttributes<PromiseModel>> {
  id: CreationOptional<number>;
  promiseName: string;
  startDate: Date;
  endDate: Date;
  placeName?: string;
}

const PromiseModel = db.sequelize.define<PromiseModel>('User', {
  id: {
    field: 'promiseId',
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  promiseName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  placeName: {
    type: DataTypes.STRING
  }
});
//categoryId

export default PromiseModel;
