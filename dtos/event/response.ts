import EventModel from '../../models/event';
import TimeModel from '../../models/time';

export class EventTimeResponse {
    savedEvent: EventModel;
    savedTime: Array<TimeModel>;

    constructor(savedEvent: EventModel, savedTime: Array<TimeModel>) {
        this.savedEvent = savedEvent;
        this.savedTime = savedTime;
    }

}
