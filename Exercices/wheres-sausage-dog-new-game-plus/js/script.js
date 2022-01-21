/**
Where's Waldo type game
Lucien Cusson-Fradet

From a city generator, to a terrain generator, to some kind of minecraft digging simulator, the concept of this little program kept on changing as difficulties arose.
You control a purple sphere with the mouse in a 3D environement. When the left mouse button is down, you can remove parts of the terrain.
The idea is to free the clown hidden in the soil.
Once the clown is free and, after some time, the game restarts and the map get's bigger.

I took on a little bit too much with this exercice. Maybe I should've started from the activity like indicated instead of doing something entirely new and different.
In the end I still think I managed to create something fresh, original and visually apealing with which I'm relativly happy.
Appologies again for the late submission, I'll start earlier next time!
*/

"use strict";

const canvas = {
  w: 800,
  h: 600
};

let citySize = 10;
let city;
let selector;
let treasure;


/**
  - global variables for sound and images
  - function loading assets into the cache before the program executes
*/
let img = {
  clown: undefined
}

function preload() {
  img.clown = loadImage('assets/images/clown.png');
}

/**
  Creates canvas and objects as well as basic parameters for the program
*/
function setup() {
  createCanvas(canvas.w, canvas.h, WEBGL);
  background(0);
  noCursor();


  city = new City(citySize);
  selector = new Selector();
  treasure = new Treasure();
}


/**
  Displays the city terrain, the mouse object and the treasure
*/
function draw() {
  background(0);
  city.adjustFrame(); //Arbitrary spot for the city in the 3D environment

  for (let i = 0; i < city.buildings.length; i++) {
    let build = city.buildings[i];
    build.display();
    build.update();

    //if the selector is activated, kills buildings that are under it
    if (mouseIsPressed && selector.selected === i) {
      build.dead = true;
    }
  }

  selector.display();
  selector.update();
  treasure.display();
  if (!treasure.isFree) {
    treasure.checkCollision();
  }
  else {
    treasure.freedom();
  }
}

//Sets the initial position of the shaking buildings so they can return to that position when the mouse is released
function mousePressed() {
  for (let i = 0; i < city.buildings.length; i++) {
    city.buildings[i].mousePressed();
  }
}

//Loads the next terrain/city
function resetCity() {
  citySize += 10;
  city = new City(citySize);
  selector = new Selector();
  treasure = new Treasure();
}
