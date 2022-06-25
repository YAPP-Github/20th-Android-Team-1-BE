import PromisingModel from '../models/promising';
import CategoryKeyword from '../models/category-keyword';
import PromisingRequest from '../dtos/promising/request';
import { NotFoundException, ValidationException } from '../utils/error';
import User from '../models/user';
import PromisingResponse from '../dtos/promising/response';
import TimeRequest from '../dtos/time/request';
import timeService from './time-service';
import eventService from './event-service';
import EventModel from '../models/event';

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
    if (!promisingId) return new ValidationException('promisingId');
    const promising = await PromisingModel.findOne({ where: { id: promisingId } });
    if (!promising) return new NotFoundException('Promising', promisingId);

    return promising;
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
