<template>
  <!-- TODO: show Spinner if forecastData is null -->
  <div class="location-weather">
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
    <CurrentWeather></CurrentWeather>
    <ForecastDay
      v-for="forecast in forecasts"
      :hours="forecast.forecast.forecastday[0].hour"
    ></ForecastDay>
    <ForecastWeek
      v-for="forecast in forecasts"
      :days="forecast.forecast.forecastday"
    >
    </ForecastWeek>
  </div>
</template>

<script>
import DateTimeService from '../services/DateTimeService';

import ForecastDay from './ForecastDay.vue';
import ForecastWeek from './ForecastWeek.vue';
import CurrentWeather from './CurrentWeather.vue';

export default {
  components: { ForecastDay, ForecastWeek, CurrentWeather },
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
