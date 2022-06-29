import promisingService from '../services/promising-service';
import { JsonController, Body, Post, Res, UseBefore, Get, Param } from 'routing-controllers';
import { UserAuthMiddleware } from '../middlewares/auth';
import { PromisingRequest } from '../dtos/promising/request';
import { Response } from 'express';
import PromisingModel from '../models/promising';
import { TimeRequest } from '../dtos/time/request';
import { PromisingResponse } from '../dtos/promising/response';
import { EventTimeResponse } from '../dtos/event/response';
import { ValidationException } from '../utils/error';

@JsonController('/promisings')
class PromisingController {
  @Post('')
  @UseBefore(UserAuthMiddleware)
  async create(@Body() req: PromisingRequest, @Res() res: Response) {
    const { unit, timeTable, ...promisingInfo } = req;
    const userId = res.locals.user.id;

    const promisingResponse: PromisingResponse = await promisingService.create(promisingInfo);
    const promisingId = promisingResponse.id;

    const timeInfo: TimeRequest = { unit, timeTable };
    const eventTimeResponse: EventTimeResponse = await promisingService.responseTime(
      promisingId,
      userId,
      timeInfo
    );

    return res.status(200).send({ promisingResponse, eventTimeResponse });
  }

  @Get('/promisings/id/:promisingsId')
  @UseBefore(UserAuthMiddleware)
  async getPromisingById(@Param('promisingId') promisingId: number, @Res() res: Response) {
    if (!promisingId) throw new ValidationException('promisingId');
    const promisingResponse: PromisingModel = await promisingService.getPromisingInfo(promisingId);
    return res.status(200).send(promisingResponse);
  }

  @Get('/:promisingId/time-table')
  @UseBefore(UserAuthMiddleware)
  async getTimeTableFromPromising(@Param('promisingId') promisingId: number, @Res() res: Response) {
    const timeTable = await promisingService.getTimeTable(promisingId);
    return res.status(200).send(timeTable);
  }

  @Get('/promisings/user')
  @UseBefore(UserAuthMiddleware)
  async getPromisingsByUser(@Res() res: Response) {
    const userId = res.locals.user.id;
    const promisingList = await promisingService.getPromisingByUser(userId);
    return res.status(200).send(promisingList);
  }

  @Post('/promisings/:promisingId/time-response')
  @UseBefore(UserAuthMiddleware)
  async responseTime(
    @Param('promisingId') promisingId: number,
    @Body() timeInfo: TimeRequest,
    @Res() res: Response
  ) {
    const userId = res.locals.user.id;
    const eventTimeResponse: EventTimeResponse = await promisingService.responseTime(
      promisingId,
      userId,
      timeInfo
    );
    return res.status(200).send(eventTimeResponse);
  }
}

export default PromisingController;
