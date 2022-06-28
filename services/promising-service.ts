import PromisingModel from '../models/promising';
import CategoryKeyword from '../models/category-keyword';
import { PromisingRequest } from '../dtos/promising/request';
import { NotFoundException } from '../utils/error';
import User from '../models/user';
import PromisingResponse from '../dtos/promising/response';
import TimeRequest from '../dtos/time/request';
import timeService from './time-service';
import eventService from './event-service';
import EventModel from '../models/event';
import deleteJsonKey from '../utils/array'

class PromisingService {
  async create(promisingInfo: PromisingRequest) {
    const category = await CategoryKeyword.findOne({ where: { id: promisingInfo.categoryId } });
    const user = await User.findOne({ where: { id: promisingInfo.ownerId } });

    if (!user) return new NotFoundException('User', promisingInfo.ownerId);
    if (!category) return new NotFoundException('CategoryKeyword', promisingInfo.categoryId);

    const promising = new PromisingModel(promisingInfo);
    const savedPromising = await promising.save();
    const promisingResponse = new PromisingResponse(savedPromising, category);

    return promisingResponse;
  }

  async getPromisingInfo(promisingId: number) {
    const promising = await PromisingModel.findOne({ where: { id: promisingId } });
    if (!promising) return new NotFoundException('Promising', promisingId);

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
    const promising = await PromisingModel.findOne({ where: { promisingId: promisingId } });
    const user = await User.findOne({ where: { id: userId } });

    if (!user) return new NotFoundException('User', userId);
    if (!promising) return new NotFoundException('Promising', promisingId);

    const savedEvent: EventModel = await eventService.create(promising, user)
    const savedTime = await timeService.create(savedEvent, timeInfo)

    return { savedEvent, savedTime }
  }

}

export default new PromisingService();
