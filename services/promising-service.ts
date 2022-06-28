import PromisingModel from '../models/promising';
import CategoryKeyword from '../models/category-keyword';
import { PromisingRequest } from '../dtos/promising/request';
import { BadRequestException, NotFoundException, UnAuthorizedException } from '../utils/error';
import User from '../models/user';
import { PromisingResponse, TimeTableResponse, TimeTableUnit } from '../dtos/promising/response';
import eventService from './event-service';
import promiseService from './promise-service';
import { PromiseReponse } from '../dtos/promise/response';
import EventModel from '../models/event';
import TimeModel from '../models/time';
import timeUtil from '../utils/time';
import color from '../constants/color.json';
import index from '../constants/color-index.json';
import { UserResponse } from '../dtos/user/response';

interface ColorType {
  FIRST: string;
  SECOND: string;
  THIRD: string;
  FOURTH: string;
  FIFTH: string;
}
class PromisingService {
  async create(promisingInfo: PromisingRequest) {
    const category = await CategoryKeyword.findOne({ where: { id: promisingInfo.categoryId } });
    const user = await User.findOne({ where: { id: promisingInfo.ownerId } });

    if (!user) throw new NotFoundException('User', promisingInfo.ownerId);
    if (!category) throw new NotFoundException('CategoryKeyword', promisingInfo.categoryId);

    const promising = new PromisingModel(promisingInfo);
    const savedPromising = await promising.save();
    const promisingResponse = new PromisingResponse(savedPromising, category);

    return promisingResponse;
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
    return new PromiseReponse(promise, owner, category!);
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
    const timeMap: Map<string, UserResponse[]> = new Map();
    const allUsers: UserResponse[] = [];
    events.forEach(({ user, eventTimes }) => {
      allUsers.push(new UserResponse(user));
      eventTimes.forEach((timeBlock) => {
        timeUtil
          .sliceTimeBlockByUnit(new Date(timeBlock.startTime), new Date(timeBlock.endTime), unit)
          .forEach((timeUnit) => {
            if (!timeMap.has(timeUnit)) {
              timeMap.set(timeUnit, [new UserResponse(user)]);
            } else {
              timeMap.set(timeUnit, [...timeMap.get(timeUnit)!, new UserResponse(user)]);
            }
          });
      });
    });

    const timeTable = Array.from(timeMap, ([date, users]) => {
      const colorStr: keyof ColorType = index[events.length - 1][users.length] as keyof ColorType;
      return new TimeTableUnit(date, users.length, users, color[colorStr]);
    });
    const colors = index[events.length - 1].map((colorStr) => color[colorStr as keyof ColorType]);

    return new TimeTableResponse(
      allUsers,
      colors,
      promising.minTime,
      promising.maxTime,
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
