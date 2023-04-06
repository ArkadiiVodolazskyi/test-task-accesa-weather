<template>
  <!-- TODO: show Spinner if forecastData is null -->
  <div class="forecast week">
    <h2>Forecast for next 7 days</h2>
    <ul class="weather-grid">
      <li v-if="days && days.length" v-for="day in days">
        <span>Day: {{ day.date }}</span>
        <span>Average temperature: {{ day.day.avgtemp_c }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['days'],
  data() {
    return {};
  },
};
</script>
