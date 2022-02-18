/**
La grande séduction
Lucien Cusson-Fradet

Things ToDo:
  - Get the physics running
  - add book
  - Add mouse constraints
  - add tableau
  - add basic phone
  - add debris

  - add map with rope that you can get down
  - add clickable buildings on map
  - add popup windows with physics inside
  - make it possible to get objects in and out of the pop up

  work on the phone more:
  - add cable
  - add dial and listenner
  - add handset that can be picked up or put down
  - add popup conversation window (same as map popup)

  Make it a game:
  - add window with boat as timer
  - work on the chain of events
*/

"use strict";

let testCanvas = {
  w: 1280,
  h: 720
}
//true canvas 640/480px
let canvas = {
  w: 720,
  h: 480
}

let state;

/**
Description of preload
*/
function preload() {

}


/**
Description of setup
*/
function setup() {
  createCanvas(testCanvas.w, testCanvas.h);
  //Display testCanvas
  background(100);
  //display real canvas
  // !! USE canvas.w instead of width !!
  fill(0);
  rectMode(CENTER);
  rect(testCanvas.w/2, testCanvas.h/2, canvas.w, canvas.h);

  state = new Game();
}


/**
Description of draw()
*/
function draw() {
  state.update();
}

function mousePressed() {
  state.mousePressed();
}
