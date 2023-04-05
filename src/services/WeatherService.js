export default class WeatherService {
  constructor() {
    this.apiKey = '28b6f11cef9849dbb7b204519230304';
    this.baseURL = 'http://api.weatherapi.com/v1';
  }

  // TODO: create generic function for all fetch requests

  async getForecast(coords, days = 1) {
    try {
      const path = `${this.baseURL}/forecast.json?key=${this.apiKey}&q=${coords.lat},${coords.lng}&days=${days}&aqi=no&alerts=no`;
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(
          `Could not fetch from ${path} - received status ${response.status}`
        );
      }
      const data = await response.json();
      console.log('Data from forecast', data);
      return data;
    } catch (err) {
      console.error(`${err}`);
    }
  }
}
