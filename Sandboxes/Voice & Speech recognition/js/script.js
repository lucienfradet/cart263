/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";
//module aliases
let speak = responsiveVoice.speak;

let phrase = `hêy! mon estie!`;
let saying = ``;

/**
Description of preload
*/
function preload() {

}


/**
Description of setup
*/
function setup() {
  createCanvas(windowWidth, windowHeight);

  //setup annyang
  if (annyang) {
    let commands = {
      'hello': function () {
        alert(`hawdy you son of a b*tch!`);
      },
      'goodbye': function () {
        alert(`ciao bellllllla!`);
      }
    };
    annyang.addCommands(commands);
    annyang.start();
  }
}


/**
Description of draw()
*/
function draw() {
  background(0);

  push();
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text(saying, width/2, height/2);
  pop();
}

function mousePressed() {
  speak(phrase, `French Canadian Male`, {
    pitch: 2,
    rate: 0.2,
    volume: 1,
    onstart: showSaying,
    onend: hideSaying
  });
}

function showSaying() {
  saying = phrase;
}

function hideSaying() {
  saying = ``;
}
