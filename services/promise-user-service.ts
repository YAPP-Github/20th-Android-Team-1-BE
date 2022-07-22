import { Op } from 'sequelize';
import PromiseModel from '../models/promise';
import PromiseUser from '../models/promise-user';
import User from '../models/user';

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
    const updatedListMemeberJoined = await PromiseUser.update({userId:100000}, {where: {userId:userId}})
    return updatedListMemeberJoined;
  }
}

export default new PromiseUserService();
