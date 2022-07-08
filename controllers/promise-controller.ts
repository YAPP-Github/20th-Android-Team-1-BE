import { JsonController, Res, Get, UseBefore, BodyParam } from 'routing-controllers';
import { Response } from 'express';
import promiseService from '../services/promise-service';
import { UserAuthMiddleware } from '../middlewares/auth';
import { ValidationException } from '../utils/error';
import { PromiseResponse } from '../dtos/promise/response';
import PromiseModel from '../models/promise';

@JsonController('/promises')
class PromiseController {
  @Get('/user')
  @UseBefore(UserAuthMiddleware)
  async getPromisesById(@Res() res: Response) {
    const userId = res.locals.user.id;

    const promises = await promiseService.getPromisesByUser(userId);
    const response = promises.map(
      (promise: PromiseModel) =>
        new PromiseResponse(promise, promise.owner, promise.category, promise.members)
    );
    return res.status(200).send(response);
  }

  @Get('/month')
  @UseBefore(UserAuthMiddleware)
  async getPromiseByMonth(@BodyParam('dateTime') dateTime: Date, @Res() res: Response) {
    if (!dateTime) throw new ValidationException('dateTime');
    const userId = res.locals.user.id;

    const promises = await promiseService.getPromisesByMonth(userId, dateTime);
    const response = promises.map(
      (promise) => new PromiseResponse(promise, promise.owner, promise.category, promise.members)
    );
    return res.status(200).send(response);
  }

  @Get('/date')
  @UseBefore(UserAuthMiddleware)
  async getPromisesByDate(@BodyParam('dateTime') dateTime: Date, @Res() res: Response) {
    if (!dateTime) throw new ValidationException('dateTime');
    const userId = res.locals.user.id;

    const promises = await promiseService.getPromisesByDate(userId, dateTime);
    const response = promises.map(
      (promise) => new PromiseResponse(promise, promise.owner, promise.category, promise.members)
    );
    return res.status(200).send(response);
  }
}

export default PromiseController;
