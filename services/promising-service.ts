import PromisingModel from '../models/promising';
import CategoryKeyword from '../models/category-keyword';
import { PromisingRequest } from '../dtos/promising/request';
import { NotFoundException } from '../utils/error';
import User from '../models/user';
import { PromisingResponse } from '../dtos/promising/response';

class PromisingService {
  async create(promisingInfo: PromisingRequest) {
    const category = await CategoryKeyword.findOne({ where: { id: promisingInfo.categoryId } });
    const user = await User.findOne({ where: { id: promisingInfo.ownerId } });

    if (!user) return new NotFoundException('User', promisingInfo.ownerId);
    if (!category) return new NotFoundException('CategoryKeyword', promisingInfo.categoryId);

    const promising = new PromisingModel(promisingInfo);
    const savedPromising = await promising.save();
    const promisingResponse = new PromisingResponse(savedPromising, category);

    return promisingResponse;
  }
}

export default new PromisingService();
