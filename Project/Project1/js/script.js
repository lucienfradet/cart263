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
  OK make it possible to get objects in and out of the pop up

  work on the phone more:
  OK add cable with an outlet that can be connected if the power is turned on
  OK add dial and listenner (two buttons only!)
  OK add handset that can be picked up or put down
  KINDA add popup conversation window (same as map popup)

  Make it a game:
  OK add window with boat as timer
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

let loadImg = {
  array: [],
  path: [
    'assets/images/book.png',
    'assets/images/backgroundMain.png',
    'assets/images/mapCadre.png',
    'assets/images/phone.png',
    'assets/images/combine.png',
    'assets/images/bucket.png',
    'assets/images/window0.png',
    'assets/images/window1.png',
    'assets/images/window2.png',
    'assets/images/window3.png',
    'assets/images/window4.png',
    'assets/images/window5.png', //11
    'assets/images/ringTop.png', //12
    'assets/images/ropeHead.png',
    'assets/images/ropePiece.png',
    'assets/images/ringBottom.png', //15
    'assets/images/anker.png',
    'assets/images/phoneBooth.png', //17
    'assets/images/plugActive.png', //18
    'assets/images/plugInactive.png', //19
    'assets/images/shack.png',  //20
    'assets/images/postOfficeTest.png', //21
    'assets/images/mapColor.png', //22
    'assets/images/rat.png', //23
    'assets/images/outlet.png',
    'assets/images/hide.png'
  ]
}
let img = [];

let loadSnd = {
  path: [
    'assets/sounds/dialing.mp3', //0
    'assets/sounds/hangUp.mp3',
    'assets/sounds/jazz.mp3',
    'assets/sounds/openLine.mp3', //3
    'assets/sounds/pickedUp.mp3',
    'assets/sounds/plug.mp3',
    'assets/sounds/roomTone.mp3', //6
    'assets/sounds/sending.mp3'
  ]
}
let snd = [];



let risoBlack;

let state;
let physics;


//All of the dither function were designed to transform the original images into
//dithered version but the library slows down the frameRate to much so I'll
//dither the images manually instead
function toDither(img, threshold) {
  //clearRiso();
  let ditherType = 'bayer';
  let dithered = ditherImage(img, ditherType, threshold);
  risoBlack.image(dithered, 0, 0);
  //drawRiso();
  //exportRiso();

  return dithered;
}

function createDithering() {
  // risoBlack = new Riso('black', canvas.w, canvas.h);
  //
  // img.array[0] = toDither(loadImg.array[0], 75); //book
  // img.array[1] = toDither(loadImg.array[1], 35); //mainbackground
  // img.array[2] = toDither(loadImg.array[2], 80); //map
  // img.array[3] = toDither(loadImg.array[3], 75); //phone
  // img.array[4] = toDither(loadImg.array[4], 75); //combine
  state.state = 'over'; //skip to the next part
}


/**
Description of setup
*/
function setup() {
  canvas.obj = createCanvas(testCanvas.w, testCanvas.h);
  //Display testCanvas
  background(255);
  translate(testCanvas.w/2 - canvas.w/2, testCanvas.h/2 - canvas.h/2);
  //display real canvas
  // !! USE canvas.w instead of width !!
  push();
  fill(0);
  rect(0, 0, canvas.w, canvas.h);
  pop();

  state = new PressAnyKey();
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

function keyPressed() {
  state.keyPressed();
}
