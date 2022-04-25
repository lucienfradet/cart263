let map;

$('#createMap_button').on(`click`, createMap);

createMap();
async function createMap() {
  const options = {
    container: 'map', // container id
    style: 'mapbox://styles/lucienfradet/cl2cae7e3000e16rwp3mhtpcl', //stylesheet location
    center: [-73.644666, 45.555852], // starting position
    zoom: 10, // starting zoom
    maxZoom: 12.5
  }
  mapboxgl.accessToken = await getMapToken();
  //console.log(mapboxgl.accessToken);
  map = new mapboxgl.Map(options);

  map.on('load', function() {
    // disable map rotation using right click + drag
    map.dragRotate.disable();
    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    //Request data from the last 24h
    requestData(parseInt(inputQuery.value), 24*60*60*1000);

    // map.addLayer({
    //   'id': 'places',
    //   'type': 'symbol',
    //   'source': 'places',
    //   'layout': {
    //     'icon-image': '{icon}',
    //     'icon-allow-overlap': true
    //   }
    // });
  });

  //resize the map with window resize
  window.addEventListener('resize', resizeMap);
  resizeMap();
}

function resizeMap() {
  if (window.innerWidth < 575) {
    $("#slider-container").removeClass("slider-container-big-screen");
    $("#slider-container").addClass("slider-container-small-screen");
  }
  else {
    $("#slider-container").removeClass("slider-container-small-screen");
    $("#slider-container").addClass("slider-container-big-screen");
  }

  $('#map').css('width', window.innerWidth.toString() + 'px');
  $('#map').css('height', window.innerHeight.toString() + 'px');
  map.resize();
}

async function getMapToken() {
  try {
    const response = await fetch('/getToken'); //await the response

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json(); //await for the result
    return result.token; //return the token
  }
  catch (error) {
    console.log(error);
  }
}

let activeSourcesIDs = [];
function displayDataOnMap(timeStamp) {
  let timeMin = timeStamp - 2*60*60*1000; //2 hours?

  //remove previsous sources
  for (let i = 0; i < activeSourcesIDs.length; i++) {
    map.removeSource(activeSourcesIDs[i]);
  }
  activeSourcesIDs = [];

  for (let i = 0; i < recipe.length; i++) {
    let recipeRawData = recipe[i];

    if (parseInt(recipeRawData.date) >= timeMin && parseInt(recipeRawData.date) <= timeStamp) {
      activeSourcesIDs.push(recipeRawData._id);
      map.addSource(recipeRawData._id, {
        type: 'geojson',
        data: {
          "type": "FeatureCollection",
          "features": [{
            "type": "Feature",
            "properties": {
              'icon': 'theatre-15'
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                recipeRawData.location.long,
                recipeRawData.location.lat
              ]
            }
          }]
        }
      });
    }
  }
}
