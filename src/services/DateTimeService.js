export default class DateTimeService {
  constructor(language) {
    this.language = language;
  }

  format = (time_string, type, timeZone) => {
    const date = new Date(time_string);
    let timeFormatOptions = {};
    switch (type) {
      case 'weekday-time':
        timeFormatOptions = {
          timeZone,
          hour12: false,
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit',
        };
        break;
      case 'time':
        timeFormatOptions = {
          timeZone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        };
        break;
    }
    const formattedTime = new Intl.DateTimeFormat(
      this.language,
      timeFormatOptions
    ).format(date);
    return formattedTime;
  };
}
