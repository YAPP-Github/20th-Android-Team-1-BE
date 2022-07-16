import { TimeRequest } from '../dtos/time/request';
import EventModel from '../models/event';
import timeUtil from '../utils/time';
import TimeResponse from '../dtos/time/response';
import TimeModel from '../models/time';
import PromisingModel from '../models/promising';
import { BadRequestException } from '../utils/error';

class TimeService {
  async create(promising: PromisingModel, eventInfo: EventModel, timeInfo: TimeRequest) {
    const responseList: Array<TimeModel> = [];
    const resultList: Array<TimeResponse> = timeUtil.boolean2Time(
      timeInfo,
      promising
    ) as Array<TimeResponse>;

    if (resultList.length == 0) {
      throw new BadRequestException('times', 'available time is zero');
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
