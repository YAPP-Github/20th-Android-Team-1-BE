import { Op } from 'sequelize';
import PromiseUser from '../models/promise-user';
import User from '../models/user';

class PromiseUserService {
    async findPromiseMembers(promises: any,userId:number) {
        const promisingList:any =[]
        
        for(let i=0;i< promises.length;i++){
            let members = await PromiseUser.findAll({
                where : { promiseId:promises[i].id},
                raw: true,})
            const templist= members.map((members)=>members.userId)

            let memberList:any = await User.findAll({
                where: { id: {[Op.in]: templist}},
                raw:true
            })
            promises[i].members = memberList;
            }
        return promises
    }
}

export default new PromiseUserService();
