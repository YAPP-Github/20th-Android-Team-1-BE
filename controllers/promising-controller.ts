import promisingService from '../services/promising-service';
import { JsonController, Body, Post, Res, UseBefore, Get, Param } from 'routing-controllers';
import { UserAuthMiddleware } from '../middlewares/auth';
import { PromisingRequest, PromisingSession } from '../dtos/promising/request';
import { Response } from 'express';
import { TimeRequest } from '../dtos/time/request';
import {
  CreatedPromisingResponse,
  PromisingSessionResponse,
  PromisingTimeStampResponse,
  PromisingTimeTableResponse,
  SessionResponse
} from '../dtos/promising/response';
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
import stringUtill from '../utils/string';

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/promisings')
class PromisingController {
  @OpenAPI({
    summary: 'Temporarily save Promising (disappears after 5 minutes)',
    description: 'Date format = "yyyy-mm-ddThh:mm:ss'
  })
  @ResponseSchema(SessionResponse)
  @Post('')
  @UseBefore(UserAuthMiddleware)
  async create(@Body() req: PromisingRequest, @Res() res: Response) {
    const promisingSession = new PromisingSession(
      req.promisingName,
      req.minTime,
      req.maxTime,
      req.categoryId,
      res.locals.user.id,
      req.availableDates,
      req.placeName
    );
    if (req.availableDates.length > 10)
      throw new BadRequestException('availDate', 'over maximum count');

    const uuid = await promisingService.saveSession(promisingSession);
    const response = new SessionResponse(uuid);
    return res.status(200).send(response);
  }

  @OpenAPI({
    summary: 'Get Promising Session (Pre-saved Promising Info)',
    description: 'uuid = UUID v4 format'
  })
  @ResponseSchema(PromisingSessionResponse)
  @Get('/session/:uuid')
  @UseBefore(UserAuthMiddleware)
  async getPromisingSession(@Param('uuid') uuid: string, @Res() res: Response) {
    if (!stringUtill.isUUIDV4(uuid)) throw new BadRequestException('uuid', 'is not UUID v4 format');

    const response = await promisingService.getPromisingSession(uuid);

    return res.status(200).send(response);
  }

  @OpenAPI({
    summary: 'Time-response to Promising Session (Promising Created)',
    description: 'Request User has to be owner of Promising Session (Pre-saved Promising)'
  })
  @ResponseSchema(CreatedPromisingResponse)
  @Post('/session/:uuid/time-response')
  @UseBefore(UserAuthMiddleware)
  async createAndResponsePromising(
    @Param('uuid') uuid: string,
    @Body() timeReq: TimeRequest,
    @Res() res: Response
  ) {
    if (!stringUtill.isUUIDV4(uuid)) throw new BadRequestException('uuid', 'is not UUID v4 format');

    const user = res.locals.user;
    const session = await promisingService.getSession(uuid);

    const isPossibleTimeInfo = await timeUtil.checkTimeResponseList(
      timeReq,
      new Date(session.minTime),
      new Date(session.maxTime),
      session.availableDates
    );
    if (!isPossibleTimeInfo) {
      throw new BadRequestException('dateTime', 'not available or over maxTime');
    }

    const promising = await promisingService.create(session, user);
    await promisingService.responseTime(promising, user, timeReq);
    await promisingService.deleteSession(uuid);
    return res.status(200).send(new CreatedPromisingResponse(promising.id));
  }

  @OpenAPI({
    summary: 'Time-response to Promising',
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

  @OpenAPI({ summary: 'Reject Promising', description: 'User must not be owner of Promising' })
  @Post('/:promisingId/time-response/rejection')
  @UseBefore(UserAuthMiddleware)
  async rejectPromising(@Param('promisingId') promisingId: number, @Res() res: Response) {
    const user = res.locals.user;
    const promising = await promisingService.getPromisingInfo(promisingId);
    await eventService.create(promising, user, true);
    await promisingService.updateTimeStamp(promising);
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

  @OpenAPI({ summary: 'Get promising by promisingId' })
  @ResponseSchema(PromisingTimeStampResponse)
  @Get('/id/:promisingsId')
  @UseBefore(UserAuthMiddleware)
  async getPromisingById(@Param('promisingsId') promisingId: number, @Res() res: Response) {
    if (!promisingId) throw new ValidationException('');
    const promising = await promisingService.getPromisingInfo(promisingId);
    const availDates = await promisingDateService.findDatesById(promisingId);
    const members = await eventService.findPromisingMembers(promising.id);
    const response = new PromisingTimeStampResponse(
      promising,
      promising.ownCategory,
      availDates,
      members,
      res.locals.user
    );
    return res.status(200).send(response);
  }

  @OpenAPI({
    summary: 'Get promising time-table',
    description:
      'members = 응답한 모든 사용자 배열 (불참 포함), colors = 인원수별 블록 컬러값 (0~ 최대) </p> <p> unit = 한 시간 기준 블록의 크기 ( unit = 0.5, block 당 30분), totalCount = 전체 minTime ~ maxTime 사이 시간 (13:00 ~ 15:00 totalCount = 2)'
  })
  @Get('/:promisingId/time-table')
  @ResponseSchema(PromisingTimeTableResponse)
  @UseBefore(UserAuthMiddleware)
  async getTimeTableFromPromising(@Param('promisingId') promisingId: number, @Res() res: Response) {
    const promising = await promisingService.getPromisingInfo(promisingId);
    const { colors, totalCount, unit, timeTable } = await promisingService.getTimeTable(
      promisingId
    );
    const availDates = await promisingDateService.findDatesById(promisingId);

    const members = await eventService.findPromisingMembers(promising.id);
    const response = new PromisingTimeTableResponse(
      promising,
      availDates,
      members,
      colors,
      totalCount,
      unit,
      timeTable
    );
    return res.status(200).send(response);
  }

  @OpenAPI({ summary: "Get User's Promising list By User" })
  @ResponseSchema(PromisingTimeStampResponse, { isArray: true })
  @Get('/user')
  @UseBefore(UserAuthMiddleware)
  async getPromisingsByUser(@Res() res: Response) {
    const response = await promisingService.getPromisingByUser(res.locals.user);
    return res.status(200).send(response);
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
