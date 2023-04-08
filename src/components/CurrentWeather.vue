<template>
  <div class="current-weather">
    <h2>Weather in {{ getFullLocation() }}</h2>
    <div class="day-info">
      <strong>Today</strong>
      |
      {{ getFormattedTime(currentTime, 'weekday-time') }}
    </div>
    <div class="time-info">
      <img class="weather-icon" :src="forecast.current.condition.icon" />
      <strong>{{ forecast.current.temp_c }}°C</strong>
      <small class="last-updated"
        >Last updated: {{ getFormattedTime(lastUpdatedTime, 'time') }}</small
      >
    </div>
  </div>
</template>

<script>
import DateTimeService from '../services/DateTimeService';

export default {
  props: ['forecast', 'language'],
  data() {
    return {
      DateTimeFormatter: null,
      currentTime: null,
      timeZone: null,
      lastUpdatedTime: null,
    };
  },
  created() {
    const DateTimeFormatter = new DateTimeService(this.language);
    this.DateTimeFormatter = DateTimeFormatter;

    const { localtime: currentTime, tz_id: timeZone } = this.forecast.location;
    const { last_updated: lastUpdatedTime } = this.forecast.current;
    this.currentTime = currentTime;
    this.timeZone = timeZone;
    this.lastUpdatedTime = lastUpdatedTime;
  },
  methods: {
    getFullLocation() {
      const { country, region, name } = this.forecast.location;
      return `${country}, ${region}, ${name}`;
    },
    getFormattedTime(time_string, type) {
      return this.DateTimeFormatter.format(time_string, type, this.timeZone);
    },
  },
};
</script>
