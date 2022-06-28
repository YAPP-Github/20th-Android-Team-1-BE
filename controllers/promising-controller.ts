import PromisingService from '../services/promising-service';
import { JsonController, Body, Post, Res, UseBefore, Get, Param } from 'routing-controllers';
import { UserAuthMiddleware } from '../middlewares/auth';
import { PromisingRequest } from '../dtos/promising/request';
import { NextFunction, Response } from 'express';
import PromisingModel from '../models/promising';
import { TimeRequest } from '../dtos/time/request';
import { PromisingResponse } from '../dtos/promising/response';
import { EventTimeResponse } from '../dtos/event/response';
import { ValidationException } from '../utils/error';

@JsonController()
class PromisingController {
  @Post('/promisings')
  @UseBefore(UserAuthMiddleware)
  async create(@Body() req: PromisingRequest, @Res() res: Response, next: NextFunction) {
    try {
      const { unit, timeTable, ...promisingInfo } = req;
      const userId = res.locals.user.id;

      const promisingResponse: PromisingResponse = await PromisingService.create(promisingInfo);
      const promisingId = promisingResponse.id;

      const timeInfo: TimeRequest = { unit, timeTable }
      const eventTimeResponse: EventTimeResponse = await PromisingService.responseTime(promisingId, userId, timeInfo);

      return res.status(200).send({ promisingResponse, eventTimeResponse });
    } catch (err: any) {
      next(err);
    }
  }

  @Get('/promisings/:promisingId')
  @UseBefore(UserAuthMiddleware)
  async getPromisingById(@Param('promisingId') promisingId: number, @Res() res: Response, next: NextFunction) {
    try {
      if (!promisingId) throw new ValidationException('promisingId');
      const promisingResponse: PromisingModel = await PromisingService.getPromisingById(promisingId);
      return res.status(200).send(promisingResponse);
    } catch (err: any) {
      next(err);
    }
  }

  @Post('/promisings/:promisingId/time-response')
  @UseBefore(UserAuthMiddleware)
  async responseTime(@Param('promisingId') promisingId: number, @Body() timeInfo: TimeRequest, @Res() res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.id;
      const eventTimeResponse: EventTimeResponse = await PromisingService.responseTime(promisingId, userId, timeInfo);
      return res.status(200).send(eventTimeResponse);
    } catch (err: any) {
      next(err);
    }
  }

}

export default PromisingController;
