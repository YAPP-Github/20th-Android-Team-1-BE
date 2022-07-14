import { IsInt, IsString } from 'class-validator';
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
