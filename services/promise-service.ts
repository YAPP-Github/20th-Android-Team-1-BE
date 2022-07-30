import CategoryKeyword from '../models/category-keyword';
import PromiseModel from '../models/promise';
import User from '../models/user';
import sequelize from 'sequelize';
import promiseUserService from './promise-user-service';
import { NotFoundException } from '../utils/error';
import { Op } from 'sequelize';
import PromiseUser from '../models/promise-user';
import { InternalServerException } from '../utils/error';
import {UNKNOWN_USER_ID} from '../constants/nums';

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
    const includeConds = [
      {
        model: User,
        as: 'members',
        where: { userId: userId },
        attributes: [],
        through: { attributes: [] }
      },
      { model: User, as: 'owner', attributes: { exclude: ['accessToken'] }, required: true },
      { model: CategoryKeyword, as: 'category', required: true }
    ];
    const promisesFuture = await PromiseModel.findAll({
      include: includeConds,
      where: { promiseDate: { [Op.gte]: new Date() } },
      order: [['promiseDate', 'ASC']]
    });

    const promisesPast = await PromiseModel.findAll({
      include: includeConds,
      where: { promiseDate: { [Op.lt]: new Date() } },
      order: [['promiseDate', 'ASC']]
    });
    return await promiseUserService.findPromiseMembers([...promisesFuture, ...promisesPast]);
  }

  async getPromisesByMonth(userId: number, dateTime: Date) {
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const includeConds = [
      {
        model: User,
        as: 'members',
        where: { userId: userId },
        attributes: [],
        through: { attributes: [] }
      },
      { model: User, as: 'owner', attributes: { exclude: ['accessToken'] }, required: true },
      { model: CategoryKeyword, as: 'category', required: true }
    ];
    const whereConds = [
      sequelize.where(sequelize.fn('YEAR', sequelize.col('promiseDate')), year),
      sequelize.where(sequelize.fn('MONTH', sequelize.col('promiseDate')), month)
    ];

    const promises = await PromiseModel.findAll({
      include: includeConds,
      where: {
        [sequelize.Op.and]: whereConds
      },
      order: [['promiseDate', 'ASC']]
    });

    return await promiseUserService.findPromiseMembers(promises);
  }

  async getPromisesByDate(userId: number, dateTime: Date) {
    const year = dateTime.getFullYear(),
      month = dateTime.getMonth() + 1,
      date = dateTime.getDate();
    const dateString = year + '-' + month + '-' + date;
    const includeConds = [
      {
        model: User,
        as: 'members',
        where: { userId: userId },
        attributes: [],
        through: { attributes: [] }
      },
      { model: User, as: 'owner', attributes: { exclude: ['accessToken'] }, required: true },
      { model: CategoryKeyword, as: 'category', required: true }
    ];

    const promises = await PromiseModel.findAll({
      include: includeConds,
      where: sequelize.where(sequelize.fn('date', sequelize.col('promiseDate')), '=', dateString),
      order: [['promiseDate', 'ASC']]
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

  async resignOwner(userId:number){
    await promiseUserService.updateResignMember(userId);
    
    const promises = await PromiseModel.findAll({where:{ownerId:userId}});
    if(!promises)return;
    await PromiseModel.update({ownerId:UNKNOWN_USER_ID},{where:{ownerId: userId}});

    const promiseListMemberJoined= await PromiseUser.findAll({
      where: {userId:userId},
      attributes:['promiseId'], 
      raw:true 
    });
    const promiseIdList =promiseListMemberJoined.map( promise=> promise.promiseId);

    for (let i=0; i<promiseIdList.length; i++){    
      const promise = await this.getPromiseById(promiseIdList[i])
      const promiseMembers:any =await promiseUserService.findPromiseMembers([promise]);
      const members = promiseMembers[0].members;
      await promise.$set('members',members);
    }   
  }
}

export default new PromiseService();
