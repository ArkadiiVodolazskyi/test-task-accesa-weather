export default class GeolocationService {
  constructor() {}

  getGeoSuccess(position) {
    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      acc: position.coords.accuracy,
      timestamp: position.timestamp,
    };
    localStorage.setItem('currentLocation', JSON.stringify(location));
    console.info(`Location has been cached.`);
    return location;
  }

  getGeoFail(err) {
    if (err.code === 1) {
      alert('Please, allow using your geoposition.');
    }
  }

  getLocation(successCallback, failCallback = this.getGeoFail) {
    navigator.geolocation.getCurrentPosition(successCallback, failCallback, {
      enableHighAccuracy: false,
      timeout: 3000,
      maximumAge: 1000 * 60 * 5,
    });
  }
}
