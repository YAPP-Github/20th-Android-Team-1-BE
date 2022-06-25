import PromisingService from '../services/promising-service';
import { JsonController, Body, Post, Res, UseBefore, Get, Param } from 'routing-controllers';
import { UserAuthMiddleware } from '../middlewares/auth';
import PromisingRequest from '../dtos/promising/request';
import { NextFunction, Response } from 'express';
import PromisingModel from '../models/promising';
import TimeRequest from '../dtos/time/request';

@JsonController()
class PromisingController {
  @Post('/promisings')
  @UseBefore(UserAuthMiddleware)
  async create(@Body() req: PromisingRequest, @Res() res: Response, next: NextFunction) {
    try {
      const promisingResponse: PromisingModel | any = await PromisingService.create(req);
      return res.status(200).send(promisingResponse);
    } catch (err: any) {
      next(err);
    }
  }

  @Get('/promisings/:promisingId')
  @UseBefore(UserAuthMiddleware)
  async getPromisingInfo(@Param('promisingId') promisingId: number, @Res() res: Response, next: NextFunction) {
    try {
      const promisingResponse: PromisingModel | any = await PromisingService.getPromisingInfo(promisingId);
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
      const eventTimeResponse: PromisingModel | any = await PromisingService.responseTime(promisingId, userId, timeInfo);
      return res.status(200).send(eventTimeResponse);
    } catch (err: any) {
      next(err);
    }
  }

}

export default PromisingController;
