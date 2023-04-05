<template>
  <main>
    <div class="wrapper">
      <h1>Accessa Weather</h1>
      <ForecastDay
        :WeatherService="WeatherService"
        :currentLocation="currentLocation"
      ></ForecastDay>
    </div>
  </main>
</template>

<script>
import WeatherService from './services/WeatherService';
const WeatherServiceAPI = new WeatherService();

import ForecastDay from './components/ForecastDay.vue';

export default {
  data() {
    return {
      language: 'en',
      currentLocation: null,
      locations: [],
      components: [ForecastDay],
      WeatherService: WeatherServiceAPI,
    };
  },
  methods: {
    // TODO: move the functionality to get location to a separate service
    // TODO: test in Chrome
    // TODO: move Geolocation logic to GeolocationService.js
    getLocation() {
      navigator.geolocation.getCurrentPosition(
        this.getGeoSuccess,
        this.getGeoFail,
        {
          enableHighAccuracy: false,
          timeout: 3000,
          maximumAge: 1000 * 60 * 5,
        }
      );
    },
    async getCachedLocation(cacheLifeSeconds = 300) {
      const cachedLocationString = localStorage.getItem('currentLocation');
      if (!cachedLocationString) return this.getLocation();
      const cachedLocation = await JSON.parse(cachedLocationString);
      const lastCachedSeconds = cachedLocation.timestamp / 1000;
      if (lastCachedSeconds < cacheLifeSeconds)
        return (this.currentLocation = cachedLocation);
      this.getLocation();
    },
    getGeoSuccess(position) {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        acc: position.coords.accuracy,
        timestamp: position.timestamp,
      };
      this.currentLocation = location;
      localStorage.setItem('currentLocation', JSON.stringify(location));
      console.info(`Location has been cached.`);
    },
    getGeoFail(err) {
      if (err.code === 1) {
        alert('Please, allow using your geoposition.');
        // TODO: add quick links to browser settings
        // f.e. Firefox: about:preferences#privacy
        // Chrome: ...
      }
    },
  },
  mounted() {
    this.getCachedLocation();
    this.language = navigator.language;
  },
  components: { ForecastDay },
};
</script>
