/**
La grande séduction
Lucien Cusson-Fradet

Simulation/Escape Room game inspired by the movie
La grande séduction by Jean-François Pouliot
*/

"use strict";

//real CanvasSize
let testCanvas = {
  w: 1280,
  h: 720
}

//canvas of what the player can see 640/480px
let canvas = {
  obj: undefined,
  mouse: undefined,
  w: 720,
  h: 480
}

//array containing paths for loading images
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
    'assets/images/hide.png',
    'assets/images/mouth1.png', //26
    'assets/images/mouth2.png',
    'assets/images/mouth3.png',
    'assets/images/mouth4.png', //29
    'assets/images/leBoy.png',
    'assets/images/phoneCadre.png', //31
    'assets/images/tableau.png', //32
    'assets/images/hospitalWorker.png' //33
  ]
}
let img = [];

//Arrays containing paths to load sounds
let loadSnd = {
  path: [
    'assets/sounds/dialing.mp3', //0
    'assets/sounds/hangUp.mp3',
    'assets/sounds/jazz.mp3',
    'assets/sounds/openLine.mp3', //3
    'assets/sounds/pickedUp.mp3',
    'assets/sounds/plug.mp3',
    'assets/sounds/roomTone.mp3', //6
    'assets/sounds/sending.mp3',  //7
    'assets/sounds/entering.mp3', //8
    'assets/sounds/intro.mp3', //9
    'assets/sounds/phoneNotHappy.mp3', //10
    'assets/sounds/phoneHappy.mp3', //11
    'assets/sounds/phoneAttente.mp3', //12
    'assets/sounds/bird.mp3', //13
    'assets/sounds/break.mp3', //14
    'assets/sounds/yes.mp3',
    'assets/sounds/bells.wav',
    'assets/sounds/boat.mp3'
  ]
}
let snd = [];

//Variable for the riso library
let risoBlack;

//state of the game
let state;

//matter.js physics engine
let physics;


//dither function designed to transform the original images into a dithered version
//but the library slows down the frameRate to much.
//Images will be dithered manually
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
creates canvas
*/
function setup() {
  canvas.obj = createCanvas(testCanvas.w, testCanvas.h);
  //Display testCanvas
  background(255);
  translate(testCanvas.w/2 - canvas.w/2, testCanvas.h/2 - canvas.h/2);
  // !! USE canvas.w instead of width !!

  state = new PressAnyKey();
}

/**
updates and displays the state
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
