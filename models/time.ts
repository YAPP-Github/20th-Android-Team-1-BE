import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  ForeignKey,
  DataType,
  AutoIncrement,
  BelongsTo
} from 'sequelize-typescript';
import EventModel from './Event';

@Table({ tableName: 'Time', modelName: 'Time' })
class TimeModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'timeId' })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  startTime: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  endTime: Date;

  @ForeignKey(() => EventModel)
  @Column({ type: DataType.INTEGER })
  eventId: number;

  @BelongsTo(() => EventModel, 'eventId')
  ownEvent: EventModel;
}

export default TimeModel;
