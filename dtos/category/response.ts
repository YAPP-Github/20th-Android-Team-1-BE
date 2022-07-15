import { IsInt, IsString,ValidateNested,IsArray } from 'class-validator';
import CategoryKeyword from '../../models/category-keyword';
import { JSONSchema } from 'class-validator-jsonschema';
import { Type } from 'class-transformer';

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

export class CategoriesResponse{
  @IsArray()
  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/CategoryResponse'
    }
  })
  @Type(() => CategoryResponse)
  @ValidateNested()
  categories : Array<CategoryResponse>
}