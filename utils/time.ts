import { PromisingRequest } from '../dtos/promising/request';
import { TimeRequest } from '../dtos/time/request';
import TimeResponse from '../dtos/time/response';
import PromisingModel from '../models/promising';
import { BadRequestException } from './error';

const timeUtil = {
  HOUR: 60,

  convertTime(dateTime: Date) {
    const d = [
      dateTime.getFullYear().toString(),
      dateTime.getMonth().toString(),
      dateTime.getDate().toString()
    ];
    const t = [
      dateTime.getHours().toString(),
      dateTime.getMinutes().toString(),
      dateTime.getSeconds().toString()
    ];
    for (let i = 0; i < t.length; i++) {
      t[i] = t[i].length < 2 ? '0' + t[i] : t[i];
      d[i] = d[i].length < 2 ? '0' + d[i] : d[i];
    }

    const dateString = d.join('-'),
      timeString = t.join(':');
    const resString = dateString + ' ' + timeString;
    return resString;
  },

  boolean2Time(timeInfo: TimeRequest, promising: PromisingModel) {
    const { unit, timeTable } = timeInfo;
    let resultList: Array<TimeResponse> = [];

    if (timeTable.length == 0) return resultList;
    for (let k = 0; k < timeTable.length; k++) {
      const timeOfDay = timeTable[k];
      const day = timeOfDay.date,
        times: Array<boolean> = timeOfDay.times;
      const availList = [];
      let dateList: Array<TimeResponse> = [];

      for (let i = 0; i < times.length; i++) {
        if (times[i] == true) {
          if (
            (i == 0 && times[i + 1] == false) ||
            (i == times.length - 1 && times[i - 1] == false)
          ) {
            availList.push({ ['startDate']: i, ['endDate']: i + 1 });
          } else if (times[i - 1] == false && times[i + 1] == false) {
            availList.push({ ['startDate']: i, ['endDate']: i + 1 });
          } else {
            const startIndex = i;
            while (times[i] == true) {
              i += 1;
            }
            availList.push({ ['startDate']: startIndex, ['endDate']: i });
          }
        }
      }
      dateList = this.getDateList(unit, day, availList,promising);
      resultList = resultList.concat(dateList);
    }
    return resultList;
  },

  getDateList(unit: number, day: Date, indexList: Array<any>, promising: PromisingModel) {
    const resultList: Array<TimeResponse> = [];
    const dayTime = new Date(day);
    const {minTime,maxTime} = promising;
    const minTimeDate  = (minTime.getHours()*60)+minTime.getMinutes()
    const maxTimeDate  = (maxTime.getHours()*60)+maxTime.getMinutes()
    const time = unit * 60; 
    for (let i = 0; i < indexList.length; i++) {
      let { startDate, endDate } = indexList[i];
      (startDate = (startDate * time)+minTimeDate), (endDate = (endDate * time)+minTimeDate);
      
      if(endDate > maxTimeDate)
        throw new BadRequestException('availDate','over MaxTime')

        let startHour = Math.trunc(startDate / 60) + 9,
        endHour = Math.trunc(endDate / 60) + 9;
      startHour = startHour > 23 ? Math.trunc(startHour % 24) : startHour;
      endHour = endHour > 23 ? Math.trunc(endHour % 24) : endHour;

      const startMin = Math.trunc(startDate % 60),
        endMin = Math.trunc(endDate % 60);
      const date = dayTime.getDate(),
        month = dayTime.getMonth() + 1,
        year = dayTime.getFullYear();

      const startTime = new Date(
        year + '.' + month + '.' + date + ' ' + startHour + ':' + startMin + ':00'
      );
      const endTime = new Date(
        year + '.' + month + '.' + date + ' ' + endHour + ':' + endMin + ':00'
      );
      const timeInfo = { startTime, endTime };

      resultList.push(timeInfo);
    }
    return resultList;
  },

  formatDate2String(date: Date) {
    const year = date.getFullYear();
    const mon = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return `${year}-${mon.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour
      .toString()
      .padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  },

  sliceTimeBlockByUnit(startTime: Date, endTime: Date, unit: number) {
    const MINUTE = this.HOUR * unit;
    const timeUnits = [];
    for (let cur = startTime; cur < endTime; cur.setMinutes(cur.getMinutes() + MINUTE)) {
      timeUnits.push(this.formatDate2String(new Date(cur)));
    }
    return timeUnits;
  },

  isPossibleDate(date: Date, candidates: Date[]) {
    return (
      candidates.filter(
        (candidate) =>
          candidate.getFullYear() == date.getFullYear() &&
          candidate.getMonth() == date.getMonth() &&
          candidate.getDate() == date.getDate()
      ).length != 0
    );
  }
};

export default timeUtil;
