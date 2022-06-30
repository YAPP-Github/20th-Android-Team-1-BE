import CategoryKeyword from '../models/category-keyword';
import PromiseModel from '../models/promise';
import User from '../models/user';

class PromiseService {
  async create(
    promiseName: string,
    placeName: string,
    date: Date,
    owner: User,
    category: CategoryKeyword,
    members: User[]
  ) {
    const promise = new PromiseModel({ promiseName, placeName, promiseDate: date });
    const savedPromise = await promise.save();
    await savedPromise.$set('owner', owner);
    await savedPromise.$set('category', category);
    await savedPromise.$set('members', members);
    return savedPromise;
  }

  async getPromiseByUser(userId: number) {
    const promises: Array<PromiseModel> = await PromiseModel.findAll({
      include: [
        {
          model: User,
          as: 'members',
          where: { userId: userId },
          required: true,
        }
      ],
      raw: true
    });
    return promises;
  }
}

export default new PromiseService();
