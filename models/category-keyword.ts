import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';

@Table({ tableName: 'CategoryKeyword', modelName: 'CategoryKeyword' })
class CategoryKeyword extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'categoryId' })
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'categoryKeyword' })
  keyword: string;
}

export default CategoryKeyword;
