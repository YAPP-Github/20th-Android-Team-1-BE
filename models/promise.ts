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

const PromiseModel = db.sequelize.define<PromiseModel>(
  'Promise',
  {
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
  },
  { tableName: 'Promise' }
);
//category 연관 처리 필요

export default PromiseModel;
