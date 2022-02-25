class Loading extends State {
  constructor() {
    super();
    this.state = 'loadingImages'
    this.counter = 0;
    this.totalToLoad = loadImg.path.length + loadSnd.path.length;

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

  loadSounds(filePath, index) {
    loadSound(filePath, soundsLoaded);

    function soundsLoaded(son) {
      //console.log(filePath);
      snd[index] = son;
      state.counter++;
    }
  }

  update() {
    switch (this.state) {
      case 'loadingImages':
      if (this.counter === loadImg.path.length) {
        for (let i = 0; i < loadSnd.path.length; i++) {
          this.loadSounds(loadSnd.path[i] , i);
        }
        this.state = 'loadingSounds';
      }
      break;

      case 'loadingSounds':
      if (this.counter === this.totalToLoad) {
        this.state = 'dithering';
      }
      break;

      case 'dithering':
      createDithering();
      break;

      case 'over':
      state = new Intro();
      console.log(physics);
    }


  }

  display() {
    background(0)
    push();
    stroke(255);
    textSize(32);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    text(this.state, width/2, height/2)

    stroke(255);
    noFill();
    rect(width/2, height/2 + 50, 200, 20);

    let loadingRecPos = {
      x: width/2 - 200/2,
      y: height/2 + 50 - 20/2
    }
    noStroke();
    rectMode(CORNER);
    fill(255, 100);
    let w = (200 * this.counter) / this.totalToLoad;
    rect(loadingRecPos.x, loadingRecPos.y, w, 20);
    pop();
  }
}
