import { JsonController, Res, Get, UseBefore, Param } from 'routing-controllers';
import { Response } from 'express';
import promiseService from '../services/promise-service';
import { UserAuthMiddleware } from '../middlewares/auth';
import { BadRequestException, ValidationException } from '../utils/error';
import { PromiseResponse } from '../dtos/promise/response';
import PromiseModel from '../models/promise';
import timeUtil from '../utils/time';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/promises')
class PromiseController {
  @OpenAPI({ summary: "Get User's Promise List" })
  @ResponseSchema(PromiseResponse, { isArray: true })
  @Get('/user')
  @UseBefore(UserAuthMiddleware)
  async getPromisesByUser(@Res() res: Response) {
    const userId = res.locals.user.id;

    const promises = await promiseService.getPromisesByUser(userId);
    const response = promises.map(
      (promise: PromiseModel) =>
        new PromiseResponse(promise, promise.owner, promise.category, promise.members)
    );
    return res.status(200).send(response);
  }
  @OpenAPI({ summary: "Get User's Promise List By Month (yyyy-mm / yyyy-mm-dd Date ignored)" })
  @ResponseSchema(PromiseResponse, { isArray: true })
  @Get('/month/:dateTime')
  @UseBefore(UserAuthMiddleware)
  async getPromiseByMonth(@Param('dateTime') dateStr: string, @Res() res: Response) {
    if (!dateStr) throw new ValidationException('dateTime');
    const dateTime = timeUtil.string2Date(dateStr);
    if (!(dateTime instanceof Date && !isNaN(dateTime.valueOf())))
      throw new BadRequestException('dateTime', 'Not valid date');
    const userId = res.locals.user.id;

    const promises = await promiseService.getPromisesByMonth(userId, dateTime);
    const response = promises.map(
      (promise: PromiseModel) =>
        new PromiseResponse(promise, promise.owner, promise.category, promise.members)
    );
    return res.status(200).send(response);
  }
  @OpenAPI({ summary: "Get User's Promise List By Date (yyyy-mm(-01) / yyyy-mm-dd )" })
  @ResponseSchema(PromiseResponse, { isArray: true })
  @Get('/date/:dateTime')
  @UseBefore(UserAuthMiddleware)
  async getPromisesByDate(@Param('dateTime') dateStr: string, @Res() res: Response) {
    if (!dateStr) throw new ValidationException('dateTime');
    const dateTime = timeUtil.string2Date(dateStr);
    if (!(dateTime instanceof Date && !isNaN(dateTime.valueOf())))
      throw new BadRequestException('dateTime', 'Not valid date');
    const userId = res.locals.user.id;

    const promises = await promiseService.getPromisesByDate(userId, dateTime);
    const response = promises.map(
      (promise: PromiseModel) =>
        new PromiseResponse(promise, promise.owner, promise.category, promise.members)
    );
    return res.status(200).send(response);
  }
}

export default PromiseController;
