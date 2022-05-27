import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';

@Table({ tableName: 'AlarmFormat', modelName: 'AlarmFormat' })
class AlarmFormat extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'formatId' })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.STRING })
  content: string;
}

export default AlarmFormat;
