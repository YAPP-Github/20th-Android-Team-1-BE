import EventRequest from '../dtos/event/request';
import EventModel from '../models/event';
import User from '../models/user';
import PromisingModel from '../models/promising';

class EventService {
    async create(promising: PromisingModel, user: User) {
        const eventInfo: EventRequest = { promisingId: promising.id, userId: user.id }
        const event = new EventModel(eventInfo);
        const savedEvent = await event.save()

        await savedEvent.$set('promising', promising)
        await savedEvent.$set('user', user)

        return savedEvent;
    }
}

export default new EventService();
