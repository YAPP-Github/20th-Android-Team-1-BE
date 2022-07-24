import { JsonController, Res, Get, UseBefore, Param } from 'routing-controllers';
import { Response } from 'express';
import promiseService from '../services/promise-service';
import { UserAuthMiddleware } from '../middlewares/auth';
import { BadRequestException } from '../utils/error';
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
        new PromiseResponse(
          promise,
          promise.owner,
          promise.category,
          promise.members,
          userId == promise.owner.id
        )
    );
    return res.status(200).send(response);
  }

  @OpenAPI({
    summary: "Get User's Promise List By Month",
    description: 'dateTime format is yyyy-mm or yyyy-mm-dd (date ignored)'
  })
  @ResponseSchema(PromiseResponse, { isArray: true })
  @Get('/month/:dateTime')
  @UseBefore(UserAuthMiddleware)
  async getPromiseByMonth(@Param('dateTime') dateStr: string, @Res() res: Response) {
    const dateTime = timeUtil.string2Date(dateStr);
    if (!(dateTime instanceof Date && !isNaN(dateTime.valueOf())))
      throw new BadRequestException('dateTime', 'Invalid date');
    const userId = res.locals.user.id;

    const promises = await promiseService.getPromisesByMonth(userId, dateTime);
    const response = promises.map(
      (promise: PromiseModel) =>
        new PromiseResponse(
          promise,
          promise.owner,
          promise.category,
          promise.members,
          userId == promise.owner.id
        )
    );
    return res.status(200).send(response);
  }

  @OpenAPI({
    summary: "Get User's Promise List By Date",
    description: 'dateTime format is yyyy-mm-dd or yyyy-mm (default date is 1)'
  })
  @ResponseSchema(PromiseResponse, { isArray: true })
  @Get('/date/:dateTime')
  @UseBefore(UserAuthMiddleware)
  async getPromisesByDate(@Param('dateTime') dateStr: string, @Res() res: Response) {
    const dateTime = timeUtil.string2Date(dateStr);
    if (!(dateTime instanceof Date && !isNaN(dateTime.valueOf())))
      throw new BadRequestException('dateTime', 'Invalid date');
    const userId = res.locals.user.id;

    const promises = await promiseService.getPromisesByDate(userId, dateTime);
    const response = promises.map(
      (promise: PromiseModel) =>
        new PromiseResponse(
          promise,
          promise.owner,
          promise.category,
          promise.members,
          userId == promise.owner.id
        )
    );
    return res.status(200).send(response);
  }

  @OpenAPI({ summary: 'Get Promise information By promiseId' })
  @ResponseSchema(PromiseResponse)
  @Get('/:promiseId')
  @UseBefore(UserAuthMiddleware)
  async getPromiseById(@Param('promiseId') promiseId: number, @Res() res: Response) {
    const userId = res.locals.user.id;
    const promise = await promiseService.getPromiseById(promiseId);

    const response = new PromiseResponse(
      promise,
      promise.owner,
      promise.category,
      promise.members,
      userId == promise.owner.id
    );

    return res.status(200).send(response);
  }
}

export default PromiseController;
