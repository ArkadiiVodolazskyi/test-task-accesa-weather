<template>
  <div class="forecast week">
    <h2>Forecast for next 7 days</h2>
    <ul class="weather-grid">
      <li
        v-if="days && days.length"
        v-for="day in days"
        :title="day.day.condition.text"
      >
        <img
          class="icon"
          :src="day.day.condition.icon"
          :alt="day.day.condition.text"
        />
        <span
          >Day: {{ DateTimeFormatter.format(day.date, 'weekday-short') }}</span
        >
        <span>{{ day.day.maxtemp_c }}°</span>
        <span>{{ day.day.mintemp_c }}°</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['days', 'DateTimeFormatter'],
  data() {
    return {};
  },
};
</script>
