const VITE_WEATHERAPI_KEY = import.meta.env.VITE_WEATHERAPI_KEY;

export default class WeatherService {
  constructor() {
    this.apiKey = VITE_WEATHERAPI_KEY;
    this.baseURL = 'http://api.weatherapi.com/v1';
  }

  async getForecast(location, days = 1, type = 'forecast', lang = 'en') {
    try {
      if (!location) {
        throw new Error('You should specify the location to get a forecast.');
      }
      const query = `${this.baseURL}/${type}.json?key=${this.apiKey}&q=${location}&days=${days}&aqi=no&alerts=no&tides=no&lang=${lang}`;
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(
          `Could not fetch from ${query} - received status ${response.status}`
        );
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  }
}
