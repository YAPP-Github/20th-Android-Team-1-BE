import promisingService from '../services/promising-service';
import { JsonController, Body, Post, Res, UseBefore, Get, Param } from 'routing-controllers';
import { UserAuthMiddleware } from '../middlewares/auth';
import { ConfirmPromisingRequest, PromisingRequest } from '../dtos/promising/request';
import { Response } from 'express';
import { TimeRequest } from '../dtos/time/request';
import { CreatedPromisingResponse } from '../dtos/promising/response';
import { ValidationException } from '../utils/error';
import categoryService from '../services/category-service';
import { CategoryResponse, RandomNameResponse } from '../dtos/category/response';
import { BadRequestException } from '../utils/error';
import timeUtil from '../utils/time';
import promisingDateService from '../services/promising-date-service';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { PromiseResponse } from '../dtos/promise/response';
import randomName from '../constants/category-name.json';

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/promisings')
class PromisingController {
  @Post('')
  @UseBefore(UserAuthMiddleware)
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

  @Get('/id/:promisingsId')
  @UseBefore(UserAuthMiddleware)
  async getPromisingById(@Param('promisingsId') promisingId: number, @Res() res: Response) {
    if (!promisingId) throw new ValidationException('');
    const promisingResponse: any = await promisingService.getPromisingInfo(promisingId);
    const availDates = await promisingDateService.findDatesById(promisingId);

    return res.status(200).send({
      ...promisingResponse,
      availDates: availDates.map((date) => timeUtil.formatDate2String(date))
    });
  }

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

  @Get('/categories')
  @UseBefore(UserAuthMiddleware)
  async getPromisingCategories(@Res() res: Response) {
    const categories = await categoryService.getAll();
    return res.status(200).send(categories.map((category) => new CategoryResponse(category)));
  }

  @OpenAPI({
    summary: 'Get random Promising name by categoryId',
    description: 'Category by categoryId must exist.'
  })
  @ResponseSchema(RandomNameResponse)
  @Get('/categories/:categoryId/name')
  @UseBefore(UserAuthMiddleware)
  async getPromisingRandomNameByCategory(
    @Param('categoryId') categoryId: number,
    @Res() res: Response
  ) {
    const category = await categoryService.getOneById(categoryId);
    const names = randomName[category.id];
    if (!names)
      throw new BadRequestException(
        'categoryId',
        'random names with requested categoryId not found'
      );

    const randomIdx = Math.floor(Math.random() * names.length);
    return res.status(200).send(new RandomNameResponse(randomName[category.id][randomIdx]));
  }
}

export default PromisingController;
