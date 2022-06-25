import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  DataType,
  HasMany,
  AutoIncrement,
  BelongsTo
} from 'sequelize-typescript';
import User from './user';
import PromisingModel from './promising';
import TimeModel from './time';

@Table({ tableName: 'Event', modelName: 'Event' })
class EventModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'eventId' })
  id: number;

  @ForeignKey(() => PromisingModel)
  @Column({ type: DataType.INTEGER })
  promisingId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT })
  userId: number;

  @BelongsTo(() => PromisingModel, 'promisingId')
  promising: PromisingModel;

  @BelongsTo(() => User, 'userId')
  user: User;

  @HasMany(() => TimeModel)
  eventTimes: TimeModel[];
}

export default EventModel;
