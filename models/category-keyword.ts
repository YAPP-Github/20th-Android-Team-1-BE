import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  HasMany,
  Table
} from 'sequelize-typescript';
import PromisingModel from './Promising';

@Table({ tableName: 'CategoryKeyword', modelName: 'CategoryKeyword' })
class CategoryKeyword extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'categoryId' })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'categoryKeyword' })
  keyword: string;

  @HasMany(() => PromisingModel)
  promisings: PromisingModel[];
}

export default CategoryKeyword;
