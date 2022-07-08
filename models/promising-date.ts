import {
  PrimaryKey,
  BelongsTo,
  AllowNull,
  ForeignKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table
} from 'sequelize-typescript';
import PromisingModel from './promising';

@Table({ tableName: 'PromisingDate', modelName: 'PromisingDate' })
class PromisingDateModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'promisingDateId' })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  date: Date;

  @ForeignKey(() => PromisingModel)
  @Column({ type: DataType.INTEGER })
  promisingId: number;

  @BelongsTo(() => PromisingModel, { foreignKey: 'promisingId', onDelete: 'cascade' })
  promising: PromisingModel;
}

export default PromisingDateModel;
