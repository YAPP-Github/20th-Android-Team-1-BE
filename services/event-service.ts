import { Op } from 'sequelize';
import EventModel from '../models/event';
import PromisingModel from '../models/promising';
import TimeModel from '../models/time';

class EventService {
  async findPossibleUsers(promisingId: number, date: Date) {
    const events = await EventModel.findAll({
      where: {
        '$Promising.id$': { [Op.eq]: promisingId },
        '$Time.startTime$': { [Op.lte]: date },
        '$Time.endTime$': { [Op.gte]: date }
      },
      include: [
        { model: TimeModel, as: 'Time', required: true },
        { model: PromisingModel, as: 'Promising', required: true }
      ]
    });
    return events.map((event) => event.user);
  }
}

export default new EventService();
