import CategoryKeyword from '../models/category-keyword';
import PromiseModel from '../models/promise';
import User from '../models/user';
import sequelize from 'sequelize';

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
          attributes: []
        }
      ],
      raw: true
    });
    return promises;
  }

  async getPromiseByMonth(userId: number, dateTime: Date) {
    const year = dateTime.getFullYear(), month = dateTime.getMonth() + 1
    const promises: Array<PromiseModel> = await PromiseModel.findAll({
      include: [
        {
          model: User,
          as: 'members',
          where: { userId: userId },
          attributes: []
        }
      ],
      raw: true,
      where: {
        [sequelize.Op.and]: [
          sequelize.where(sequelize.fn('YEAR', sequelize.col('promiseDate')), year),
          sequelize.where(sequelize.fn('MONTH', sequelize.col('promiseDate')), month)
        ]
      },
    });
    return promises;
  }

  async getPromiseByDate(userId: number, dateTime: Date) {
    const year = dateTime.getFullYear(), month = dateTime.getMonth() + 1, date = dateTime.getDate();
    const dateString = year + '-' + month + '-' + date;

    const promises: Array<PromiseModel> = await PromiseModel.findAll({
      include: [
        {
          model: User,
          as: 'members',
          where: { userId: userId },
          attributes: []
        }
      ],
      raw: true,
      where: sequelize.where(sequelize.fn('date', sequelize.col('promiseDate')), '=', dateString)
    });
    return promises;
  }
}

export default new PromiseService();
