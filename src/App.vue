<template>
  <main>
    <div class="wrapper">
      <h1>Accessa Weather</h1>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      weatherConfig: {
        apiKey: '28b6f11cef9849dbb7b204519230304', // TODO: should get API key from env
        baseURL: 'http://api.weatherapi.com/v1',
        infoURLs: {
          currentWeather: 'current',
          forecast: 'forecast',
          search: 'search',
          history: 'history',
        },
        cacheLifeSeconds: 300,
      },
      language: 'en',
      currentLocation: null,
      locations: [],
    };
  },
  methods: {
    // TODO: move the functionality to get location to a separate service
    // TODO: test in Chrome
    getLocation() {
      navigator.geolocation.getCurrentPosition(
        this.getGeoSuccess,
        this.getGeoFail,
        {
          enableHighAccuracy: true,
        }
      );
    },
    async getCachedLocation(
      cacheLifeSeconds = this.weatherConfig.cacheLifeSeconds
    ) {
      const cachedLocationString = localStorage.getItem('currentLocation');
      if (!cachedLocationString) return this.getLocation();

      const cachedLocation = await JSON.parse(cachedLocationString);
      const lastCachedSeconds = cachedLocation.timestamp / 1000;
      if (lastCachedSeconds < cacheLifeSeconds) return;

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
      console.info(
        `Location has been cached for the next ${this.weatherConfig.cacheLifeSeconds} seconds.`
      );
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
};
</script>
