import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import PromiseModel from './promise';
import User from './user';

@Table({ tableName: 'Promise_User', modelName: 'PromiseUser' })
class PromiseUser extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT })
  userId: number;

  @ForeignKey(() => PromiseModel)
  @Column({ type: DataType.INTEGER })
  promiseId: number;
}

export default PromiseUser;
