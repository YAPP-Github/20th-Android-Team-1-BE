import PromisingModel from '../models/promising';
import CategoryKeyword from '../models/category-keyword';
import { PromisingInfo } from '../dtos/promising/request';
import { NotFoundException } from '../utils/error';
import User from '../models/user';
import { PromisingResponse } from '../dtos/promising/response';
import { TimeRequest } from '../dtos/time/request';
import timeService from './time-service';
import eventService from './event-service';
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

  async getPromisingById(promisingId: number) {
    const promising = await PromisingModel.findOne({ where: { id: promisingId } });
    if (!promising) throw new NotFoundException('Promising', promisingId);

    return promising;
  }

  async responseTime(promisingId: number, userId: number, timeInfo: TimeRequest) {
    const promising = await this.getPromisingById(promisingId);
    const user = await userService.findOneById(userId);

    const savedEvent: EventModel = await eventService.create(promising, user)
    const savedTime = await timeService.create(savedEvent, timeInfo)

    return { savedEvent, savedTime }
  }

}

export default new PromisingService();
