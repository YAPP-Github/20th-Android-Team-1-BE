import { Op } from 'sequelize';
import PromiseModel from '../models/promise';
import PromiseUser from '../models/promise-user';
import User from '../models/user';
import unknownUserId from '../constants/nums';

class PromiseUserService {
  async findPromiseMembers(promises: PromiseModel[]) {
    for (let i = 0; i < promises.length; i++) {
      const members = await PromiseUser.findAll({
        where: { promiseId: promises[i].id },
        raw: true
      });

      const memberList: User[] = await User.findAll({
        where: { id: { [Op.in]: members.map((members) => members.userId) } },
        raw: true
      });
      promises[i].members = memberList;
    }
    return promises;
  }
  
  async updateResignMember(userId:number){
    const promiseUsers = await PromiseUser.findAll({
      where: {
        userId: userId
      }
    });
    if(!promiseUsers) return;
    await PromiseUser.update({userId:unknownUserId}, {where: {userId:userId}})
  }
}

export default new PromiseUserService();
