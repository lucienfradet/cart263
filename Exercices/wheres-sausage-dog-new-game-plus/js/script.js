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
function setup() {
  createCanvas(canvas.w, canvas.h, WEBGL);
  background(0);
  noCursor();

  city = new City();
  selector = new Selector();

}


/**

*/
function draw() {
  background(0);
  city.adjustFrame();

  for (let i = 0; i < city.buildings.length; i++) {
    city.buildings[i].display();
    city.buildings[i].update();

    if (mouseIsPressed && selector.selected === i) {
      city.buildings[i].dead = true;
    }
  }

  selector.display();
  selector.update();
}

function mousePressed() {
  for (let i = 0; i < city.buildings.length; i++) {
    city.buildings[i].mousePressed();
  }
}
