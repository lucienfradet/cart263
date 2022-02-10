/**
FaceBeatLegro
Lucien Cusson-Fradet

The idea is to get input from the face of the user and allow him to be some kind
of living drumming machine

Things to do:
- Get the Face-Api working
- Program events that would play sounds:
  - eyes close
  - mouth Open
  - eyebrows raise
  - head tilt
    - 4 direction?
- Import and atach sounds to the events

-moreee...
*/

"use strict";

//Face-Api stuff
const detectionOptions = {
  withLandmarks: true,
  withDescription: false
};

let faceRec;
let result;
let video;

/**
Description of preload
*/
function preload() {
  faceRec = ml5.faceApi(detectionOptions);
}


/**
Description of setup
*/
function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.hide();
  console.log(faceRec);
}


/**
Description of draw()
*/
function draw() {
  background(0);
  faceRec.detect(video, (err, results) => {
    result = results;
  });

  //const flippedVideo = ml5.flipImage(video); //This don't work lol
  // const flippedVideo = ml5.flipImage(video);
  // image(flippedVideo, 0, 0, width, height);
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  pop();

  if (result !== undefined && result[0] !== undefined) {
    for (let i = 0; i < 6; i++) {
      let rightEye = result[0].parts.rightEye[i];
      console.log(rightEye);
      push();
      fill(255);
      stroke(255);
      strokeWeight(1);
      translate(video.width, 0);
      scale(-1, 1);
      ellipse(rightEye.x, rightEye.y, 3);
      pop();
    }
  }





}
