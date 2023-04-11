<script>
import { toRaw } from 'vue';

import GeolocationService from './services/GeolocationService';
import LanguageService from './services/LanguageService';
import WeatherService from './services/WeatherService';

import Header from './components/Header.vue';
import AddLocation from './components/AddLocation.vue';
import LocationWeather from './components/LocationWeather.vue';
import Footer from './components/Footer.vue';

const GeolocationServiceAPI = new GeolocationService();
const LanguageServiceAPI = new LanguageService();
const WeatherServiceAPI = new WeatherService();

export default {
  components: { Header, AddLocation, LocationWeather, Footer },
  data() {
    return {
      language: null, // By default, user's browser language is used for getting initial forecast
      currentLocation: null, // By default, current user location is used for getting initial forecast
      forecasts: [], // Forecasts for each location, received from API
      activeForecastIndex: 0,
      askedLocation: false,
    };
  },
  methods: {
    getLocation() {
      GeolocationServiceAPI.getLocation(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            acc: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          this.currentLocation = location;
        },
        (err) => {
          if (err.code === 1) {
            this.allowedLocation = false;
          }
        }
      );
    },
    getLanguage() {
      this.language = LanguageServiceAPI.language;
    },
    async getWeekForecast(location, isFavourite = false, isCurrent = false) {
      const weekForecast = await WeatherServiceAPI.getForecast(
        location,
        7,
        'forecast',
        this.language
      );
      if (this.checkLocationUsed(weekForecast.location.name)) return;

      weekForecast.isFavourite = isFavourite;
      if (isCurrent) {
        weekForecast.isCurrent = true;
        this.forecasts.unshift(weekForecast);
        this.askedLocation = true;
      } else {
        this.forecasts.push(weekForecast);
      }

      this.updateActiveDay();
    },
    handleAddLocation(location) {
      this.getWeekForecast(location);
    },
    handleDeleteLocation(locationName) {
      this.forecasts = this.forecasts.filter(
        (forecast) => forecast.location.name !== locationName
      );
    },
    handleFavouriteLocation(locationName, newFavouriteState) {
      this.forecasts.find(
        (forecast) => forecast.location.name === locationName
      ).isFavourite = newFavouriteState;
      this.updateLocalFavourites();
    },
    updateLocalFavourites() {
      const favForecasts = toRaw(this.forecasts)
        .filter((forecast) => forecast.isFavourite)
        .map((favForecast) => favForecast.location.name);

      const favouriteLocationsJSON = JSON.stringify(favForecasts);
      localStorage.setItem('favouriteLocations', favouriteLocationsJSON);
    },
    async loadLocalFavourites() {
      const localFavouritesJSON = localStorage.getItem('favouriteLocations');
      const localFavourites =
        localFavouritesJSON && (await JSON.parse(localFavouritesJSON));
      if (!localFavourites || !localFavourites.length) return;
      localFavourites.forEach((locationName) =>
        this.getWeekForecast(locationName, true)
      );
    },
    checkLocationUsed(locationName) {
      const locationUsed = this.forecasts.find(
        (forecast) => forecast.location.name === locationName
      );
      return locationUsed;
    },
    setActiveForecast(locationName) {
      const newActiveForecastIndex = this.forecasts.findIndex(
        (forecast) => forecast.location.name === locationName
      );
      this.activeForecastIndex = newActiveForecastIndex;
    },
    updateActiveDay() {
      const isDay = this.forecasts.length
        ? this.forecasts[this.activeForecastIndex].current.is_day === 1
        : null;
      const themeName = isDay ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', themeName);
    },
    noLocationProvided() {
      this.askedLocation = true;
      localStorage.setItem('locationAsked', true);
    },
    async checkLocationProvided() {
      const locationAskedItem = localStorage.getItem('locationAsked');
      if (!locationAskedItem) return;
      const locationAsked = Boolean(locationAskedItem);
      this.askedLocation = locationAsked;
    },
  },
  created() {
    this.getLocation();
    this.getLanguage();

    this.loadLocalFavourites();
    if (this.currentLocation) {
      const { lat, lng } = this.currentLocation;
      this.getWeekForecast(
        `${lat}, ${lng}`,
        (isFavourite = false),
        (isCurrent = true)
      );
    }

    this.checkLocationProvided();
  },
  watch: {
    currentLocation() {
      if (this.currentLocation) {
        const { lat, lng } = this.currentLocation;
        this.getWeekForecast(`${lat}, ${lng}`, false, true);
      }
    },
    activeForecastIndex() {
      this.updateActiveDay();
    },
  },
};
</script>

