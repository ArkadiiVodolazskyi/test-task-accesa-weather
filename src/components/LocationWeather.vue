<template>
  <!-- TODO: show Spinner if forecastData is null -->
  <div class="location-weather">
    <CurrentWeather
      :forecast="forecast"
      :DateTimeFormatter="DateTimeFormatter"
    />
    <ForecastDay :hours="hours" :DateTimeFormatter="DateTimeFormatter" />
    <ForecastWeek :days="days" :DateTimeFormatter="DateTimeFormatter" />
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
      days: [],
      hours: [],
    };
  },
  created() {
    const { tz_id: timeZone } = this.forecast.location;
    const DateTimeFormatter = new DateTimeService(this.language, timeZone);
    this.DateTimeFormatter = DateTimeFormatter;

    const days = this.forecast.forecast.forecastday;
    this.days = days;

    this.hours = [...days[0].hour, ...days[1].hour];
  },
};
</script>
