import promisingService from '../services/promising-service';
import { JsonController, Body, Post, Res, UseBefore, Get, Param } from 'routing-controllers';
import { UserAuthMiddleware } from '../middlewares/auth';
import { PromisingRequest } from '../dtos/promising/request';
import { Response } from 'express';
import { TimeRequest } from '../dtos/time/request';
import { PromisingResponse, PromisingTimeTableResponse } from '../dtos/promising/response';
import { ValidationException } from '../utils/error';
import categoryService from '../services/category-service';
import { CategoryResponse, RandomNameResponse } from '../dtos/category/response';
import { BadRequestException } from '../utils/error';
import timeUtil from '../utils/time';
import promisingDateService from '../services/promising-date-service';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { PromiseResponse } from '../dtos/promise/response';
import randomName from '../constants/category-name.json';
import { ConfirmPromisingRequest } from '../dtos/promising/request';
import eventService from '../services/event-service';

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/promisings')
class PromisingController {
  @OpenAPI({
    summary: 'Create promising object',
    description: 'Date format = "yyyy-mm-ddThh:mm:ss'
  })
  @ResponseSchema(PromisingResponse)
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
    const response = await promisingService.create(
      promisingReq,
      res.locals.user,
      availDate,
      timeInfo
    );
    return res.status(200).send(response);
  }

  @OpenAPI({ summary: 'Get promising by promisingId' })
  @ResponseSchema(PromisingResponse)
  @Get('/id/:promisingsId')
  @UseBefore(UserAuthMiddleware)
  async getPromisingById(@Param('promisingsId') promisingId: number, @Res() res: Response) {
    if (!promisingId) throw new ValidationException('');
    const promising = await promisingService.getPromisingInfo(promisingId);
    const availDates = await promisingDateService.findDatesById(promisingId);

    const response = new PromisingResponse(promising, promising.ownCategory, availDates);
    return res.status(200).send(response);
  }

  @OpenAPI({ summary: 'Get promising time-table' })
  @Get('/:promisingId/time-table')
  @ResponseSchema(PromisingTimeTableResponse)
  @UseBefore(UserAuthMiddleware)
  async getTimeTableFromPromising(@Param('promisingId') promisingId: number, @Res() res: Response) {
    const promising = await promisingService.getPromisingInfo(promisingId);
    const { users, colors, totalCount, unit, timeTable } = await promisingService.getTimeTable(
      promisingId
    );
    const availDates = await promisingDateService.findDatesById(promisingId);

    const response = new PromisingTimeTableResponse(
      promising,
      availDates,
      users,
      colors,
      totalCount,
      unit,
      timeTable
    );
    return res.status(200).send(response);
  }

  @OpenAPI({ summary: "Get User's Promising list By User" })
  @ResponseSchema(PromisingResponse, { isArray: true })
  @Get('/user')
  @UseBefore(UserAuthMiddleware)
  async getPromisingsByUser(@Res() res: Response) {
    const userId = res.locals.user.id;
    const response = await promisingService.getPromisingByUser(userId);
    return res.status(200).send(response);
  }

  @OpenAPI({ summary: 'Reject Promising', description: 'User must not be owner of Promising' })
  @Post('/:promisingId/time-response/rejection')
  @UseBefore(UserAuthMiddleware)
  async rejectPromising(@Param('promisingId') promisingId: number, @Res() res: Response) {
    const user = res.locals.user;
    const promising = await promisingService.getPromisingInfo(promisingId);
    await eventService.create(promising, user, true);
    return res.status(200).send();
  }

  @OpenAPI({
    summary: 'Time-response to promising',
    description:
      "Size of times array = (Promising's maxTime - Promising's minTime)/unit. Excesss is ignored. "
  })
  @Post('/:promisingId/time-response')
  @UseBefore(UserAuthMiddleware)
  async responseTime(
    @Param('promisingId') promisingId: number,
    @Body() timeInfo: TimeRequest,
    @Res() res: Response
  ) {
    const user = res.locals.user;
    const promising = await promisingService.getPromisingDateInfo(promisingId);
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
    return res.status(200).send();
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

  @OpenAPI({ summary: "Get Promising's Category list." })
  @Get('/categories')
  @UseBefore(UserAuthMiddleware)
  @ResponseSchema(CategoryResponse, { isArray: true })
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
