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
import PromisingModel from './Promising';
import TimeModel from './Time';

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
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => PromisingModel, 'promisingId')
  promising: PromisingModel;

  @BelongsTo(() => User, 'userId')
  user: User;

  @HasMany(() => TimeModel)
  eventTimes: TimeModel[];
}

export default EventModel;
