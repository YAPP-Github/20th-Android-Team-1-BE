import { IsInt, IsString, MaxLength } from 'class-validator';
import CategoryKeyword from '../../models/category-keyword';

export class CategoryResponse {
  @IsInt()
  id: number;
  @IsString()
  keyword: string;

  constructor(category: CategoryKeyword) {
    this.id = category.id;
    this.keyword = category.keyword;
  }
}

export class RandomNameResponse {
  @MaxLength(10)
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
