<template>
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
.forecast
  overflow: hidden
  transition: opacity .3s .3s ease, max-height .4s ease-in-out
  max-height: 0
  opacity: 0
.set-active::before
  transform: rotate(-90deg)

.location-weather[data-is-favourite='true']
  .toggle-favourite
    color: yellow

.location-weather[data-is-active='true']
  gap: 1em
  .location-name
    color: hsl(var(--acc-main-2))
    filter: saturate(5)
  .set-active
    color: green
    &::before
      transform: rotate(0)
  .forecast
    max-height: 400px
    opacity: 1

@media (max-width: 650px)
  .location-weather
    padding-top: 1em
    &:not(:first-of-type)
      border-top: 1px solid var(--tx-main)
</style>
