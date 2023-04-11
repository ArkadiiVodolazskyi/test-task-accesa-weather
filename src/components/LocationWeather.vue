<template>
  <!-- TODO: show Spinner if forecastData is null -->
  <div
    class="location-weather"
    :data-is-active="isActive"
    :data-is-favourite="forecast.isFavourite"
  >
    <CurrentWeather
      :forecast="forecast"
      :DateTimeFormatter="DateTimeFormatter"
      @delete-location="catchDeleteLocationFromChild"
      @favourite-location="catchToggleFavouriteFromChild"
      @active-location="catchSetActiveFromChild"
    />
    <ForecastDay :hours="hours" :DateTimeFormatter="DateTimeFormatter" />
    <ForecastWeek :days="days" :DateTimeFormatter="DateTimeFormatter" />
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
    catchDeleteLocationFromChild(locationName) {
      this.$emit('delete-location', locationName);
    },
    catchToggleFavouriteFromChild(locationName, newFavouriteState) {
      this.$emit('favourite-location', locationName, newFavouriteState);
    },
    catchSetActiveFromChild(locationName) {
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
.forecast
  overflow: hidden
  transition: opacity .3s .3s ease, max-height .4s ease-in-out
  max-height: 0
  opacity: 0
.set-active::before
  transform: rotate(-90deg)
[data-is-favourite='true']
  .toggle-favourite
    color: yellow
[data-is-active='true']
  .set-active
    color: green
    &::before
      transform: rotate(0)
  .forecast
    max-height: 400px
    opacity: 1
</style>
