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
import { CreatedPromisingResponse } from '../dtos/promising/response';
import { ValidationException } from '../utils/error';
import categoryService from '../services/category-service';
import { CategoryResponse } from '../dtos/category/response';
import { BadRequestException } from '../utils/error';
import timeUtil from '../utils/time';
import promisingDateService from '../services/promising-date-service';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { PromiseResponse } from '../dtos/promise/response';
import { ConfirmPromisingRequest } from '../dtos/promising/request';

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/promisings')
class PromisingController {
  @OpenAPI({
    summary: 'Create promising object',
    description: 'dateTime Format = "yyyy-MM-dd HH:mmXXX' })
  @Post('')
  @ResponseSchema(PromisingRequest)
  @UseBefore(UserAuthMiddleware)
  @ResponseSchema(CreatedPromisingResponse, { isArray: true })
  async create(@Body() req: PromisingRequest, @Res() res: Response) {
    const { unit, timeTable, availDate } = req;
    const promisingReq = {
      promisingName: req.promisingName,
      minTime: new Date(req.minTime),
      maxTime: new Date(req.maxTime),
      placeName: req.placeName,
      categoryId: req.categoryId
    };
    if (availDate.length > 10) throw new BadRequestException('availDate', 'over maximum count');

    const timeInfo: TimeRequest = { unit, timeTable };
    const response: CreatedPromisingResponse = await promisingService.create(
      promisingReq,
      res.locals.user,
      availDate,
      timeInfo
    );
    return res.status(200).send(response);
  }

  @OpenAPI({
    summary: 'Get promising List',
    description: 'get promising by promisingId'  })
  @Get('/id/:promisingsId')
  @UseBefore(UserAuthMiddleware)
  async getPromisingById(@Param('promisingsId') promisingId: number, @Res() res: Response) {
    if (!promisingId) throw new ValidationException('');
    const promisingResponse: any = await promisingService.getPromisingInfo(promisingId);
    let availDates = await promisingDateService.findDatesById(promisingId);
    const availDateList= availDates.map((date) => timeUtil.formatDate2String(date))
    
    promisingResponse.availDate = availDateList
    return res.status(200).send(promisingResponse);
  }

  @OpenAPI({
    summary: 'Get promising time-table',
    description: 'get promising time-table by promisingId'  })
  @Get('/:promisingId/time-table')
  @UseBefore(UserAuthMiddleware)
  async getTimeTableFromPromising(@Param('promisingId') promisingId: number, @Res() res: Response) {
    const timeTable = await promisingService.getTimeTable(promisingId);
    const availDates = await promisingDateService.findDatesById(promisingId);

    const timeResponse = {
      ...timeTable,
      availDates: availDates.map((date) => timeUtil.formatDate2String(date))
    };
    return res.status(200).send(timeResponse);
  }

  @OpenAPI({
    summary: 'Get promisingList',
    description: 'get promisingList by userId'  })
  @Get('/user')
  @UseBefore(UserAuthMiddleware)
  async getPromisingsByUser(@Res() res: Response) {
    const userId = res.locals.user.id;
    const promisingList = await promisingService.getPromisingByUser(userId);
    return res.status(200).send(promisingList);
  }

  @OpenAPI({
    security: [{ bearerAuth: [] }],
    summary: 'Time-response to promising',
    description: 'time-table response to promising with promisingId : tableTable>date format= "2022-07-07" times foramt = [0,0,1,1,0,0,0,1,1,0] '  })
  @Post('/:promisingId/time-response')
  @UseBefore(UserAuthMiddleware)
  async responseTime(
    @Param('promisingId') promisingId: number,
    @Body() timeInfo: TimeRequest,
    @Res() res: Response
  ) {
    const user = res.locals.user;
    const promising = await promisingService.getPromisingInfo(promisingId);
    const availDates = await promisingDateService.findDatesById(promising.id);

    const isPossibleTimeInfo = await timeUtil.checkTimeResponseList(
      timeInfo,
      promising.minTime,
      promising.maxTime,
      availDates
    );
    if (!isPossibleTimeInfo) {
      throw new BadRequestException('dateTime', 'not available or over maxTime');
    }

    await promisingService.responseTime(promising, user, timeInfo);
    return res.status(201).send();
  }

  @OpenAPI({
    summary: 'Confirm Promising to Promise',
    description: 'User have to be owner of Promising. promiseDate format is yyyy-mm-ddThh:mm:ss.'
  })
  @ResponseSchema(PromiseResponse)
  @Post('/:promisingId/confirmation')
  @UseBefore(UserAuthMiddleware)
  async confirmPromising(
    @Param('promisingId') promisingId: number,
    @Body() req: ConfirmPromisingRequest,
    @Res() res: Response
  ) {
    const dateTime = new Date(req.promiseDate);
    if (!(dateTime instanceof Date && !isNaN(dateTime.valueOf())))
      throw new BadRequestException('dateTime', 'Not valid date');
    const availDates = await promisingDateService.findDatesById(promisingId);
    const promise = await promisingService.confirm(
      promisingId,
      res.locals.user,
      dateTime,
      availDates
    );
    return res.status(200).send(promise);
  }

  @OpenAPI({
    summary: 'Get categoryList'  })
  @Get('/categories')
 @UseBefore(UserAuthMiddleware)
  async getPromisingCategories(@Res() res: Response) {
    const categories = await categoryService.getAll();
    return res.status(200).send(categories.map((category) => new CategoryResponse(category)));
  }
}

export default PromisingController;
