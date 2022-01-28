//Deals with the first interaction on the program

class FirstInteraction extends State {
  constructor() {
    super();
  }

  update() {
    push();
    fill(255);
    textSize(32);
    textFont(font.yoster);
    textAlign(CENTER, CENTER);
    text("appuyez sur une touche", width/2, height/2);
    pop();
  }

  keyPressed() {
    speak(`Quand tu appuies sur une touche, le nom d'un animal est dicté à l'envers. Écoute comme du monde, prend le temps qu'y faudra pis quand t'es prêt, dit: "Je pense que c'est un,une. puis le nom de l'animal" dans ton micro!`, "French Canadian Male");
    state = new Game;
  }
}
