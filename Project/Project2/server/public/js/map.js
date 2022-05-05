//Function using the MapBox map API

let map;
let popup;

//create the map
createMap();
async function createMap() {
  const options = {
    container: 'map', // container id
    style: 'mapbox://styles/lucienfradet/cl2cae7e3000e16rwp3mhtpcl', //stylesheet location
    center: [-69.591943, 52.042068], // starting position
    zoom: 4, // starting zoom
    maxZoom: 13
  }
  mapboxgl.accessToken = await getMapToken();

  map = new mapboxgl.Map(options);

  //Executes when the map is loaded (DUUUUUUUUH)
  map.on('load', async function() {
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

    let circleRadiusViewPort = window.innerWidth * 2.5 / 100; //convert px to vw
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

    //code following a MapBox example. Generates popup windows
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

    const options = {
      maxWidth: '80vw'
    }
    if (description !== undefined) {
      popup = new mapboxgl.Popup(options)
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
    }

    //attributes ids to the popup window for CSS customization
    $(".mapboxgl-popup-content").attr("id", "active-popup");
    $(".mapboxgl-popup-tip").attr("id", "active-popup-tip");
    });

    //Zooms on clustered points
    //There seems to be not function to spread points that are to close to each other.
    //The map zoom max level is quite unzoomed because of the desire to keep user location private
    //This can create problem if more than one entry is created at the same location :(
    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('recipe').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom + 1
          });
        }
      );
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'recipe', () => {
    map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'recipe', () => {
    map.getCanvas().style.cursor = '';

    map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
    });
    });

    //Request data from the last 24h
    await requestData(parseInt(rangeInputQuery.value), 24*60*60*1000);
    displayDataOnMap(
      parseInt(
        rangeInputQuery.value
      )
    );
  });

  //resize the map with window resize
  window.addEventListener('resize', resizeMap);
  resizeMap();
}

//resize map!
function resizeMap() {
  //Displays the slider differently for tablets and desktops...
  //in the end, there's only this feature and not much more to make the experience pleasing on the big screen
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

//I thought about using a private map token and ended up using a public one.
//This wouldn't have been that much more safe either lol
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

//Display date... on the map! (dammn)
function displayDataOnMap(timeStamp) {
  if (recipe) {
    let timeMin = timeStamp - 2*60*60*1000; //2 hours? yeah it's good
    const geojsonSource = map.getSource('recipe');

    //data is stored in the map as JSON features
    //remove previsous sources
    geojsonSource.setData({
    "type": "FeatureCollection",
    "features": []
    });

    //array with the JSON data
    let arrayOfData = [];
    for (let i = 0; i < recipe.length; i++) {
      let recipeRawData = recipe[i];

      //deal with data disparities like french/english or no recipe provided
      if (parseInt(recipeRawData.date) >= timeMin && parseInt(recipeRawData.date) <= timeStamp) {
        let description;
        if (recipeRawData.recipe === undefined) {
          //no recipe
          if (language === 'fr') {
            description =
            `<p>
            <strong class="recipe-name">${recipeRawData.recipeName}</strong>
            <br>
            <strong id="subtitle-popup">Auteur: </strong>
            <span class="username">${recipeRawData.username}</span>
            <br>
            <br>
            <strong id="subtitle-popup">Commentaire:</strong>
            <br>
            <span class="recipe-description">${recipeRawData.recipeDescription}</span>
            </p>`;
          }
          else if (language === 'en') {
            description =
            `<p>
            <strong class="recipe-name">${recipeRawData.recipeName}</strong>
            <br>
            <strong id="subtitle-popup">Author: </strong>
            <span class="username">${recipeRawData.username}</span>
            <br>
            <br>
            <strong id="subtitle-popup">Comment:</strong>
            <br>
            <span class="recipe-description">${recipeRawData.recipeDescription}</span>
            </p>`;
          }
        } else {
          // with recipe
          if (language === 'fr') {
            description =
            `<p>
            <strong class="recipe-name">${recipeRawData.recipeName}</strong>
            <br>
            <strong id="subtitle-popup">Auteur: </strong>
            <span class="username">${recipeRawData.username}</span>
            <br>
            <br>
            <strong id="subtitle-popup">Commentaire:</strong>
            <br>
            <span class="recipe-description">${recipeRawData.recipeDescription}</span>
            <br>
            <br>
            <strong id="subtitle-popup">Recette:</strong>
            <br>
            <span class="recipe-description">${recipeRawData.recipe}</span>
            </p>`;
          }
          else if (language === 'en') {
            description =
            `<p>
            <strong class="recipe-name">${recipeRawData.recipeName}</strong>
            <br>
            <strong id="subtitle-popup">Author: </strong>
            <span class="username">${recipeRawData.username}</span>
            <br>
            <br>
            <strong id="subtitle-popup">Comment:</strong>
            <br>
            <span class="recipe-description">${recipeRawData.recipeDescription}</span>
            <br>
            <br>
            <strong id="subtitle-popup">Recipe:</strong>
            <br>
            <span class="recipe-description">${recipeRawData.recipe}</span>
            </p>`;
          }
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
}
