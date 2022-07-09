import promisingService from '../services/promising-service';
import {
  JsonController,
  Body,
  Post,
  Res,
  UseBefore,
  Get,
  Param,
  BodyParam
} from 'routing-controllers';
import { UserAuthMiddleware } from '../middlewares/auth';
import { PromisingRequest } from '../dtos/promising/request';
import { Response } from 'express';
import { TimeRequest } from '../dtos/time/request';
import { PromisingResponse } from '../dtos/promising/response';
import { EventTimeResponse } from '../dtos/event/response';
import { ValidationException } from '../utils/error';
import categoryService from '../services/category-service';
import { CategoryResponse } from '../dtos/category/response';
import promiseDateService from '../services/promise-date-service';
import { BadRequestException } from '../utils/error';
import promisingDateService from '../services/promise-date-service'

@JsonController('/promisings')
class PromisingController {
  @Post('')
  @UseBefore(UserAuthMiddleware)
  async create(@Body() req: PromisingRequest, @Res() res: Response) {
    const { unit, timeTable, availDate,...promisingInfo } = req;
    if (availDate.length>10)
      throw new BadRequestException('availDate', 'over maximum count');
    
    const promisingResponse: PromisingResponse = await promisingService.create(
      promisingInfo,
      res.locals.user
    );
    const promisingId = promisingResponse.id;

    const promisingDate = await promiseDateService.create(promisingResponse,availDate)
    const timeInfo: TimeRequest = { unit, timeTable };
    const eventTimeResponse: EventTimeResponse = await promisingService.responseTime(
      promisingId,
      res.locals.user,
      timeInfo
    );
    return res.status(200).send({ promisingResponse, eventTimeResponse, promisingDate });
  } 

  @Get('/id/:promisingsId')
  @UseBefore(UserAuthMiddleware)
  async getPromisingById(@Param('promisingsId') promisingId: number, @Res() res: Response) {
    if (!promisingId) throw new ValidationException('');
    const promisingResponse: any  = await promisingService.getPromisingInfo(promisingId);
   
    return res.status(200).send(promisingResponse);
  }

  @Get('/:promisingId/time-table')
  @UseBefore(UserAuthMiddleware)
  async getTimeTableFromPromising(@Param('promisingId') promisingId: number, @Res() res: Response) {
    const timeTable = await promisingService.getTimeTable(promisingId);
    const promisingDateResponse= await promisingDateService.findDatesById(promisingId);    
    
    const timeResponse = {timeTable, availDate:promisingDateResponse }
    return res.status(200).send(timeResponse);
  }

  @Get('/user')
  @UseBefore(UserAuthMiddleware)
  async getPromisingsByUser(@Res() res: Response) {
    const userId = res.locals.user.id;
    const promisingList = await promisingService.getPromisingByUser(userId);
    return res.status(200).send(promisingList);
  }

  @Post('/:promisingId/time-response')
  @UseBefore(UserAuthMiddleware)
  async responseTime(
    @Param('promisingId') promisingId: number,
    @Body() timeInfo: TimeRequest,
    @Res() res: Response
  ) {
    const user = res.locals.user;

    const eventTimeResponse: EventTimeResponse = await promisingService.responseTime(
      promisingId,
      user,
      timeInfo
    );
    return res.status(200).send(eventTimeResponse);
  }

  @Post('/:promisingId/confirmation')
  @UseBefore(UserAuthMiddleware)
  async confirmPromising(
    @Param('promisingId') promisingId: number,
    @BodyParam('promiseDate') date: Date,
    @Res() res: Response
  ) {
    const promise = await promisingService.confirm(promisingId, date, res.locals.user);
    return res.status(200).send(promise);
  }

  @Get('/categories')
  @UseBefore(UserAuthMiddleware)
  async getPromisingCategories(@Res() res: Response) {
    const categories = await categoryService.getAll();
    return res.status(200).send(categories.map((category) => new CategoryResponse(category)));
  }
}

export default PromisingController;
