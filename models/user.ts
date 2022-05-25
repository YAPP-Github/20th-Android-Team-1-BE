import {
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize';

import db from '.';
import PromiseModel from './Promise';

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  userName: string;
}

const UserModel = db.sequelize.define<UserModel>(
  'User',
  {
    id: {
      field: 'userId',
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  { tableName: 'User' }
);

const associate = () => {
  UserModel.hasMany(PromiseModel, { as: 'ownPromise' });
  PromiseModel.belongsTo(UserModel, { as: 'owner' });
};

associate();

export default UserModel;
