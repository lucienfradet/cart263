/**
Spy profile generator activity
Lucien Cusson-Fradet
*/

"use strict";
const DATA_NAME = 'spy-game-activity-datat';

let state;

let objectsData;
let religionData;
let scientistData;

let font = {
  yoster: undefined
}

let spyProfile = {
  realName: undefined,
  Alias: undefined,
  secretWeapon: undefined,
};

/**

*/
function preload() {
  font.yoster = loadFont('assets/fonts/yoster.ttf');

  objectsData = loadJSON('assets/data/objects.json');
  religionData = loadJSON('assets/data/religions.json');
  scientistData = loadJSON('assets/data/scientists.json');
}


/**

*/
function setup() {
  createCanvas(windowWidth, windowHeight);

  let data = localStorage.getItem(DATA_NAME);
  if (data != null) {
    state = new Game();
  }
  else {
    state = new Initialisation();
  }
}


/**

*/
function draw() {
  background(0);

  state.update();
  state.display();
}

function keyTyped() {
  state.keyTyped();
}

function keyPressed() {
  state.keyPressed();
}