<template>
  <main class="acessa-weather" :data-locations="Boolean(forecasts.length)">
    <div class="backgrounds">
      <img
        class="bg-main"
        data-bg-type="night"
        src="./assets/bg-night.jpg"
        alt="Background Nighttime"
      />
      <img
        class="bg-main"
        data-bg-type="day"
        src="./assets/bg-day.jpg"
        alt="Background Daytime"
      />
    </div>
    <Header />
    <div class="wrapper">
      <div class="notification" v-if="askedLocation === false">
        <p>
          To get a forecast for your current location, you will need to allow
          using your Location in your browser settings.
        </p>
        <p>
          <b>Firefox</b>: Privacy & Security (about:preferences#privacy) -
          Permissions - Location - Settings... - 'Block new requests asking to
          access your location' - Uncheck
        </p>
        <p>
          <b>Chrome</b>: Location (chrome://settings/content/location) - 'Sites
          can ask for your location' - Check
        </p>
        <button class="skip-location" @click="noLocationProvided">
          I do not want a forecast for my location
        </button>
      </div>
      <AddLocation @add-location="handleAddLocation" />
      <div class="locations">
        <LocationWeather
          v-for="(forecast, index) in forecasts"
          :forecast="forecast"
          :language="language"
          :isActive="index === activeForecastIndex"
          @delete-location="handleDeleteLocation"
          @favourite-location="handleFavouriteLocation"
          @active-location="setActiveForecast"
        />
      </div>
    </div>
    <Footer />
  </main>
</template>

<style lang="sass">
.acessa-weather
  min-height: 100vh
  overflow-x: hidden
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding: 4em 3em 7em
  position: relative
  &[data-locations='true']
    .wrapper
      gap: 1.5em
.wrapper
  width: 100%
  max-width: 800px
  margin: 0 auto
  padding: 2em
  background: radial-gradient(circle at 10% 20%, hsl(var(--acc-main) / .6) 0%, hsl(var(--acc-main-2) / .6) 90%)
  border-radius: 1em
  position: relative
  display: flex
  flex-direction: column
  &::before
    content: ''
    position: absolute
    z-index: -1
    isolation: isolate
    inset: -5px
    background: radial-gradient(circle at 10% 20%, hsl(var(--acc-main) / .6) 0%, hsl(var(--acc-main-2) / .6) 90%)
    filter: blur(5px)
    border-radius: inherit
.backgrounds
  background-color: hsl(var(--acc-main))
  background: radial-gradient(circle at 10% 20%, hsl(var(--acc-main)) 0%, hsl(var(--acc-main-2)) 90%)
  position: absolute
  inset: 0
  z-index: -1
  isolation: isolate
  width: 100%
  height: 100%
  display: grid
  justify-content: center
  overflow: hidden
.bg-main
  max-width: unset
  min-height: 100%
  grid-column: 1 / 1
  grid-row: 1 / 1
  transition: opacity .35s .2s ease-in
  opacity: 0

html[data-theme='light'] .bg-main
  &[data-bg-type=day]
    opacity: 1
  &[data-bg-type=night]
    opacity: 0
html[data-theme='dark'] .bg-main
  &[data-bg-type=day]
    opacity: 0
  &[data-bg-type=night]
    opacity: 1

@media (max-width: 650px)
  .acessa-weather
    padding-inline: 0
  .wrapper
    padding: 1em

.app-title
  text-align: center
.locations
  display: flex
  flex-direction: column
  gap: 1em
</style>
