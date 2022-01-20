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

/**

*/
function preload() {

}


/**

*/
function setup() {
  createCanvas(canvas.w, canvas.h, WEBGL);
  background(0);

  city = new City();

}


/**
Description of draw()
*/
function draw() {
  city.adjustFrame();
  for (let i = 0; i < city.buildings.length; i++) {
    city.buildings[i].display();
  }
}
