//Geolocation functions!

//check if geolocation is available on the browser
let userPosition;

function geoLocalize() {
  if ('geolocation' in navigator) {
    console.log('geolocation available');
    const options = {
      //WE GOT NO MORE OPTIONS
    }

    navigator.geolocation.getCurrentPosition(position => {
      userPosition = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      }
    }, (error) => {
      throw new Error(`Error! status: ${error}`);
    }, options);

  } else {
    console.log('geolocation not available');
  }
}

//code was taken somewhere a while back (sorry for my terrible sourcing job)
//Handling errors
// Request repeated updates.
const watchId = navigator.geolocation.watchPosition(
  scrollMap, handleError
);

function scrollMap(position) {
  const { latitude, longitude } = position.coords;
  // Scroll map to latitude / longitude.
}

function handleError(error) {
  // Display error based on the error code.
  const { code } = error;
  switch (code) {
    case GeolocationPositionError.TIMEOUT:
      // Handle timeout.
      break;
    case GeolocationPositionError.PERMISSION_DENIED:
      // User denied the request.
      console.log('geolocation permission denied')
      break;
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      // Position not available.
      break;
  }
}
