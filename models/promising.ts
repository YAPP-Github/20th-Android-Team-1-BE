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
import EventModel from './Event';
import CategoryKeyword from './category-keyword';

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
  @Column({ type: DataType.INTEGER })
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

  @HasMany(() => EventModel)
  ownEvents: EventModel[];

  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @BelongsTo(() => CategoryKeyword, 'categoryId')
  ownCategory: CategoryKeyword;
}

export default PromisingModel;
