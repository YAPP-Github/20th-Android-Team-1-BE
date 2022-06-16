import PromisingModel from "../models/promising";
import CategoryKeyword from "../models/category-keyword";
import { NotFoundError, InternalServerError } from "routing-controllers";
import User from "../models/user";
import { PromisingRequest } from "../dtos/promising/request";

class PromisingService {
    async create(promisingInfo: PromisingRequest) {
        try {
            const category = await CategoryKeyword.findOne({ where: { id: promisingInfo.categoryId } })
            const user = await User.findOne({ where: { id: promisingInfo.ownerId } })

            if (!user) return new NotFoundError('User Not Found')
            if (!category) return new NotFoundError('CategoryKeyword Not Found')

            const promising = new PromisingModel(promisingInfo);

            return await promising.save();
        } catch (err: any) {
            console.log(err)
            return new InternalServerError('Internal Server Error')
        }
    }
}

export default new PromisingService();


