import { Op } from 'sequelize';
import PromiseUser from '../models/promise-user';
import User from '../models/user';

class PromiseUserService {
  async findPromiseMembers(promises: any) {
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
}

export default new PromiseUserService();
