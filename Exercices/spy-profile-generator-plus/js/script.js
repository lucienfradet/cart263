/**
Spy profile generator exercice
Lucien Cusson-Fradet

Improved the activity a little but. (list of things I did below)
I wished I could take the time to change the visuals but still, I enjoyed focusing on developping the login system a little more.

*These were implemented while doing the activity*
- added more engaging password system
- added combination of data for the spy Alias
- added the ability to delete the profile using the NUMPAD 9 key

- add better visuals :(
- add multiple profiles OK
- allow for the weapon description to be displayed on clic OK
- ask for name and password OK
*/

"use strict";
const DATA_NAME = 'spy-game-exercice-data';

let state;

//Data, should really be in a object
let objectsData;
let religionData;
let scientistData;

let font = {
  yoster: undefined
}

let spyProfiles = [];

//spyProfile currently in use
let spyProfile = {
  realName: undefined,
  Alias: undefined,
  secretWeapon: undefined,
  weaponDescription: undefined,
  password: undefined
};

/**
loads data and fonts
*/
function preload() {
  font.yoster = loadFont('assets/fonts/yoster.ttf');

  objectsData = loadJSON('assets/data/objects.json');
  religionData = loadJSON('assets/data/religions.json');
  scientistData = loadJSON('assets/data/scientists.json');
}


/**
Fetch the data and set the login screen state
*/
function setup() {
  createCanvas(windowWidth, windowHeight);

  spyProfiles = JSON.parse(localStorage.getItem(DATA_NAME));
  console.log(spyProfiles);
  state = new Initialisation();
}


/**
updates the state
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
  if (keyCode === 105) { //This erases the data
    localStorage.removeItem(DATA_NAME);
  }
  state.keyPressed();
}

//Function that prompts the user to enter his password and only breaks if the password is right
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

function mousePressed() {
  state.mousePressed();
}
