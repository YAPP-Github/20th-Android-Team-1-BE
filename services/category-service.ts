import CategoryKeyword from '../models/category-keyword';
import { NotFoundException } from '../utils/error';

class CategoryService {
  async getAll() {
    return await CategoryKeyword.findAll();
  }

  async getOneById(id: number) {
    const category = await CategoryKeyword.findByPk(id);
    if (!category) throw new NotFoundException('Category', id);
    return category;
  }
}

export default new CategoryService();
