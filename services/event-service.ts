import { Op } from 'sequelize';
import EventModel from '../models/event';
import PromisingModel from '../models/promising';
import TimeModel from '../models/time';
import User from '../models/user';
import { BadRequestException } from '../utils/error';
import {UNKNOWN_USER_ID} from '../constants/nums';

class EventService {
  async create(promising: PromisingModel, user: User, isAbsent: boolean | null = null) {
    const exist = await this.isResponsedBefore(promising, user);
    if (exist) throw new BadRequestException('User', 'already responsed to Promising');

    const event = new EventModel({ promisingId: promising.id, userId: user.id, isAbsent });
    return await event.save();
  }

  async isResponsedBefore(promising: PromisingModel, user: User) {
    const exist = await EventModel.findOne({
      where: { promisingId: promising.id, userId: user.id }
    });
    return exist != undefined;
  }

  async findPossibleUsers(promisingId: number, date: Date) {
    const events = await EventModel.findAll({
      where: {
        '$promising.promisingId$': { [Op.eq]: promisingId },
        '$eventTimes.startTime$': { [Op.lte]: date },
        '$eventTimes.endTime$': { [Op.gte]: date }
      },
      include: [
        { model: TimeModel, as: 'eventTimes', required: true },
        { model: PromisingModel, as: 'promising', required: true },
        { model: User, as: 'user', required: true }
      ]
    });
    return events.map((event) => event.user); 
  }

  async findPromisingMembers(promisingId: number) {
    const events = await EventModel.findAll({
      where: {
        promisingId: promisingId
      },
      include: [{ model: User, as: 'user', required: true }]
    });
    return events.map((event) => event.user);
  }

  async updateResignMember(userId: number){
    const events = await EventModel.findAll({
      where: {
        userId: userId
      }
    });
    if(!events) return;
    EventModel.update({userId:UNKNOWN_USER_ID}, {where: {userId:userId}})
  }
}

export default new EventService();
