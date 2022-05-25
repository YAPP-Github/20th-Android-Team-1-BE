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

const PromiseUserModel = db.sequelize.define<PromiseUserModel>('Promise_User', {
  id: {
    field: 'id',
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  }
});

UserModel.belongsToMany(PromiseModel, { through: PromiseUserModel, as: '' });
PromiseModel.belongsToMany(UserModel, { through: PromiseUserModel });
