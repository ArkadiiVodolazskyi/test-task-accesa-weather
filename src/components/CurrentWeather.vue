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
        <button class="delete-location" @click="deleteLocationUp">✘</button>
        <button class="toggle-favourite" @click="toggleFavouriteUp">★</button>
        <button class="set-active" @click="setActiveUp">❯</button>
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
  p:first-of-type
    padding: .3em
  i
    padding: .2em .6em
    border-radius: .5em
    background: linear-gradient(-135deg, hsl(var(--acc-main) / .8) 0%, hsl(var(--acc-main-2) / .8) 100%)
.day-info
  text-align: right
.time-info
  display: flex
  align-items: center
  gap: .5em
</style>
