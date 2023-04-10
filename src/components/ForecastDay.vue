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

<template>
  <div class="forecast day">
    <ul class="weather-grid">
      <li
        v-if="hours.length"
        v-for="(hour, index) in this.cutHours(hours)"
        class="weather-piece weather-hour"
        :class="{ current: index === 0 }"
      >
        <time class="time">{{
          DateTimeFormatter.format(hour.time, 'time')
        }}</time>
        <p class="temp">{{ hour.temp_c }}°</p>
      </li>
    </ul>
  </div>
</template>

<style lang="sass">
.time
  white-space: pre
</style>
