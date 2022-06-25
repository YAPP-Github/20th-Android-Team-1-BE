import PromisingModel from '../models/promising';
import CategoryKeyword from '../models/category-keyword';
import { PromisingRequest } from '../dtos/promising/request';
import { BadRequestException, NotFoundException, UnAuthorizedException } from '../utils/error';
import User from '../models/user';
import { PromisingResponse } from '../dtos/promising/response';
import promiseService from './promise-service';
import PromiseModel from '../models/promise';
import eventService from './event-service';

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

  async confirm(id: number, date: Date, owner: User): Promise<PromiseModel> {
    const promising = await this.findOneById(id);
    if (promising.ownerId != owner.id)
      throw new UnAuthorizedException('User is not owner of Promising');
    if (!(promising.minTime <= date))
      throw new BadRequestException('promiseDate', 'before minimum time.');
    if (!(date <= promising.maxTime))
      throw new BadRequestException('promiseDate', 'after maximum time.');

    const members = await eventService.findPossibleUsers(id, date);

    return await promiseService.create(
      promising.promisingName,
      promising.placeName,
      date,
      owner,
      promising.ownCategory,
      members
    );
  }

  async findOneById(id: number): Promise<PromisingModel> {
    const promising: PromisingModel | null = await PromisingModel.findByPk(id);
    if (!promising) throw new NotFoundException('Promising', id);

    return promising;
  }
}

export default new PromisingService();
