export default class DateTimeService {
  constructor(language, timeZone) {
    this.language = language;
    this.timeZone = timeZone;
  }

  format = (time_string, type) => {
    const date = new Date(time_string);
    let timeFormatOptions = {};
    switch (type) {
      case 'weekday-time':
        timeFormatOptions = {
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit',
        };
        break;
      case 'weekday-short':
        timeFormatOptions = {
          weekday: 'short',
        };
        break;
      case 'time':
        timeFormatOptions = {
          hour: '2-digit',
          minute: '2-digit',
        };
        break;
    }
    timeFormatOptions.timeZone = this.timeZone;
    const formattedTime = new Intl.DateTimeFormat(
      this.language,
      timeFormatOptions
    ).format(date);
    return formattedTime;
  };
}
