import PromisingService from '../services/promising-service';
import { JsonController, Body, Post, Res, UseBefore, Get, Param } from 'routing-controllers';
import { UserAuthMiddleware } from '../middlewares/auth';
import { PromisingRequest } from '../dtos/promising/request';
import { NextFunction, Response } from 'express';
import PromisingModel from '../models/promising';

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
}

export default PromisingController;
