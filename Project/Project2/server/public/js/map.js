let map;

$('#createMap_button').on(`click`, createMap);

createMap();
async function createMap() {
  const options = {
    container: 'map', // container id
    style: 'mapbox://styles/lucienfradet/cl2cae7e3000e16rwp3mhtpcl', //stylesheet location
    center: [-73.560846, 45.527377], // starting position
    zoom: 10.7, // starting zoom
    maxZoom: 13
  }
  mapboxgl.accessToken = await getMapToken();
  //console.log(mapboxgl.accessToken);
  map = new mapboxgl.Map(options);

  map.on('load', function() {
    // disable map rotation using right click + drag
    map.dragRotate.disable();
    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    //create source and layers for the points on the map
    map.addSource('recipe', {
      type: 'geojson',
      data: {
        "type": "FeatureCollection",
        "features": []
      },
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    let circleRadiusViewPort = window.innerWidth * 2.5 / 100;
    map.addLayer({
      id: "recipe",
      type: "circle",
      source: "recipe",

      paint: {
        "circle-color": "#FFE0B0",
        "circle-stroke-width": 0,
        "circle-stroke-color": "white",
        "circle-opacity": 0.6,
        "circle-radius": circleRadiusViewPort

      }
    });


    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'recipe',
      filter: ['has', 'point_count'],
      paint: {
        "circle-color": "#FFE0B0",
        "circle-stroke-width": 0,
        "circle-stroke-color": "white",
        "circle-opacity": 0.6,
        "circle-radius": circleRadiusViewPort * 2
      }
    });

    map.on('click', 'recipe', (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'recipe', () => {
    map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'recipe', () => {
    map.getCanvas().style.cursor = '';
    });

    //Request data from the last 24h
    requestData(parseInt(inputQuery.value), 24*60*60*1000);
  });

  //resize the map with window resize
  window.addEventListener('resize', resizeMap);
  resizeMap();
}

function resizeMap() {
  if (deviceTypeDetect() !== "mobile") {
    if (window.innerWidth < 575) {
      $("#slider-container").removeClass("slider-container-big-screen");
      $("#slider-container").addClass("slider-container-small-screen");
    }
    else {
      $("#slider-container").removeClass("slider-container-small-screen");
      $("#slider-container").addClass("slider-container-big-screen");
    }
  }
  else {
    $("#slider-container").removeClass("slider-container-big-screen");
    $("#slider-container").addClass("slider-container-small-screen");
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


function displayDataOnMap(timeStamp) {
  let timeMin = timeStamp - 2*60*60*1000; //2 hours?
  const geojsonSource = map.getSource('recipe');

  //remove previsous sources
  geojsonSource.setData({
  "type": "FeatureCollection",
  "features": []
  });

  //array with the JSON data
  let arrayOfData = [];
  for (let i = 0; i < recipe.length; i++) {
    let recipeRawData = recipe[i];

    if (parseInt(recipeRawData.date) >= timeMin && parseInt(recipeRawData.date) <= timeStamp) {
      let description;
      if (language === 'fr') {
        description =
        `<p>
        <strong class="recipe-name">${recipeRawData.recipeName}</strong>
        <br>
        <strong>par: </strong>
        <span class="username">${recipeRawData.username}</span>
        <strong>description:</strong>
        <br>
        <span class="recipe-description">${recipeRawData.recipeDescription}</span>
        <br>
        <strong>recette:</strong>
        <span class="recipe-description">${recipeRawData.recipe}</span>
        </p>`;
      }
      else if (language === 'en') {
        description =
        `<p>
        <strong class="recipe-name">${recipeRawData.recipeName}</strong>
        <br>
        <strong>by: </strong>
        <span class="username">${recipeRawData.username}</span>
        <strong>Description:</strong>
        <br>
        <span class="recipe-description">${recipeRawData.recipeDescription}</span>
        <br>
        <strong>Recipe:</strong>
        <span class="recipe-description">${recipeRawData.recipe}</span>
        </p>`;
      }

      let data = {
          "type": "Feature",
          "properties": {
            'description': description
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              recipeRawData.location.long,
              recipeRawData.location.lat
            ]
          }
        }
      arrayOfData.push(data);
    }
  }

  //update the data on the map
  if (arrayOfData.length !== 0) {
    const geojsonSource = map.getSource('recipe');
    geojsonSource.setData({
    "type": "FeatureCollection",
    "features": arrayOfData
    });
  }
}
