import { PromisingInfo, PromisingRequest } from '../dtos/promising/request';
import { BadRequestException, NotFoundException, UnAuthorizedException } from '../utils/error';
import { PromisingResponse } from '../dtos/promising/response';
import { PromiseReponse } from '../dtos/promise/response';
import { TimeRequest } from '../dtos/time/request';
import PromisingModel from '../models/promising';
import CategoryKeyword from '../models/category-keyword';
import User from '../models/user';
import promiseService from './promise-service';
import eventService from './event-service';
import timeService from './time-service';
import EventModel from '../models/event';
import userService from './user-service';

class PromisingService {
  async create(promisingInfo: PromisingInfo) {
    const category = await CategoryKeyword.findOne({ where: { id: promisingInfo.categoryId } });
    const user = await User.findOne({ where: { id: promisingInfo.ownerId } });

    if (!user) throw new NotFoundException('User', promisingInfo.ownerId);
    if (!category) throw new NotFoundException('CategoryKeyword', promisingInfo.categoryId);

    const promising = new PromisingModel(promisingInfo);
    const savedPromising = await promising.save();
    const promisingResponse = new PromisingResponse(savedPromising, category);

    return promisingResponse;
  }

  async getPromisingInfo(promisingId: number) {
    const promising = await PromisingModel.findOne({ where: { id: promisingId } });
    if (!promising) throw new NotFoundException('Promising', promisingId);

    return promising;
  }

  async getPromisingByUser(userId: number) {
    const promisingList: Array<object> | any = await PromisingModel.findAll({
      include: {
        model: EventModel,
        required: true,
        where: { userId: userId },
        attributes: ['eventId'],
      },
      raw: true,
    })

    const ownPromisingList: Array<PromisingModel> = await PromisingModel.findAll({
      attributes: ['promisingId'],
      where: { ownerId: userId },
      raw: true
    })
    const ownPromisingIdList = Object.values(ownPromisingList.map((x: any) => x.promisingId));

    for (let i = 0; i < promisingList.length; i++) {
      const promisingInfo = promisingList[i]
      promisingInfo['ownEvents.eventId'] = undefined;
      if (Object.values(ownPromisingIdList).indexOf(promisingInfo.id) > -1)
        promisingInfo.isOwn = true;
      else
        promisingInfo.isOwn = false;
    }
    return promisingList;
  }

  async responseTime(promisingId: number, userId: number, timeInfo: TimeRequest) {
    const promising = await this.getPromisingInfo(promisingId);
    const user = await userService.findOneById(userId);

    const savedEvent: EventModel = await eventService.create(promising, user)
    const savedTime = await timeService.create(savedEvent, timeInfo)

    return { savedEvent, savedTime }
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
