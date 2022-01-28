class Game extends State {
  constructor() {
    super();
    this.reset = false;
    this.counter = 0;

    animal = new Animaux();
  }

  update() {
    displayIntructions();

    if (this.reset) {
      this.counter++;
    }
    this.recommence();

    push();
    if (essai === animal.selection) {
      fill(0, 255, 0);
      if (!this.reset) {
        snd.ding.play();
      }
      this.reset = true;
    }
    else {
      fill(255, 0, 0);
    }
    textSize(32);
    textAlign(CENTER, CENTER);
    text(essai, width/2, height/2);
    pop();
  }

  sayTheName() {
    speak(animal.reverse, "French Canadian Male");
  }

  recommence() {
    if (this.counter > 150) {
      this.reset = false;
      this.counter = 0;
      essai = '';
      animal = new Animaux();
    }

  }

  keyPressed() {
    this.sayTheName();
  }
}
