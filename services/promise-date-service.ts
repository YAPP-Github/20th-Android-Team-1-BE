import PromisingDate from '../models/promising-date';
import { PromisingResponse } from '../dtos/promising/response';
import { NotFoundException } from '../utils/error';

class PromisingDateService {
    async create(promisingInfo: PromisingResponse, availDates: Array<Date>) {
        const savedPromisingDateList: Array<PromisingDate> = []

        for (let i = 0; i < availDates.length; i++) {
            const dateTime: Date = new Date(availDates[i]);
            const dateTimeOjb = {
                ['promisingId']: promisingInfo.id,
                ['date']: dateTime,
            }
            const promisingDate = new PromisingDate(dateTimeOjb);
            const savedPromisingDate = await promisingDate.save();
            savedPromisingDateList.push(savedPromisingDate)
        }
        return savedPromisingDateList
    }
    async findDatesById(promisingId: number){
        const promisingDateResponse = await PromisingDate.findAll({where :{promisingId: promisingId}});
        if (!promisingDateResponse) throw new NotFoundException('PromisingDate in', promisingId);

        const promisingDateList = promisingDateResponse.map(promisingDateResponse => promisingDateResponse.date)
        console.log(promisingDateList)
        return promisingDateList
    }

}
export default new PromisingDateService();