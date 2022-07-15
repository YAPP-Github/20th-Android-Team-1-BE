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
  AutoIncrement
} from 'sequelize-typescript';
import User from './user';
import EventModel from './event';
import CategoryKeyword from './category-keyword';
import PromisingDateModel from './promising-date';
import { IsInt, IsString, Matches } from 'class-validator';

@Table({ tableName: 'Promising', modelName: 'Promising' })
class PromisingModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @IsInt()
  @Column({ type: DataType.INTEGER, field: 'promisingId' })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  @IsString()
  promisingName: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT })
  @IsInt()
  ownerId: number;

  @ForeignKey(() => CategoryKeyword)
  @Column({ type: DataType.INTEGER })
  @IsInt()
  categoryId: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  minTime: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  maxTime: Date;

  @Column({ type: DataType.STRING })
  @IsString()
  placeName: string;

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
