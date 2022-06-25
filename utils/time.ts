const timeUtil = {
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
  }
};

export default timeUtil;
