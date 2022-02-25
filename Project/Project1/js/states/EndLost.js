class EndLost extends State {
  constructor() {
    super();
    this.delay = 0;
  }

  update() {
    this.delay++
  }

  display() {
    background(0);
    push();
    textAlign(CENTER, CENTER);
    stroke(255);
    textSize(24);
    text(`T'as ramené toute le village dans l'église alors que t'avais pas réussi la mission...`, width/2, height/2);
    text('Appuyez sur une touche pour recommencer', width/2, height/2 + 50);
    pop();
  }

  mousePressed() {
    if (this.delay > 2 * 60) {
      state = new Game();
    }
  }

  keyPressed() {
    this.mousePressed();
  }
}
