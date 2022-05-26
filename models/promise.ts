import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
  DataType,
  AutoIncrement
} from 'sequelize-typescript';
import PromiseUser from './promise-user';

import User from './user';

@Table({ tableName: 'Promise', modelName: 'Promise' })
class PromiseModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'promiseId' })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  promiseName: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  startDate: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  endDate: Date;

  @Column({ type: DataType.STRING })
  placeName: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  ownerId: number;

  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @BelongsToMany(() => User, () => PromiseUser)
  members: User[];
}

export default PromiseModel;
