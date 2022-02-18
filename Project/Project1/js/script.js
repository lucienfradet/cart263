/**
La grande séduction
Lucien Cusson-Fradet

Things ToDo:
  OK Get the physics running
  OK add walls
  OK add book
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
let mConstraint;

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


  //display mConstraint for testing
  push();
  let pos = {
    x: mConstraint.mouse.position.x,
    y: mConstraint.mouse.position.y
  }
  fill(255,255,255,150);
  noStroke();
  ellipseMode(CENTER);
  ellipse(pos.x, pos.y, 10);
  pop();
}

function createPhysics() {
  //CreateWorld
  physics = new Physics();
  physics.runWorld();

  //Create MouseConstraint
  canvas.mouse = Mouse.create(canvas.obj.elt); //canvas element in the P5.js canvas wrapper
  canvas.mouse.pixelRatio = pixelDensity(); //Adapt to the pixel density of the screen in use
  let options = {
    mouse: canvas.mouse
  }
  mConstraint = MouseConstraint.create(physics.engine, options);
  Composite.add(physics.world, mConstraint);
  //Adjust the offset cause by the canvasTest fuckery
  mConstraint.mouse.offset.x = -testCanvas.w/2 + canvas.w/2;
  mConstraint.mouse.offset.y = -testCanvas.h/2 + canvas.h/2;
  console.log(mConstraint);
}

function mousePressed() {
  state.mousePressed();
}
