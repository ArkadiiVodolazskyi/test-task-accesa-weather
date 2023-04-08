<template>
  <div class="forecast day">
    <h2>Forecast for next 24 hours</h2>
    <ul class="weather-grid">
      <li v-if="hours.length" v-for="hour in this.cutHours(hours)">
        <span>{{ hour.temp_c }}°</span>
        <span>{{ DateTimeFormatter.format(hour.time, 'time') }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['hours', 'DateTimeFormatter'],
  data() {
    return {};
  },
  methods: {
    cutHours(hoursArray, every = 2, next = 12) {
      const dateNow = new Date();
      const timestampNow = dateNow.getTime();
      const hourAgoTimestamp = new Date(timestampNow - 1000 * 60 * 60 * 1);
      const inTwelveHoursTimestamp = new Date(
        timestampNow + 1000 * 60 * 60 * next
      );
      return hoursArray
        .filter((hour) => {
          const hourTimestamp = new Date(hour.time);
          return (
            hourTimestamp >= hourAgoTimestamp &&
            hourTimestamp <= inTwelveHoursTimestamp
          );
        })
        .filter((hour, index) => index % every === 0);
    },
  },
};
</script>
