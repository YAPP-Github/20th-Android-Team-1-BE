import PromisingDate from '../models/promising-date';
import { NotFoundException } from '../utils/error';
import PromisingModel from '../models/promising';

class PromisingDateService {
  async create(promisingInfo: PromisingModel, availDates: string[]) {
    const savedPromisingDateList: Array<PromisingDate> = [];

    for (let i = 0; i < availDates.length; i++) {
      const dateTime = new Date(availDates[i]);
      const dateTimeObj = {
        ['promisingId']: promisingInfo.id,
        ['date']: dateTime
      };
      const promisingDate = new PromisingDate(dateTimeObj);
      const savedPromisingDate = await promisingDate.save();
      savedPromisingDateList.push(savedPromisingDate);
    }
    return savedPromisingDateList;
  }

  async findDatesById(promisingId: number) {
    const promisingDateResponse = await PromisingDate.findAll({
      where: { promisingId: promisingId }
    });
    if (!promisingDateResponse) throw new NotFoundException('PromisingDate in', promisingId);

    const promisingDateList = promisingDateResponse.map(
      (promisingDateResponse) => new Date(promisingDateResponse.date)
    );
    return promisingDateList;
  }
}
export default new PromisingDateService();
