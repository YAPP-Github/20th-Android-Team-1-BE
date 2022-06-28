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
  }
};

export default timeUtil;
