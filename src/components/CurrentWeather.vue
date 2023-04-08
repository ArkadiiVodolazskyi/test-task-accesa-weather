<template>
  <div class="current-weather">
    <h2>Weather in {{ getFullLocation() }}</h2>
    <div class="day-info">
      <strong>Today</strong>
      |
      {{ DateTimeFormatter.format(currentTime, 'weekday-time') }}
    </div>
    <div class="time-info">
      <img class="weather-icon" :src="forecast.current.condition.icon" />
      <strong>{{ forecast.current.temp_c }}°C</strong>
      <small class="last-updated"
        >Last updated:
        {{ DateTimeFormatter.format(lastUpdatedTime, 'time') }}</small
      >
    </div>
  </div>
</template>

<script>
export default {
  props: ['forecast', 'DateTimeFormatter'],
  data() {
    return {
      currentTime: null,
      lastUpdatedTime: null,
    };
  },
  created() {
    const { localtime: currentTime } = this.forecast.location;
    const { last_updated: lastUpdatedTime } = this.forecast.current;
    this.currentTime = currentTime;
    this.lastUpdatedTime = lastUpdatedTime;
  },
  methods: {
    getFullLocation() {
      const { country, region, name } = this.forecast.location;
      return `${country}, ${region}, ${name}`;
    },
  },
};
</script>
