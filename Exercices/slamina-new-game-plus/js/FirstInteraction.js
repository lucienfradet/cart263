class FirstInteraction extends State {
  constructor() {
    super();
  }

  update() {
    push();
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("appuyez sur une touche", width/2, height/2);
    pop();
  }

  keyPressed() {
    state = new Game;
  }
}
