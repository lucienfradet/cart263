/**
Spy profile generator exercice
Lucien Cusson-Fradet

*These were implemented while doing the activity*
- added more engaging password system
- added combination of data for the spy Alias
- added the ability to delete the profile using the NUMPAD 9 key

- add better visuals
- add multiple profiles
- allow for the weapon description to be displayed on clic
- ask for name and password 
*/

"use strict";
const DATA_NAME = 'spy-game-exercice-data';

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
  weaponDescription: undefined,
  password: undefined
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

  let loadedDataString = localStorage.getItem(DATA_NAME);
  if (loadedDataString != null) {
    spyProfile = JSON.parse(loadedDataString);
    if (checkPassword()) {
      state = new Game();
    }
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
  if (keyCode === 105) {
    localStorage.removeItem(DATA_NAME);
  }
  state.keyPressed();
}

function checkPassword() {
  while (true) {
    let password = prompt("Entrez votre mot de passe");
    if (password === spyProfile.password) {
      return true;
    }
    else {
      alert('Mot de passe incorrect');
    }
  }
}
