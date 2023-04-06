<template>
  <main>
    <div class="wrapper">
      <h1>Accessa Weather</h1>
      <ForecastDay
        v-for="forecast in forecasts"
        :hours="forecast.forecast.forecastday[0].hour"
      ></ForecastDay>
      <ForecastWeek
        v-for="forecast in forecasts"
        :days="forecast.forecast.forecastday"
      >
      </ForecastWeek>
    </div>
  </main>
</template>

<script>
import GeolocationService from './services/GeolocationService';
import LanguageService from './services/LanguageService';
import WeatherService from './services/WeatherService';

import ForecastDay from './components/ForecastDay.vue';
import ForecastWeek from './components/ForecastWeek.vue';

const GeolocationServiceAPI = new GeolocationService();
const LanguageServiceAPI = new LanguageService();
const WeatherServiceAPI = new WeatherService();

export default {
  components: { ForecastDay, ForecastWeek },
  data() {
    return {
      language: null, // TODO: By default, user's browser language is used for getting initial forecast
      currentLocation: null, // By default, current user location is used for getting initial forecast
      locations: [], // Locations, that were specified by the user
      forecasts: [], // Forecasts for each location, received from API
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
    async getWeekForecast(location) {
      const weekForecast = await WeatherServiceAPI.getForecast(
        location,
        7,
        'forecast',
        this.language
      );
      this.forecasts.push(weekForecast);
    },
  },
  created() {
    this.getLocation();
    this.getLanguage();

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
