import CategoryKeyword from '../../models/category-keyword';

export class CategoryResponse {
  id: number;
  keyword: string;

  constructor(category: CategoryKeyword) {
    this.id = category.id;
    this.keyword = category.keyword;
  }
}
