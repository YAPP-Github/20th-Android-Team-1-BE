import {
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize';

import db from '.';

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  userName: string;
}

const UserModel = db.sequelize.define<UserModel>('User', {
  id: {
    field: 'userId',
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default UserModel;
