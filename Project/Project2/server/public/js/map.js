

function createMap() {
  const options = {
    lat: 0,
    lng: 0,
    zoom: 4,
    studio: true,
    //style: 'mapbox.dark' //streets, outdoors, light, dark, satellite (for nonstudio)
    style: 'mapbox://styles/mapbox/traffic-night-v2'
  };

  //create map instance
  const mapToken = getMapToken();
  const mappa = new Mappa('Mapbox', mapToken);
  let myMap;

  let canvas;

  function setup() {
    canvas = createCanvas(800, 700);

    // Create a tile map and overlay the canvas on top.
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);

    // Only redraw the meteorites when the map change and not every frame.
    //myMap.onChange();

    fill(109, 255, 0);
    stroke(100);
  }
}

async function getMapToken() {
  try {
    const response = await fetch('/getToken'); //await the response

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json(); //await for the result
    return result.token; //return the token

    //array with the required data
    return result.docs
  }
  catch (error) {
    console.log(error);
  }
}
