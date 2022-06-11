import PromisingModel from "../models/promising";
import CategoryKeyword from "../models/category-keyword";
import UtilService from "./util-service";

const PromisingService = {
    async create(promisingInfo: any) {
        try {
            const promising = new PromisingModel(promisingInfo);
            await promising.save()

            const category = await CategoryKeyword.findOne({ where: { id: promisingInfo.categoryId } })
            promisingInfo.category = category;
            promisingInfo = await UtilService.deleteJsonKey(promisingInfo, 'categoryId')

            return promisingInfo;
        } catch (err: any) {
            console.log(err)
            return err
        }
    },
};

export default PromisingService;


