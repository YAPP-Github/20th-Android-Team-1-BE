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

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/promisings')
class PromisingController {
  @Post('')
  @UseBefore(UserAuthMiddleware)
  async create(@Body() req: PromisingRequest, @Res() res: Response) {
    const { unit, timeTable, availDate } = req;
    const promisingReq = {
      promisingName: req.promisingName,
      minTime: req.minTime,
      maxTime: req.maxTime,
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

  @Post('/:promisingId/confirmation')
  @UseBefore(UserAuthMiddleware)
  async confirmPromising(
    @Param('promisingId') promisingId: number,
    @BodyParam('promiseDate') date: Date,
    @Res() res: Response
  ) {
    const availDates = await promisingDateService.findDatesById(promisingId);
    const promise = await promisingService.confirm(
      promisingId,
      res.locals.user,
      new Date(date),
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
}

export default PromisingController;
