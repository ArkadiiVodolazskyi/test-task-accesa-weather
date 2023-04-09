<template>
  <main>
    <div class="wrapper">
      <h1>Accessa Weather</h1>
      <AddLocation @add-location="handleAddLocation" />
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
  </main>
</template>

<script>
import { toRaw } from 'vue';

import GeolocationService from './services/GeolocationService';
import LanguageService from './services/LanguageService';
import WeatherService from './services/WeatherService';

import AddLocation from './components/AddLocation.vue';
import LocationWeather from './components/LocationWeather.vue';

const GeolocationServiceAPI = new GeolocationService();
const LanguageServiceAPI = new LanguageService();
const WeatherServiceAPI = new WeatherService();

export default {
  components: { AddLocation, LocationWeather },
  data() {
    return {
      language: null, // By default, user's browser language is used for getting initial forecast
      currentLocation: null, // By default, current user location is used for getting initial forecast
      forecasts: [], // Forecasts for each location, received from API
      activeForecastIndex: 0,
    };
  },
  methods: {
    getLocation() {
      GeolocationServiceAPI.getLocation((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          acc: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        this.currentLocation = location;
      });
    },
    getLanguage() {
      this.language = LanguageServiceAPI.language;
    },
    async getWeekForecast(location, isFavourite = false) {
      const weekForecast = await WeatherServiceAPI.getForecast(
        location,
        7,
        'forecast',
        this.language
      );
      if (this.checkLocationUsed(weekForecast.location.name)) return;

      weekForecast.isFavourite = isFavourite;
      this.forecasts.push(weekForecast);
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
  },
  created() {
    this.getLocation();
    this.getLanguage();

    this.loadLocalFavourites();
    if (this.currentLocation) {
      const { lat, lng } = this.currentLocation;
      this.getWeekForecast(`${lat}, ${lng}`);
    }
  },
  watch: {
    currentLocation() {
      if (this.currentLocation) {
        const { lat, lng } = this.currentLocation;
        this.getWeekForecast(`${lat}, ${lng}`);
      }
    },
  },
};
</script>
