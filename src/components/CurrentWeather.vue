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
      const locationFullName = `${country}, ${region}, ${name}`;
      return this.forecast.isCurrent
        ? `${locationFullName} (current)`
        : locationFullName;
    },
    deleteLocationUp() {
      const locationName = this.forecast.location.name;
      confirm(
        `Are you sure you want to stop watching weather in ${locationName}?`
      ) && this.$emit('delete-location', locationName);
    },
    toggleFavouriteUp() {
      const locationName = this.forecast.location.name;
      const newFavouriteState = !this.forecast.isFavourite;
      this.$emit('favourite-location', locationName, newFavouriteState);
    },
    setActiveUp() {
      const locationName = this.forecast.location.name;
      this.$emit('active-location', locationName);
    },
  },
};
</script>

<template>
  <div class="current-weather">
    <div class="location">
      <h2 class="location-name">
        <i>{{ getFullLocation() }}</i>
      </h2>
      <div class="manage-buttons">
        <button class="manage-button set-active" @click="setActiveUp"></button>
        <button
          class="manage-button toggle-favourite"
          @click="toggleFavouriteUp"
        ></button>
        <button
          class="manage-button delete-location"
          @click="deleteLocationUp"
        ></button>
      </div>
    </div>
    <div class="day-info">
      <p><strong>Today</strong></p>
      <p>{{ DateTimeFormatter.format(currentTime, 'weekday-time') }}</p>
    </div>
    <div class="time-info">
      <img class="weather-icon" :src="forecast.current.condition.icon" />
      <div>
        <p>
          <strong>{{ forecast.current.temp_c }}°C</strong>
        </p>
        <p>
          <small class="last-updated"
            >Last updated:
            {{ DateTimeFormatter.format(lastUpdatedTime, 'time') }}</small
          >
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.current-weather
  display: grid
  grid-template-columns: repeat(3, 1fr)
  align-items: center
  gap: .5em
.location-name
  padding: .3em 0
.manage-buttons
  display: flex
  align-items: center
  gap: .3em
.day-info
  text-align: right
.time-info
  display: flex
  align-items: center
  gap: .5em

@media (max-width: 650px)
  .current-weather
    grid-template-columns: repeat(2, 1fr)
  .location
    grid-column: span 2
    display: flex
    gap: 1em
    align-items: flex-start
    justify-content: space-between
  .day-info
    text-align: left
</style>
