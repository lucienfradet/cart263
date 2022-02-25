//get input from the player

class PressAnyKey extends State {
  constructor() {
    super();
  }

  display() {
    background(0)
    push();
    stroke(255);
    textSize(32);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    text('Press Any Key', width/2, height/2)
    pop();
  }

  keyPressed() {
    state = new Loading();
  }

  mousePressed() {
    state = new Loading();
  }
}
