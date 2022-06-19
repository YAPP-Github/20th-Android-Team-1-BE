import PromisingModel from "../models/promising";
import CategoryKeyword from "../models/category-keyword";
import { PromisingRequest } from "../dtos/promising/request";
import { httpException, notFoundException } from "../utils/error";
import User from "../models/user";

class PromisingService {
    async create(promisingInfo: PromisingRequest) {
        try {
            const categoryId = promisingInfo.categoryId, ownerId = promisingInfo.ownerId;
            const category = await CategoryKeyword.findOne({ where: { id: categoryId } })
            const user = await User.findOne({ where: { id: ownerId } })

            if (!user) throw new notFoundException('User', ownerId)
            if (!category) throw new notFoundException('CategoryKeyword', categoryId)

            const promising = new PromisingModel(promisingInfo);

            return await promising.save();
        } catch (err: any) {
            if (!err.status || err.status != 500)
                throw new httpException('internal Server error', 500)
        }
    }
}

export default new PromisingService();


