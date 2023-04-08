<template>
  <!-- TODO: show Spinner if forecastData is null -->
  <div class="location-weather">
    <CurrentWeather :forecast="forecast" :language="language" />
    <ForecastDay :hours="hours" />
    <ForecastWeek :days="days" />
  </div>
</template>

<script>
import ForecastDay from './ForecastDay.vue';
import ForecastWeek from './ForecastWeek.vue';
import CurrentWeather from './CurrentWeather.vue';

export default {
  components: { ForecastDay, ForecastWeek, CurrentWeather },
  props: ['forecast', 'language'],
  data() {
    return {
      days: [],
      hours: [],
    };
  },
  created() {
    const days = this.forecast.forecast.forecastday;
    this.days = days;
    this.hours = days[0].hour;
  },
};
</script>
