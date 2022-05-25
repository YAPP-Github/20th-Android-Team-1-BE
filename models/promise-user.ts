import {
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize';

import db from '.';
import PromiseModel from './Promise';
import UserModel from './user';

interface PromiseUserModel
  extends Model<InferAttributes<PromiseUserModel>, InferCreationAttributes<PromiseUserModel>> {
  id: CreationOptional<number>;
}

const PromiseUserModel = db.sequelize.define<PromiseUserModel>(
  'Promise_User',
  {
    id: {
      field: 'id',
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false
    }
  },
  { tableName: 'Promise_User' }
);

const associate = () => {
  UserModel.belongsToMany(PromiseModel, { through: PromiseUserModel });
  PromiseModel.belongsToMany(UserModel, { through: PromiseUserModel });
};

associate();

export default PromiseUserModel;
