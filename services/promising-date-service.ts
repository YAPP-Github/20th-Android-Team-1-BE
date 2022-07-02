import EventModel from '../models/event';
import PromisingModel from '../models/promising';
import PromisingDate from '../models/promising-date';
import { TimeRequest } from '../dtos/time/request';

class PromisingDateService {
    async create(promisingInfo: PromisingModel, eventInfo: EventModel, timeInfo: TimeRequest) {
        const timeTable = timeInfo.timeTable;
        const savedPromisingDateList: Array<PromisingDate> = []

        if (timeTable.length == 0) return savedPromisingDateList;
        for (let i = 0; i < timeTable.length; i++) {
            const dateTime: Date = timeTable[i].date;

            const dateTimeOjb = {
                ['promisingId']: promisingInfo.id,
                ['eventId']: eventInfo.id,
                ['dateTime']: dateTime,
            }
            const promisingDate = new PromisingDate(dateTimeOjb);
            const savedPromisingDate = await promisingDate.save();
            savedPromisingDateList.push(savedPromisingDate)
        }
        return savedPromisingDateList
    }

}
export default new PromisingDateService();
