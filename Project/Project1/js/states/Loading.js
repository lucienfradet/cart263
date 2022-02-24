class Loading extends State {
  constructor() {
    super();
    this.state = 'loadingImages'
    this.counter = 0;
    this.totalToLoad = loadImg.path.length;

    for (let i = 0; i < loadImg.path.length; i++) {
      this.loadImages(loadImg.path[i] , i);
    }
  }

  loadImages(filePath, index) {
    loadImage(filePath, imagesLoaded);

    function imagesLoaded(cliché) {
      //console.log(filePath);
      img[index] = cliché;
      state.counter++;
    }
  }

  update() {
    console.log(this.state);
    switch (this.state) {
      case 'loadingImages':
      if (this.counter === this.totalToLoad) {
        this.state = 'dithering';
      }
      break;

      case 'dithering':
      createDithering();
      break;

      case 'over':
      state = new Game();
      console.log(physics);
    }


  }

  display() {
    background(0)
    push();
    stroke(255);
    textSize(32);
    text(this.state, canvas.w/2, canvas.h/2)

    stroke(255);
    noFill();
    rect(canvas.w/2, canvas.h/2 + 50, 200, 20);

    noStroke();
    fill(255, 100);
    let w = (200 * this.counter) / this.totalToLoad;
    rect(canvas.w/2, canvas.h/2 + 50, w, 20);
    pop();
  }
}
