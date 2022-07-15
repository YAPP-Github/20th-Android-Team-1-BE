import CategoryKeyword from '../models/category-keyword';
import PromiseModel from '../models/promise';
import User from '../models/user';
import sequelize from 'sequelize';
import promiseUserService from './promise-user-service';
import { NotFoundException } from '../utils/error';

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

  async getPromisesByUser(userId: number) {
    const promises: Array<PromiseModel> = await PromiseModel.findAll({
      include: [
        {
          model: User,
          as: 'members',
          where: { userId: userId },
          attributes: [],
          through: { attributes: [] }
        },
        { model: User, as: 'owner', attributes: { exclude: ['accessToken'] }, required: true },
        { model: CategoryKeyword, as: 'category', required: true }
      ]
    });
    return await promiseUserService.findPromiseMembers(promises);
  }

  async getPromisesByMonth(userId: number, dateTime: Date) {
    const year = dateTime.getFullYear(),
      month = dateTime.getMonth() + 1;
    const promises: Array<PromiseModel> = await PromiseModel.findAll({
      include: [
        {
          model: User,
          as: 'members',
          where: { userId: userId },
          attributes: [],
          through: { attributes: [] }
        },
        { model: User, as: 'owner', attributes: { exclude: ['accessToken'] }, required: true },
        { model: CategoryKeyword, as: 'category', required: true }
      ],
      where: {
        [sequelize.Op.and]: [
          sequelize.where(sequelize.fn('YEAR', sequelize.col('promiseDate')), year),
          sequelize.where(sequelize.fn('MONTH', sequelize.col('promiseDate')), month)
        ]
      }
    });
    return await promiseUserService.findPromiseMembers(promises);
  }

  async getPromisesByDate(userId: number, dateTime: Date) {
    const year = dateTime.getFullYear(),
      month = dateTime.getMonth() + 1,
      date = dateTime.getDate();
    const dateString = year + '-' + month + '-' + date;

    const promises: Array<PromiseModel> = await PromiseModel.findAll({
      include: [
        {
          model: User,
          as: 'members',
          where: { userId: userId },
          attributes: [],
          through: { attributes: [] }
        },
        { model: User, as: 'owner', attributes: { exclude: ['accessToken'] }, required: true },
        { model: CategoryKeyword, as: 'category', required: true }
      ],
      where: sequelize.where(sequelize.fn('date', sequelize.col('promiseDate')), '=', dateString)
    });
    return await promiseUserService.findPromiseMembers(promises);
  }

  async getPromiseById(id: number) {
    const promise = await PromiseModel.findOne({
      include: [
        {
          model: User,
          as: 'members',
          attributes: [],
          through: { attributes: [] }
        },
        { model: User, as: 'owner', attributes: { exclude: ['accessToken'] }, required: true },
        { model: CategoryKeyword, as: 'category', required: true }
      ],
      where: { promiseId: id }
    });
    if (!promise) throw new NotFoundException('Promise', id);
    const promisesWithMembers = await promiseUserService.findPromiseMembers([promise]);
    return promisesWithMembers[0];
  }
}

export default new PromiseService();
