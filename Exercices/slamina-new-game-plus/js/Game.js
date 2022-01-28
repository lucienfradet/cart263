class Game extends State {
  constructor() {
    super();
    this.reset = false;
    this.counter = 0;
    this.rightAnswers = 0;
    this.voyons;

    animal = new Animaux();
  }

  update() {
    displayIntructions();
    this.displayPoints();
    this.recommence();

    if (this.reset) {
      this.counter++;
    }

    push();
    if (essai === animal.selection) {
      fill(0, 255, 0);
      if (!this.reset) {
        snd.ding.play();
        this.rightAnswers++;
      }
      this.reset = true;
    }
    else {
      fill(255, 0, 0);
      if (!this.textDisplay && essai !== '') {
        this.voyons = new Discouragements();
        speak(this.voyons.selection, "French Canadian Male");
      }
    }
    textSize(32);
    textAlign(CENTER, CENTER);
    textFont(font.yoster);
    text(essai, width/2, height/2);
    this.textDisplay = true;
    pop();
  }

  sayTheName() {
    speak(animal.reverse, "French Canadian Male");
  }

  displayPoints() {
    push();
    fill(255);
    textSize(32);
    textAlign();
    textFont(font.yoster);
    text("Bonne réponses: " + this.rightAnswers, 50, height - height/10);
    pop();
  }

  recommence() {
    if (this.counter > 150 && this.reset) {
      this.reset = false;
      this.counter = 0;
      essai = '';
      animal = new Animaux();
    }

  }

  keyPressed() {
    if (keyCode !== 80) {
      this.sayTheName();
    }
    else {
      animal = new Animaux();
      this.sayTheName();
    }
  }
}
