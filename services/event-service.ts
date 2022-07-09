import { Op } from 'sequelize';
import EventModel from '../models/event';
import PromisingModel from '../models/promising';
import TimeModel from '../models/time';
import User from '../models/user';
import EventRequest from '../dtos/event/request';
import { ValidationException } from '../utils/error';

class EventService {
  async create(promising: PromisingModel, user: User) {
    const eventInfo: EventRequest = { promisingId: promising.id, userId: user.id };
    const event = new EventModel(eventInfo);
    const savedEvent = await event.save();

    await savedEvent.$set('promising', promising);
    await savedEvent.$set('user', user);

    return savedEvent;
  }
  async updateIsAbsent(eventId: number, isAbsent: boolean) {
    if (!eventId) throw new ValidationException('eventId');
    if (!isAbsent) throw new ValidationException('isAbsent');

    const updatedEvent = await EventModel.update(
      { isAbsent: isAbsent },
      { where: { eventId: eventId } }
    );

    return updatedEvent;
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
}

export default new EventService();
