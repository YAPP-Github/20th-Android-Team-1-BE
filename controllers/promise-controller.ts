import {
    JsonController,
    Res,
    Get,
    UseBefore,
    Param
} from 'routing-controllers';
import { Response } from 'express';
import promiseService from '../services/promise-service';
import PromiseModel from '../models/promise';
import { UserAuthMiddleware } from '../middlewares/auth';

@JsonController('/promises')
class PromiseController {

    @Get('/user')
    @UseBefore(UserAuthMiddleware)
    async getPromisingById(@Res() res: Response) {
        const userId = res.locals.user.id;
        const promisingResponse: Array<PromiseModel> = await promiseService.getPromiseByUser(userId);
        return res.status(200).send(promisingResponse);
    }

    @Get('/month/:month')
    @UseBefore(UserAuthMiddleware)
    async getPromiseByMonth(@Param('month') month: number, @Res() res: Response) {
        const userId = res.locals.user.id;

        const promiseResponse: Array<PromiseModel> = await promiseService.getPromiseByMonth(userId, month);
        return res.status(200).send(promiseResponse);
    }
}

export default PromiseController;
