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
      $(".dot-pulse").hide();
      $("#geoloc-in-progress").hide();
      $("#geoloc-done").show();
      userPosition = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      }

      //fly to user location when the location is aquired
      map.flyTo({
        center: [
          userPosition.long,
          userPosition.lat
        ],
        zoom: 10.3,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });

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
