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
import CategoryKeyword from './category-keyword';
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
  promiseDate: Date;

  @Column({ type: DataType.STRING })
  placeName: string;

  @ForeignKey(() => CategoryKeyword)
  @Column({ type: DataType.INTEGER })
  categoryId: number;
  @BelongsTo(() => CategoryKeyword, 'categoryId')
  category: CategoryKeyword;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT })
  ownerId: number;
  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @BelongsToMany(() => User, () => PromiseUser, 'promiseId')
  members: User[];
}

export default PromiseModel;
