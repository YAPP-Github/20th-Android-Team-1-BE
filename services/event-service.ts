import { Op } from 'sequelize';
import EventModel from '../models/event';
import PromisingModel from '../models/promising';
import TimeModel from '../models/time';
import User from '../models/user';

class EventService {
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
}

export default new EventService();
