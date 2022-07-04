import CategoryKeyword from '../models/category-keyword';

class CategoryService {
  async getAll() {
    return await CategoryKeyword.findAll();
  }
}

export default new CategoryService();
