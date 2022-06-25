import PromisingService from '../services/promising-service';
import { JsonController, Body, Post, Res, UseBefore, Param, BodyParam } from 'routing-controllers';
import { UserAuthMiddleware } from '../middlewares/auth';
import { PromisingRequest } from '../dtos/promising/request';
import { Response } from 'express';
import PromisingModel from '../models/promising';
import promisingService from '../services/promising-service';
import { PromiseReponse } from '../dtos/promise/response';

@JsonController('/promisings')
class PromisingController {
  @Post('')
  @UseBefore(UserAuthMiddleware)
  async createPromising(@Body() req: PromisingRequest, @Res() res: Response) {
    const promisingResponse: PromisingModel | any = await PromisingService.create(req);
    return res.status(200).send(promisingResponse);
  }

  @Post('/:promisingId/confirmation')
  @UseBefore(UserAuthMiddleware)
  async confirmPromising(
    @Param('promisingId') promisingId: number,
    @BodyParam('promiseDate') date: Date,
    @Res() res: Response
  ) {
    const promise = await promisingService.confirm(promisingId, date, res.locals.user);
    return new PromiseReponse(promise);
  }
}

export default PromisingController;
