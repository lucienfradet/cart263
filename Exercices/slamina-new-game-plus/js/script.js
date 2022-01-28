/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";
//module aliases
let speak = responsiveVoice.speak;

let snd = {
  ding: undefined
}

let font = {
  yoster: undefined
}

let img = {
  face1: undefined,
  face2: undefined,
  face3: undefined,
  face4: undefined,
  mouth1: undefined,
  mouth2: undefined,
  mouth3: undefined,
  mouth4: undefined
}

let state;

let animal = undefined;
let essai = '';

/**
Description of preload
*/
function preload() {
  img.face1 = loadImage('assets/images/face1.png');
  img.face2 = loadImage('assets/images/face2.png');
  img.face3 = loadImage('assets/images/face3.png');
  img.face4 = loadImage('assets/images/face4.png');
  img.mouth1 = loadImage('assets/images/mouth1.png');
  img.mouth2 = loadImage('assets/images/mouth2.png');
  img.mouth3 = loadImage('assets/images/mouth3.png');
  img.mouth4 = loadImage('assets/images/mouth4.png');
  snd.ding = loadSound('assets/sounds/ding.wav');
  font.yoster = loadFont('assets/fonts/yoster.ttf');
}


/**
Description of setup
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  if (annyang) {
    let commands = {
      "Je pense que c'est un *devinette": devinetteAnimal,
      "Je pense que c'est une *devinette": devinetteAnimal
    };
    annyang.addCommands(commands);
    annyang.setLanguage('fr-FR');
    annyang.start();
  }
  else {
    alert(`Big, t'es sur Internet Explorer ou quoi!?`)
  }
  state = new FirstInteraction();
}


/**
Description of draw()
*/
function draw() {
  background(0);
  state.update();
}

function displayIntructions() {
  push();
  fill(255);
  textSize(32);
  textFont(font.yoster);
  textAlign();
  text(`Quand tu appuies sur une touche,
le nom d'un animal est dicté à l'envers.
Écoute comme du monde,
prend le temps qu'y faudra pis quand t'es prêt,
dit: "Je pense que c'est un,une ..." dans ton micro!

Appuies sur "p" pour passer au prochain animal :O`, 50, height/12);
  pop();
}

function devinetteAnimal(devinette) {
  state.textDisplay = false;
  let guess = devinette.toLowerCase();
  essai = guess;
  console.log(essai);
}

function reverseString(str) {
  let splitString = str.split("");
  let reverseArray = splitString.reverse();
  return reverseArray.join("");
}

function keyPressed() {
  state.keyPressed();
}
