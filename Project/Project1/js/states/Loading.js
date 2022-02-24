class Loading extends State {
  constructor() {
    super();
    this.state = 'loadingImages'
    this.counter = 0;
    this.totalToLoad = loadImg.path.length;
  }

  loadImages(filePath) {
    loadImage(filePath, imagesLoaded);

    function imagesLoaded(img) {
      //console.log(filePath);
      loadImg.array.push(img)
      state.counter++;
    }
  }

  update() {
    switch (this.state) {
      case 'loadingImages':
      for (let i = 0; i < loadImg.path.length; i++) {
        this.loadImages(loadImg.path[i]);
      }
      break;

      case 'dithering':
      createDithering();
      break;

      case 'over':
      state = new Game();
      console.log(physics);
    }

    if (this.counter === loadImg.path.length) {
      this.state = 'dithering';
    }
  }

  display() {
    background(0)
    push();
    stroke(255);
    textSize(32);
    text(this.state, width/2, height/2)

    stroke(255);
    noFill();
    rect(width/2, height/2 + 50, 200, 20);

    noStroke();
    fill(255, 100);
    let w = (200 * this.counter) / this.totalToLoad;
    rect(width/2, height/2 + 50, w, 20);
    pop();
  }
}
