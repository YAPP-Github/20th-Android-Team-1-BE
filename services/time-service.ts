import { TimeRequest } from '../dtos/time/request';
import EventModel from '../models/event';
import timeUtil from '../utils/time';
import TimeResponse from '../dtos/time/response';
import TimeModel from '../models/time';
import eventService from './event-service';
import PromisingModel from '../models/promising';
import { BadRequestException } from '../utils/error';


class TimeService {
    async create(eventInfo: EventModel, timeInfo: TimeRequest, promisingInfo: PromisingModel) {
        const responseList: Array<TimeModel> = []
        const resultList: Array<TimeResponse> = timeUtil.boolean2Time(timeInfo) as Array<TimeResponse>
        const { minTime, maxTime } = promisingInfo;

        if (resultList.length == 0) {
            eventService.updateIsAbsent(eventInfo.id, true);
            return responseList;
        }

        for (let i = 0; i < resultList.length; i++) {
            const timeObj = {
                ['eventId']: eventInfo.id,
                ['startTime']: resultList[i].startTime,
                ['endTime']: resultList[i].endTime,
            }
            if (timeObj.startTime < minTime)
                throw new BadRequestException('promisingTime', 'before minimum time.');
            if (timeObj.endTime > maxTime)
                throw new BadRequestException('promisingTime', 'after maximum time.');
            const time = new TimeModel(timeObj)
            responseList.push(await time.save());
        }
        return responseList;
    }

}
export default new TimeService();
