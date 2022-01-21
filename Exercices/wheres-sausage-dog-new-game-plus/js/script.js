/**
Where's Waldo type game

Lucien Cusson-Fradet
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

let img = {
  clown: undefined
}

function preload() {
  img.clown = loadImage('assets/images/clown.png');
}

/**

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

*/
function draw() {
  background(0);
  city.adjustFrame();

  for (let i = 0; i < city.buildings.length; i++) {
    let build = city.buildings[i];
    build.display();
    build.update();

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

function mousePressed() {
  for (let i = 0; i < city.buildings.length; i++) {
    city.buildings[i].mousePressed();
  }
}

function resetCity() {
  citySize += 10;
  city = new City(citySize);
  selector = new Selector();
  treasure = new Treasure();
}
