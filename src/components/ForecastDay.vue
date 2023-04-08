<template>
  <div class="forecast day">
    <h2>Forecast for next 24 hours</h2>
    <ul class="weather-grid">
      <li v-if="hours.length" v-for="hour in hours">
        <span>Hour: {{ hour.time }}</span>
        <span>Temperature: {{ hour.temp_c }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['hours'],
  data() {
    return {};
  },
};
</script>
