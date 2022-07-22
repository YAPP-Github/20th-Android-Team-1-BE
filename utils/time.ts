import { TimeRequest, TimeForChangingDate } from '../dtos/time/request';
import TimeResponse from '../dtos/time/response';
import PromisingModel from '../models/promising';

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
      const timeFormat = {
        unit,
        day,
        indexList: availList,
        minTime: promising.minTime,
        maxTime: promising.maxTime
      };
      dateList = this.getDateList(timeFormat);
      resultList = resultList.concat(dateList);
    }
    return resultList;
  },

  getDateList(timeFormat: TimeForChangingDate) {
    const { unit, day, indexList, minTime, maxTime } = timeFormat;

    const resultList: Array<TimeResponse> = [];
    const dayTime = new Date(day);
    const minTimeDate = minTime.getHours() * 60 + minTime.getMinutes();
    const maxTimeDate = maxTime.getHours() * 60 + maxTime.getMinutes();
    const time = unit * 60;

    for (let i = 0; i < indexList.length; i++) {
      let { startDate, endDate } = indexList[i];
      (startDate = startDate * time + minTimeDate), (endDate = endDate * time + minTimeDate);

      let startHour = Math.trunc(startDate / 60),
        endHour = Math.trunc(endDate / 60);
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

    return `${year}-${mon.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour
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

  string2Date(str: string) {
    //yyyy-mm-dd or yyyy-mm
    const params = str.split('-');
    const res = { year: +params[0], month: +params[1] - 1, day: params[2] ? +params[2] : 1 };
    return new Date(new Date(res.year, res.month, res.day).getTime() + 540 * 60 * 1000);
  },

  isSameDate(date: Date, other: Date) {
    return (
      other.getFullYear() == date.getFullYear() &&
      other.getMonth() == date.getMonth() &&
      other.getDate() == date.getDate()
    );
  },

  isPossibleDate(date: Date, candidates: any) {
    return (
      candidates.filter((candidate: any) => this.isSameDate(new Date(date), new Date(candidate)))
        .length != 0
    );
  },

  async checkTimeResponseList(
    timeResponse: TimeRequest,
    minTime: Date,
    maxTime: Date,
    availDates: Date[] | string[]
  ) {
    const { unit, timeTable } = timeResponse;

    const maxHour = maxTime.getHours();
    const minHour = minTime.getHours();
    const count = (1 / unit) * (maxHour - minHour);

    for (let i = 0; i < timeTable.length; i++) {
      const timeList = timeTable[i].times;
      const date = new Date(timeTable[i].date);

      if (!this.isPossibleDate(date, availDates) || timeList.length > count) return false;
    }
    return true;
  },

  getIndexFromMinTime(minTime: Date, curTime: Date, unit: number) {
    const hourDiff = curTime.getHours() - minTime.getHours();
    const minDiff = hourDiff * 60 + (curTime.getMinutes() - minTime.getMinutes());
    return minDiff < 0 ? -1 : minDiff / (this.HOUR * unit);
  },

  compareTime(date: Date, other: Date) {
    if (date.getHours() == other.getHours()) {
      if (date.getMinutes() == other.getMinutes()) {
        if (date.getSeconds() == other.getSeconds()) return 0;
        else return date.getSeconds() < other.getSeconds() ? -1 : 1;
      } else return date.getMinutes() < other.getMinutes() ? -1 : 1;
    } else return date.getHours() < other.getHours() ? -1 : 1;
  }
};

export default timeUtil;
