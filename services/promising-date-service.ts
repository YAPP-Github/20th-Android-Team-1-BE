import PromisingDate from '../models/promising-date';
import { NotFoundException } from '../utils/error';
import PromisingModel from '../models/promising';

class PromisingDateService {
  async create(promisingInfo: PromisingModel, availDates: string[]) {
    const promisingDates: Array<PromisingDate> = [];

    for (let i = 0; i < availDates.length; i++) {
      const dateTime = new Date(availDates[i]);
      const dateTimeObj = {
        ['promisingId']: promisingInfo.id,
        ['date']: dateTime
      };
      const promisingDate = new PromisingDate(dateTimeObj);
      const savedPromisingDate = await promisingDate.save();
      promisingDates.push(savedPromisingDate);
    }
    return promisingDates.map((promisingDate) => promisingDate.date);
  }

  async findDatesById(promisingId: number) {
    const promisingDates = await PromisingDate.findAll({
      where: { promisingId: promisingId }
    });
    if (!promisingDates) throw new NotFoundException('PromisingDate in', promisingId);

    return promisingDates.map((promisingDate) => promisingDate.date);
  }
}
export default new PromisingDateService();
