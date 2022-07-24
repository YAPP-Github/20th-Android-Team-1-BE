import { PromisingSession } from '../dtos/promising/request';
import { BadRequestException, NotFoundException, UnAuthorizedException } from '../utils/error';
import {
  PromisingSessionResponse,
  PromisingTimeStampResponse,
  TimeTableDate,
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
import { ColorType, TimeTableIndexType } from '../utils/type';
import categoryService from './category-service';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../app';
import sequelize from 'sequelize';
import { REDIS_EXPIRE_SECONDS } from '../constants/number';

class PromisingService {
  async saveSession(session: PromisingSession) {
    const category = await categoryService.getOneById(session.categoryId);

    const minTime = new Date(session.minTime);
    const maxTime = new Date(session.maxTime);
    if (!(minTime instanceof Date && !isNaN(minTime.valueOf()))) {
      throw new BadRequestException('minTime', 'Invalid date');
    }
    if (!(maxTime instanceof Date && !isNaN(maxTime.valueOf()))) {
      throw new BadRequestException('minTime', 'Invalid date');
    }

    session.availableDates = session.availableDates.sort().map((date) => {
      const check = new Date(date);
      if (!(check instanceof Date && !isNaN(check.valueOf()))) {
        throw new BadRequestException('availableDates', 'include Invalid date');
      }
      return date;
    });

    const key = uuidv4();
    await redisClient.setEx(key, REDIS_EXPIRE_SECONDS, JSON.stringify(session));
    return key;
  }

  async getSession(uuid: string): Promise<PromisingSession> {
    const data = await redisClient.get(uuid);
    if (!data) throw new NotFoundException('Promising Session', uuid);
    return JSON.parse(data);
  }

  async deleteSession(uuid: string) {
    await redisClient.del(uuid);
  }

  async create(session: PromisingSession, owner: User) {
    if (session.ownerId != owner.id)
      throw new UnAuthorizedException('User is not owner of Promising');

    const category = await categoryService.getOneById(session.categoryId);
    const promising = new PromisingModel({
      promisingName: session.promisingName,
      minTime: new Date(session.minTime),
      maxTime: new Date(session.maxTime),
      placeName: session.placeName
    });

    await promising.save();
    await promising.$set('owner', owner);
    await promising.$set('ownCategory', category);
    await promisingDateService.create(promising, session.availableDates);

    return promising;
  }

  async getPromisingDateInfo(promisingId: number) {
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

  async getPromisingSession(uuid: string, unit = 0.5) {
    const session = await this.getSession(uuid);

    const totalCount = timeUtil.getIndexFromMinTime(
      new Date(session.minTime),
      new Date(session.maxTime),
      unit
    );
    return new PromisingSessionResponse(
      session.minTime,
      session.maxTime,
      totalCount / 2,
      unit,
      session.availableDates
    );
  }

  async getPromisingInfo(promisingId: number) {
    const promising = await PromisingModel.findOne({
      where: { id: promisingId },
      include: [
        { model: User, as: 'owner' },
        { model: CategoryKeyword, as: 'ownCategory' }
      ]
    });
    if (!promising) throw new NotFoundException('Promising', promisingId);
    return promising;
  }

  async getPromisingByUser(user: User) {
    const promisings = await PromisingModel.findAll({
      include: [
        {
          model: EventModel,
          required: true,
          where: {
            userId: user.id
          }
        },
        { model: User, as: 'owner', required: true },
        { model: CategoryKeyword, as: 'ownCategory', required: true },
        { model: PromisingDateModel, as: 'ownPromisingDates', required: true, attributes: ['date'] }
      ],
      order: [['updatedAt', 'DESC']]
    });

    const res = [];
    for (let i = 0; i < promisings.length; i++) {
      const promising = promisings[i];
      const members = await eventService.findPromisingMembers(promising.id);
      res.push(
        new PromisingTimeStampResponse(
          promising,
          promising.ownCategory,
          promising.ownPromisingDates.map((promisingDate) => promisingDate.date),
          members,
          user
        )
      );
    }
    return res;
  }

  async updateTimeStamp(promising: PromisingModel) {
    promising.changed('updatedAt', true);
    await promising.update({ updatedAt: sequelize.fn('NOW') });
  }

  async responseTime(promising: PromisingModel, user: User, timeInfo: TimeRequest) {
    const exist = await eventService.isResponsedBefore(promising, user);
    if (exist) throw new BadRequestException('User', 'already responsed to Promising');

    const savedEvent: EventModel = await eventService.create(promising, user);
    const savedTime = await timeService.create(promising, savedEvent, timeInfo);

    await this.updateTimeStamp(promising);
    return { savedEvent, savedTime };
  }

  async confirm(id: number, owner: User, date: Date, availDates: Date[]) {
    const promising = await this.findOneById(id);
    if (promising.ownerId != owner.id)
      throw new UnAuthorizedException('User is not owner of Promising');
    if (!timeUtil.isPossibleDate(date, availDates))
      throw new BadRequestException('date', 'is not available date');
    if (timeUtil.compareTime(date, promising.minTime) == -1)
      throw new BadRequestException('date', 'is earlier than minTime');
    if (timeUtil.compareTime(date, promising.maxTime) == 1)
      throw new BadRequestException('date', 'is later than maxTime');

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
    return new PromiseResponse(promise, owner, category!, members, true);
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

    const map = this.transformEvents2MapAndUsers(promising, unit);
    const { minTime, maxTime, ownEvents } = promising;

    const timeTable = Array.from(map, ([date, usersByDate]) => {
      const units = Object.keys(usersByDate)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => {
          const blockIdx = parseInt(key) as keyof TimeTableIndexType;
          const colorStr = index[ownEvents.length][
            usersByDate[blockIdx]!.length
          ] as keyof ColorType;

          return new TimeTableUnit(
            blockIdx,
            usersByDate[blockIdx]!.length,
            usersByDate[blockIdx]!,
            parseInt(color[colorStr], 16)
          );
        });

      return new TimeTableDate(timeUtil.formatDate2String(new Date(date)), units);
    });

    console.log(ownEvents.length, index[ownEvents.length], ownEvents.length);
    const colors = index[ownEvents.length].map((colorStr) =>
      parseInt(color[colorStr as keyof ColorType], 16)
    );
    const totalCount = timeUtil.getIndexFromMinTime(minTime, maxTime, unit) / 2;
    return {
      colors,
      totalCount,
      unit,
      timeTable
    };
  }

  transformEvents2MapAndUsers(promising: PromisingModel, unit: number) {
    const timeMap: Map<string, TimeTableIndexType> = new Map();
    const allUsers: UserResponse[] = [];
    promising.ownEvents.forEach(({ user, eventTimes }) => {
      allUsers.push(new UserResponse(user));
      eventTimes.forEach((timeBlock) => {
        timeUtil
          .sliceTimeBlockByUnit(new Date(timeBlock.startTime), new Date(timeBlock.endTime), unit)
          .forEach((timeUnit) => {
            const dateStr = timeUnit.substring(0, 10);
            const key = timeUtil.getIndexFromMinTime(promising.minTime, new Date(timeUnit), unit);
            this.bindUsersByDateTime(dateStr, key as keyof TimeTableIndexType, user, timeMap);
          });
      });
    });

    return timeMap;
  }

  bindUsersByDateTime(
    date: string,
    key: keyof TimeTableIndexType,
    user: User,
    map: Map<string, TimeTableIndexType>
  ) {
    if (!map.has(date)) {
      map.set(date, { [key]: [new UserResponse(user)] });
    } else if (!map.get(date)![key]) {
      map.get(date)![key] = [new UserResponse(user)];
    } else {
      map.get(date)![key] = [...map.get(date)![key]!, new UserResponse(user)];
    }
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
