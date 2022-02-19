/**
La grande séduction
Lucien Cusson-Fradet

Things ToDo:
  OK Get the physics running
  OK add walls
  OK add book
  OK Add mouse constraints
  - Do I need to constrain the mouse constrain?
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

  Bonus:
  - Cloth over the window
*/

"use strict";

let testCanvas = {
  w: 1280,
  h: 720
}
//true canvas 640/480px
let canvas = {
  obj: undefined,
  mouse: undefined,
  w: 720,
  h: 480
}

let img = {
  book: undefined,
}

let state;
let physics;

/**
Description of preload
*/
function preload() {
  img.book = loadImage('assets/images/placeHolders/book.png');
}


/**
Description of setup
*/
function setup() {
  canvas.obj = createCanvas(testCanvas.w, testCanvas.h);
  //Display testCanvas
  background(100);
  translate(testCanvas.w/2 - canvas.w/2, testCanvas.h/2 - canvas.h/2);
  //display real canvas
  // !! USE canvas.w instead of width !!
  push();
  fill(0);
  rect(0, 0, canvas.w, canvas.h);
  pop();

  state = new Game();
}


/**
Description of draw()
*/
function draw() {
  state.update();
  state.display();
}

function createPhysics() {
  //CreateWorld
  physics = new Physics();
  physics.runWorld();
}

function mousePressed() {
  state.mousePressed();
}
