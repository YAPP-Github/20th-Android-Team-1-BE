import TimeRequest from "../dtos/time/request";
import TimeUnit from "../dtos/time/time-unit";
import { ValidationException } from "./error";

const timeUtil = {
    convertTime(dateTime: Date) {
        const d = [
            dateTime.getFullYear().toString(),
            dateTime.getMonth().toString(),
            dateTime.getDate().toString()
        ]
        const t = [
            dateTime.getHours().toString(),
            dateTime.getMinutes().toString(),
            dateTime.getSeconds().toString()
        ]
        for (let i = 0; i < t.length; i++) {
            t[i] = (t[i].length < 2 ? '0' + t[i] : t[i])
            d[i] = (d[i].length < 2 ? '0' + d[i] : d[i])
        }

        const dateString = d.join('-'), timeString = t.join(':')
        const resString = dateString + ' ' + timeString
        return resString
    },
    boolean2Time(timeInfo: TimeRequest) {
        const { unit, timeTable } = timeInfo
        let resultList: Array<TimeUnit> = []

        if (timeTable.length == 0) return new ValidationException('timeTable')
        for (let k = 0; k < timeTable.length; k++) {
            const timeOfDay = timeTable[k]
            const day = timeOfDay.date, times: Array<boolean> = timeOfDay.times;
            const availList = []
            let dateList: Array<TimeUnit> | any = []

            for (let i = 0; i < times.length; i++) {
                if (times[i] == true) {
                    if ((i == 0 && times[i + 1] == false) || (i == times.length - 1 && times[i - 1] == false)) {
                        availList.push({ ['startDate']: i, ['endDate']: i + 1 });
                    }
                    else if (times[i - 1] == false && times[i + 1] == false) {
                        availList.push({ ['startDate']: i, ['endDate']: i + 1 });
                    }
                    else {
                        const startIndex = i;
                        while (times[i] == true) {
                            i += 1
                        }
                        availList.push({ ['startDate']: startIndex, ['endDate']: i });
                    }
                }
            }
            dateList = this.getDateList(unit, day, availList);
            resultList = resultList.concat(dateList);
        }
        return resultList;
    },
    getDateList(unit: number, day: Date, indexList: Array<any>) {
        const resultList: Array<TimeUnit> = []
        const dayTime = new Date(day)

        const time = unit * 60
        for (let i = 0; i < indexList.length; i++) {
            let { startDate, endDate } = indexList[i]
            startDate = startDate * time, endDate = endDate * time;

            let startHour = (Math.trunc(startDate / 60) + 9), endHour = (Math.trunc(endDate / 60) + 9)
            startHour = startHour > 23 ? Math.trunc(startHour % 24) : startHour
            endHour = endHour > 23 ? Math.trunc(endHour % 24) : endHour

            const startMin = Math.trunc(startDate % 60), endMin = Math.trunc(endDate % 60)
            const date = dayTime.getDate(), month = dayTime.getMonth() + 1, year = dayTime.getFullYear()

            const startTime = new Date(year + '.' + month + '.' + date + ' ' + startHour + ':' + startMin + ":00")
            const endTime = new Date(year + '.' + month + '.' + date + ' ' + endHour + ':' + endMin + ":00")
            const timeInfo = { startTime, endTime }

            resultList.push(timeInfo)
        }
        return resultList;
    }
};

export default timeUtil;
