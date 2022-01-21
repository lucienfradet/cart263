/**
Where's Waldo type game

Lucien Cusson-Fradet
*/

"use strict";

let canvas = {
  w: 800,
  h: 600
};

let city;
let selector;

/**

*/
function preload() {

}


/**

*/
function setup() {
  createCanvas(canvas.w, canvas.h, WEBGL);
  background(0);
  noCursor();

  city = new City();
  selector = new Selector();

}


/**
Description of draw()
*/
function draw() {
  background(0);
  city.adjustFrame();

  for (let i = 0; i < city.buildings.length; i++) {
    city.buildings[i].display();
  }

  selector.display();
  selector.update();
}
