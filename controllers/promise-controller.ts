import {
    JsonController,
    Res,
    Get,
    UseBefore,
    BodyParam
} from 'routing-controllers';
import { Response } from 'express';
import promiseService from '../services/promise-service';
import PromiseModel from '../models/promise';
import { UserAuthMiddleware } from '../middlewares/auth';
import { ValidationException } from '../utils/error';

@JsonController('/promises')
class PromiseController {

    @Get('/user')
    @UseBefore(UserAuthMiddleware)
    async getPromisingById(@Res() res: Response) {
        const userId = res.locals.user.id;
        const promisingResponse: Array<PromiseModel> = await promiseService.getPromiseByUser(userId);
        return res.status(200).send(promisingResponse);
    }

    @Get('/month')
    @UseBefore(UserAuthMiddleware)
    async getPromiseByMonth(@BodyParam('dateTime') dateTime: Date, @Res() res: Response) {
        if (!dateTime) throw new ValidationException('dateTime');
        const userId = res.locals.user.id;

        const promiseResponse: Array<PromiseModel> = await promiseService.getPromiseByMonth(userId, dateTime);
        return res.status(200).send(promiseResponse);
    }

    @Get('/date')
    @UseBefore(UserAuthMiddleware)
    async getPromisesByDate(@BodyParam('dateTime') dateTime: Date, @Res() res: Response) {
        if (!dateTime) throw new ValidationException('dateTime');
        const userId = res.locals.user.id;

        const promiseResponse: Array<PromiseModel> = await promiseService.getPromisesByDate(userId, dateTime);
        return res.status(200).send(promiseResponse);
    }
}

export default PromiseController;
