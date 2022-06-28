import EventRequest from '../dtos/event/request';
import EventModel from '../models/event';
import User from '../models/user';
import PromisingModel from '../models/promising';
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

        const updatedEvent = await EventModel.update({ isAbsent: isAbsent }, { where: { eventId: eventId } });

        return updatedEvent;
    }
}

export default new EventService();
