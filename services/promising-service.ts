import { PromisingInfo } from '../dtos/promising/request';
import { BadRequestException, NotFoundException, UnAuthorizedException } from '../utils/error';
import {
  CreatedPromisingResponse,
  TimeTableDate,
  TimeTableResponse,
  TimeTableUnit
} from '../dtos/promising/response';
import { PromiseResponse } from '../dtos/promise/response';
import { TimeRequest } from '../dtos/time/request';
import PromisingModel from '../models/promising';
import CategoryKeyword from '../models/category-keyword';
import User from '../models/user';
import eventService from './event-service';
import promiseService from './promise-service';
import EventModel from '../models/event';
import TimeModel from '../models/time';
import timeUtil from '../utils/time';
import color from '../constants/color.json';
import index from '../constants/color-index.json';
import { UserResponse } from '../dtos/user/response';
import timeService from './time-service';
import PromisingDateModel from '../models/promising-date';
import promisingDateService from './promising-date-service';

interface ColorType {
  FIRST: string;
  SECOND: string;
  THIRD: string;
  FOURTH: string;
  FIFTH: string;
}

interface TimeTableIndexType {
  0?: UserResponse[];
  1?: UserResponse[];
  2?: UserResponse[];
  3?: UserResponse[];
  4?: UserResponse[];
  5?: UserResponse[];
  6?: UserResponse[];
  7?: UserResponse[];
  8?: UserResponse[];
  9?: UserResponse[];
}

class PromisingService {
  async create(
    promisingInfo: PromisingInfo,
    owner: User,
    availDate: Date[],
    timeInfo: TimeRequest
  ) {
    const category = await CategoryKeyword.findOne({ where: { id: promisingInfo.categoryId } });
    if (!category) throw new NotFoundException('CategoryKeyword', promisingInfo.categoryId);

    const promising = new PromisingModel(promisingInfo);
    await promising.save();
    await promising.$set('owner', owner);
    await promising.$set('ownCategory', category);

    const promisingDates = await promisingDateService.create(promising, availDate);
    await this.responseTime(promising, owner, timeInfo);

    return new CreatedPromisingResponse(promising, promisingDates);
  }

  async getPromisingInfo(promisingId: number) {
    const promising = await PromisingModel.findOne({
      where: { id: promisingId },
      include: [
        {
          model: PromisingDateModel
        }
      ]
    });
    if (!promising) throw new NotFoundException('Promising', promisingId);

    return promising;
  }

  async getPromisingByUser(userId: number) {
    const promisingList: Array<object> | any = await PromisingModel.findAll({
      include: {
        model: EventModel,
        required: true,
        where: { userId: userId },
        attributes: []
      },
      raw: true
    });

    const ownPromisingList: Array<PromisingModel> = await PromisingModel.findAll({
      attributes: ['promisingId'],
      where: { ownerId: userId },
      raw: true
    });
    const ownPromisingIdList = Object.values(ownPromisingList.map((x: any) => x.promisingId));

    for (let i = 0; i < promisingList.length; i++) {
      const promisingInfo = promisingList[i];
      const userCount = await EventModel.count({ where: { promisingId: promisingInfo.id } });

      promisingInfo.memberCount = userCount;

      if (Object.values(ownPromisingIdList).indexOf(promisingInfo.id) > -1)
        promisingInfo.isOwn = true;
      else promisingInfo.isOwn = false;
    }
    return promisingList;
  }

  async responseTime(promising: PromisingModel, user: User, timeInfo: TimeRequest) {
    const savedEvent: EventModel = await eventService.create(promising, user);
    const savedTime = await timeService.create(promising, savedEvent, timeInfo);

    return { savedEvent, savedTime };
  }

  async confirm(id: number, date: Date, owner: User) {
    const promising = await this.findOneById(id);
    if (promising.ownerId != owner.id)
      throw new UnAuthorizedException('User is not owner of Promising');
    if (!(promising.minTime <= date))
      throw new BadRequestException('promiseDate', 'before minimum time.');
    if (!(date <= promising.maxTime))
      throw new BadRequestException('promiseDate', 'after maximum time.');

    const members = await eventService.findPossibleUsers(id, date);
    const category = await promising.$get('ownCategory');
    const promise = await promiseService.create(
      promising.promisingName,
      promising.placeName,
      date,
      owner,
      category!,
      members
    );
    await this.deleteOneById(id);
    return new PromiseResponse(promise, owner, category!, members);
  }

  async getTimeTable(id: number, unit = 0.5) {
    const promising = await PromisingModel.findOne({
      include: [
        {
          model: EventModel,
          required: true,
          include: [
            { model: TimeModel, required: true },
            { model: User, required: true }
          ]
        }
      ],
      where: { id }
    });
    if (!promising) throw new NotFoundException('Promising', id);

    const events = promising.ownEvents;
    const timeMap: Map<string, TimeTableIndexType> = new Map();
    const allUsers: UserResponse[] = [];
    events.forEach(({ user, eventTimes }) => {
      allUsers.push(new UserResponse(user));
      eventTimes.forEach((timeBlock) => {
        timeUtil
          .sliceTimeBlockByUnit(new Date(timeBlock.startTime), new Date(timeBlock.endTime), unit)
          .forEach((timeUnit) => {
            const dateStr = timeUnit.substring(0, 10);
            const key = timeUtil.getIndexFromMinTime(
              promising.minTime,
              new Date(timeUnit),
              unit
            ) as keyof TimeTableIndexType;
            if (!timeMap.has(dateStr)) {
              const obj: TimeTableIndexType = {};
              obj[key] = [new UserResponse(user)];
              timeMap.set(dateStr, obj);
            } else {
              if (!timeMap.get(dateStr)![key]) {
                timeMap.get(dateStr)![key] = [new UserResponse(user)];
              } else {
                timeMap.get(dateStr)![key] = [
                  ...timeMap.get(dateStr)![key]!,
                  new UserResponse(user)
                ];
              }
            }
          });
      });
    });

    const timeTable = Array.from(timeMap, ([date, obj]) => {
      const units = Object.keys(obj)
        .sort((a, b) => a.localeCompare(b))
        .map((value) => {
          const blockIdx: keyof TimeTableIndexType = parseInt(value) as keyof TimeTableIndexType;
          const colorStr: keyof ColorType = index[events.length - 1][
            obj[blockIdx]!.length
          ] as keyof ColorType;
          return new TimeTableUnit(
            blockIdx,
            obj[blockIdx]!.length,
            obj[blockIdx]!,
            parseInt(color[colorStr], 16)
          );
        });
      return new TimeTableDate(timeUtil.formatDate2String(new Date(date)), units);
    });
    const colors = index[events.length - 1].map((colorStr) =>
      parseInt(color[colorStr as keyof ColorType], 16)
    );

    return new TimeTableResponse(
      allUsers,
      colors,
      promising.minTime,
      promising.maxTime,
      timeUtil.getIndexFromMinTime(promising.minTime, promising.maxTime, unit) / 2,
      unit,
      timeTable
    );
  }

  async findOneById(id: number) {
    const promising: PromisingModel | null = await PromisingModel.findByPk(id);
    if (!promising) throw new NotFoundException('Promising', id);

    return promising;
  }

  async deleteOneById(id: number) {
    await PromisingModel.destroy({ where: { id } });
  }
}

export default new PromisingService();
