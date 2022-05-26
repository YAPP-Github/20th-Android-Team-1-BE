import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import PromiseModel from './Promise';
import PromisingModel from './Promising';
import PromiseUser from './promise-user';
import EventModel from './Event';

@Table({ tableName: 'User', modelName: 'User' })
class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'userId' })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  userName: string;

  @HasMany(() => PromiseModel)
  ownPromises: PromiseModel[];

  @HasMany(() => PromisingModel)
  ownPromisings: PromisingModel[];

  @HasMany(() => EventModel)
  ownEvents: EventModel[];

  @BelongsToMany(() => PromiseModel, () => PromiseUser)
  promises: PromiseModel[];
}

export default User;
