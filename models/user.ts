import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import Alarm from './alarm';
import PromiseModel from './promise';
import PromisingModel from './promising';
import PromiseUser from './promise-user';
import EventModel from './event';

@Table({ tableName: 'User', modelName: 'User' })
class User extends Model {
  @PrimaryKey
  @Column({ type: DataType.BIGINT, field: 'userId' })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  userName: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  accessToken: string;

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
