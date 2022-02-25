//Intro of the game

class Intro extends State {
  constructor() {
    super();
    this.state = '';
    this.leBoy = {
      img: img[30],
      x: width/2,
      y: height/2,
      w: 500,
    }

    this.entering = snd[8];
    this.intro = snd[9]
    this.entering.play();
  }

  //switches the intro.state
  update() {
    if (!this.entering.isPlaying()) {
      if (this.state === '') {
        this.intro.play();
        this.state = 'intro';
        this.mouth = new Mouth({
          x: this.leBoy.x + 5,
          y: this.leBoy.y - 40,
          w: 75,
          angle: 10
        })
      }

      if (!this.intro.isPlaying()) {
        state = new Game();
      }
    }
  }

  display() {
    background(0);

    //only display when the guy is talking
    if (this.state === 'intro') {
      push();
      rectMode(CENTER);
      imageMode(CENTER);
      noStroke();
      fill(255, 200);
      translate(this.leBoy.x, this.leBoy.y);

      rect(0, 0, this.leBoy.w, this.leBoy.w);
      image(this.leBoy.img, 0, 0, this.leBoy.w, this.leBoy.w);
      pop();

      this.mouth.display();
    }
  }

  //allows to skip the sequence
  mousePressed() {
    if (this.state === '') {
      this.entering.stop();
    }
    if (this.state === 'intro') {
      this.intro.stop();
    }
  }

  keyPressed() {
    this.mousePressed();
  }
}
