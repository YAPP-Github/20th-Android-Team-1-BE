import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import AlarmFormat from './alarm-format';
import User from './user';

@Table({ tableName: 'Alarm' })
class Alarm extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'alarmId' })
  id: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  checked: boolean;

  @Column({ type: DataType.INTEGER })
  promiseId: number;

  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => AlarmFormat, 'formatId')
  format: AlarmFormat;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  receiverId: number;
  @BelongsTo(() => User, 'receiverId')
  receiver: User;
}

export default Alarm;
