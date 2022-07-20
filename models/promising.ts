import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  HasMany,
  ForeignKey,
  BelongsTo,
  DataType,
  AutoIncrement,
  UpdatedAt,
  CreatedAt
} from 'sequelize-typescript';
import User from './user';
import EventModel from './event';
import CategoryKeyword from './category-keyword';
import PromisingDateModel from './promising-date';

@Table({ tableName: 'Promising', modelName: 'Promising' })
class PromisingModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'promisingId' })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  promisingName: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT })
  ownerId: number;

  @ForeignKey(() => CategoryKeyword)
  @Column({ type: DataType.INTEGER })
  categoryId: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  minTime: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  maxTime: Date;

  @Column({ type: DataType.STRING })
  placeName: string;

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => EventModel)
  ownEvents: EventModel[];

  @HasMany(() => PromisingDateModel)
  ownPromisingDates: PromisingDateModel[];

  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @BelongsTo(() => CategoryKeyword, 'categoryId')
  ownCategory: CategoryKeyword;
}

export default PromisingModel;
