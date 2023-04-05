<template>
  <!-- TODO: show Spinner if forecastData is null -->
  <div class="forecast day">
    <h2>Forecast for next 24 hours</h2>
    <ul class="temperature-grid">
      <li v-if="hours.length" v-for="hour in hours">
        <span>Hour: {{ hour.time }}</span>
        <span>Temperature: {{ hour.temp_c }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['WeatherService', 'currentLocation'],
  data() {
    return {
      forecastData: null,
      hours: [],
    };
  },
  methods: {
    async getForecast(currentLocation, days = 1) {
      const forecastData = await this.WeatherService.getForecast(
        currentLocation,
        days
      );
      this.forecastData = forecastData;
      this.hours = forecastData.forecast.forecastday[0].hour;
    },
  },
  created() {
    if (this.currentLocation !== null) {
      this.getForecast(this.currentLocation, 1);
    }
  },
  watch: {
    currentLocation: () => {
      if (this.currentLocation !== null) {
        this.getForecast(this.currentLocation, 1);
      }
    },
  },
};
</script>
