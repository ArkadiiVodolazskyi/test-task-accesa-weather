<template>
  <!-- TODO: show Spinner if forecastData is null -->
  <div class="location-weather">
    <CurrentWeather
      :forecast="forecast"
      :DateTimeFormatter="DateTimeFormatter"
    />
    <ForecastDay :hours="hours" :DateTimeFormatter="DateTimeFormatter" />
    <ForecastWeek :days="days" :DateTimeFormatter="DateTimeFormatter" />
    <button class="delete-location" @click="deleteLocation">⤫</button>
    <button
      class="toggle-favourite"
      :data-isFavourite="isFavourite"
      @click="toggleFavourite"
    >
      ★
    </button>
  </div>
</template>

<script>
import DateTimeService from '../services/DateTimeService';

import ForecastDay from './ForecastDay.vue';
import ForecastWeek from './ForecastWeek.vue';
import CurrentWeather from './CurrentWeather.vue';

export default {
  components: { ForecastDay, ForecastWeek, CurrentWeather },
  props: ['forecast'],
  emits: ['delete-location', 'favourite-location'],
  data() {
    return {
      DateTimeFormatter: null,
      days: [],
      hours: [],
      isFavourite: false,
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
  },
};
</script>

<style lang="sass">
[data-isFavourite='true']
  color: yellow
</style>
