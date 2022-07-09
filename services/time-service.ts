import { TimeRequest } from '../dtos/time/request';
import EventModel from '../models/event';
import timeUtil from '../utils/time';
import TimeResponse from '../dtos/time/response';
import TimeModel from '../models/time';
import eventService from './event-service';
import PromisingModel from '../models/promising';

class TimeService {
  async create(promising: PromisingModel, eventInfo: EventModel, timeInfo: TimeRequest) {
    const responseList: Array<TimeModel> = [];
    const resultList: Array<TimeResponse> = timeUtil.boolean2Time(
      timeInfo,
      promising
    ) as Array<TimeResponse>;

    resultList.forEach((date) => console.log(date.startTime, date.endTime));
    if (resultList.length == 0) {
      eventService.updateIsAbsent(eventInfo.id, true);
      return responseList;
    }

    for (let i = 0; i < resultList.length; i++) {
      const timeInfo = {
        ['eventId']: eventInfo.id,
        ['startTime']: resultList[i].startTime,
        ['endTime']: resultList[i].endTime
      };
      const time = new TimeModel(timeInfo);
      responseList.push(await time.save());
    }
    return responseList;
  }
}
export default new TimeService();
