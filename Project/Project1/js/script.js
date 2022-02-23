/**
La grande séduction
Lucien Cusson-Fradet

Things ToDo:
  OK Get the physics running
  OK add walls
  OK add book
  OK Add mouse constraints
  NO Do I need to constrain the mouse constrain?
  - add tableau
  OK add basic phone
  - add debris

  OK add map with rope that you can get down
  OK add clickable buildings on map
  OK add popup windows with physics inside
  - make it possible to get objects in and out of the pop up

  work on the phone more:
  - add cable with an outlet that can be connected if the power is turned on
  - add dial and listenner (two buttons only!)
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

//collision categories (collisionFilter uses these damned bitmasks...)
let defaultCategory = 0x0001, //walls and unspesefied bodies
    backCategory = 0x0002, //background
    poiCategory = 0x0004, //point of interest windows
    phoneCategory = 0x0008; //telephone windows

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
  console.log(physics);

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
