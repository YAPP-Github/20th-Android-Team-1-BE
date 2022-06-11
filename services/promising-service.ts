import PromisingModel from "../models/promising";
import CategoryKeyword from "../models/category-keyword";
import UtilService from "./util-service";
import { Request, Response } from 'express'
import { BadRequestError, NotFoundError, InternalServerError } from "routing-controllers";
import User from "../models/user";

const PromisingService = {
    async create(req: Request, res: Response) {
        try {
            const requireList = ['promisingName', 'ownerId', 'categoryId', 'minTime', 'maxTime'];
            let promisingInfo = req.body;

            const isValid = UtilService.paramValidation(promisingInfo, requireList)
            if (!isValid) return new BadRequestError('invalid param')

            const promising = new PromisingModel(promisingInfo);
            await promising.save()

            const category = await CategoryKeyword.findOne({ where: { id: promisingInfo.categoryId } })
            const user = await User.findOne({ where: { id: promisingInfo.ownerId } })
            if (!user) return new NotFoundError('User Not Found')
            if (!category) return new NotFoundError('CategoryKeyword Not Found')
            promisingInfo.category = category;
            promisingInfo = await UtilService.deleteJsonKey(promisingInfo, 'categoryId')

            return promisingInfo;
        } catch (err: any) {
            console.log(err)
            return new InternalServerError('Internal Server Error')
        }
    },
};

export default PromisingService;


