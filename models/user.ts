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
import Alarm from './alarm';
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

  @BelongsToMany(() => PromiseModel, () => PromiseUser, 'userId')
  promises: PromiseModel[];

  @HasMany(() => PromiseModel)
  ownPromises: PromiseModel[];

  @HasMany(() => Alarm)
  alarms: Alarm[];

  @HasMany(() => PromisingModel)
  ownPromisings: PromisingModel[];

  @HasMany(() => EventModel)
  ownEvents: EventModel[];

}

export default User;
