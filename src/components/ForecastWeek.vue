<script>
export default {
  props: ['days', 'DateTimeFormatter'],
  data() {
    return {};
  },
};
</script>

<template>
  <div class="forecast week">
    <ul class="weather-grid">
      <li
        v-if="days && days.length"
        v-for="(day, index) in days"
        :title="day.day.condition.text"
        class="weather-piece weather-day"
        :class="{ current: index === 0 }"
      >
        <time class="time">
          {{ DateTimeFormatter.format(day.date, 'weekday-short') }}
        </time>
        <img
          class="weather-icon"
          :src="day.day.condition.icon"
          :alt="day.day.condition.text"
        />
        <p class="temp temp-max">{{ day.day.maxtemp_c }}°</p>
        <p class="temp temp-min">{{ day.day.mintemp_c }}°</p>
      </li>
    </ul>
  </div>
</template>
