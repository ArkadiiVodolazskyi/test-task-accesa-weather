<template>
  <!-- TODO: show Spinner if forecastData is null -->
  <div
    class="location-weather"
    :data-is-favourite="isFavourite"
    :data-is-active="isActive"
  >
    <CurrentWeather
      :forecast="forecast"
      :DateTimeFormatter="DateTimeFormatter"
    />
    <ForecastDay :hours="hours" :DateTimeFormatter="DateTimeFormatter" />
    <ForecastWeek :days="days" :DateTimeFormatter="DateTimeFormatter" />
    <!-- TODO: move buttons to CurrentWeather -->
    <button class="delete-location" @click="deleteLocation">✘</button>
    <button class="toggle-favourite" @click="toggleFavourite">★</button>
    <button class="set-active" @click="setActive">❯</button>
  </div>
</template>

<script>
import DateTimeService from '../services/DateTimeService';

import ForecastDay from './ForecastDay.vue';
import ForecastWeek from './ForecastWeek.vue';
import CurrentWeather from './CurrentWeather.vue';

export default {
  components: { ForecastDay, ForecastWeek, CurrentWeather },
  props: ['forecast', 'language', 'isActive'],
  emits: ['delete-location', 'favourite-location', 'active-location'],
  data() {
    return {
      DateTimeFormatter: null,
      days: [],
      hours: [],
      isFavourite: this.forecast.isFavourite,
      // TODO: add isActive: active shows full forecast and its current weather and time specify the app theme
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
  methods: {
    deleteLocation() {
      const locationName = this.forecast.location.name;
      confirm(
        `Are you sure you want to stop watching weather in ${locationName}?`
      ) && this.$emit('delete-location', locationName);
    },
    toggleFavourite() {
      const locationName = this.forecast.location.name;
      const newFavouriteState = !this.isFavourite;
      this.isFavourite = newFavouriteState;
      this.$emit('favourite-location', locationName, newFavouriteState);
    },
    setActive() {
      const locationName = this.forecast.location.name;
      this.$emit('active-location', locationName);
    },
  },
};
</script>

<style lang="sass">
.location-weather
  display: flex
  flex-direction: column
  gap: 1em
[data-is-favourite='true']
  .toggle-favourite
    color: yellow
[data-is-active='true']
  .set-active
    color: green
</style>
