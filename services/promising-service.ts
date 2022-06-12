import PromisingModel from "../models/promising";
import CategoryKeyword from "../models/category-keyword";
import arrayUtil from "../utils/array";
import { NotFoundError, InternalServerError } from "routing-controllers";
import User from "../models/user";

class PromisingService {
    async create(promisingInfo: any) {
        try {
            const category = await CategoryKeyword.findOne({ where: { id: promisingInfo.categoryId } })
            const user = await User.findOne({ where: { id: promisingInfo.ownerId } })
            if (!user) return new NotFoundError('User Not Found')
            if (!category) return new NotFoundError('CategoryKeyword Not Found')
            promisingInfo.category = category;
            promisingInfo = await arrayUtil.deleteJsonKey(promisingInfo, 'categoryId')

            const promising = new PromisingModel(promisingInfo);
            await promising.save()

            return promisingInfo;
        } catch (err: any) {
            console.log(err)
            return new InternalServerError('Internal Server Error')
        }
    },
};

export default new PromisingService();


