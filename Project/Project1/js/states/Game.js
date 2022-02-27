//Game class
//The whole game happens here

class Game extends State {
  constructor() {
    super();
    //stop ALL sounds lol
    for (let i = 0; i < snd.length; i++) {
      snd[i].stop();
    }

    //background
    this.background = undefined;
    this.timer = new Timer;
    this.generalDelay = 0;

    createPhysics();

    //Create walls
    this.walls = [];
    let wallSize = 75;

    let bottomWall = {
      name: 'bottomWall',
      obj: new Static({
        x: canvas.w/2,
        y: canvas.h + wallSize/2,
        w: canvas.w,
        h: wallSize,
        fill: {
          r: 255,
          g: 0,
          b: 0,
          a: 50
        }
      })
    }
    this.walls.push(bottomWall);

    let rightWall = {
      name: 'rightWall',
      obj: new Static({
        x: canvas.w + wallSize/2,
        y: canvas.h/2,
        w: wallSize,
        h: canvas.h * 100,
        fill: {
          r: 255,
          g: 0,
          b: 0,
          a: 50
        }
      })
    }
    this.walls.push(rightWall);

    let leftWall = {
      name: 'leftWall',
      obj: new Static({
        x: 0 - wallSize/2,
        y: canvas.h/2,
        w: wallSize,
        h: canvas.h * 100,
        fill: {
          r: 255,
          g: 0,
          b: 0,
          a: 50
        }
      })
    }
    this.walls.push(leftWall);

    //Create objects
    this.objects = [];

    //THE ORDER OF THESE MATTERS!
    //(well, only the first two I ended using functions so I don't hard code array id)
    let map = {
      name: 'map',
      obj: new Map()
    }
    this.objects.push(map);

    let phone = {
      name: 'phone',
      obj: new Phone({
        x: canvas.w/2 + 200,
        y: canvas.h/2 + 200,
      })
    }
    this.objects.push(phone);

    let rope = {
      name: 'rope',
      obj: new Rope({
        x: 30,
        y: -10,
        w: 22,
        h: 150,
        category: defaultCategory,
        mask: defaultCategory
      })
    }
    this.objects.push(rope);

    let book = {
      name: 'book',
      obj: new Book({
        x: canvas.w/2 - 300,
        y: canvas.h/2,
        w: 80,
        h: 120,
        category: defaultCategory,
        mask: defaultCategory
      })
    }
    this.objects.push(book);

    let bucket = {
      name: 'bucket',
      obj: new Bucket({
        x: canvas.w/2 - 20,
        y: canvas.h/2 + 115,
        w: 80,
        h: 120,
        category: defaultCategory,
        mask: defaultCategory
      })
    }
    this.objects.push(bucket);

    //contain Pop Up windows
    this.POIwindow = undefined;
    this.phoneWindow = undefined;

    //PlaySounds
    snd[6].loop(); //roomTone
    //snd[2].loop(); //Jazz
    //who likes jazz anyway

  }

  display() {
    background(100);
    translate(testCanvas.w/2 - canvas.w/2, testCanvas.h/2 - canvas.h/2);
    //display real canvas
    push();
    fill(200);
    noStroke();
    rect(0, 0, canvas.w, canvas.h);
    pop();

    //displayBackgroundMain
    push();
    imageMode(CENTER);
    translate(canvas.w/2, canvas.h/2);
    image(img[1], 0, 0, canvas.w, canvas.h);
    pop();

    this.timer.display();

    for (let i = 0; i < this.walls.length; i++) {
      this.walls[i].obj.display();
    }
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].obj.display();
      this.objects[i].obj.update();
    }

    if (this.POIwindow !== undefined) {
        this.POIwindow.display();
        this.POIwindow.update();
    }

    if (this.phoneWindow !== undefined) {
        this.phoneWindow.display();
        this.phoneWindow.update();
    }

    this.timer.update();
    physics.displayMouseConstraint();

    //hide the exterior of the true canvas
    push();
    imageMode(CENTER);
    image(img[25], canvas.w/2, canvas.h/2);
    pop();
  }

  //Function to find the id of a specifc object in the objects array
  findArrayID(name) {
    for (let i = 0; i < this.objects.length; i++) {
      let objectName = this.objects[i].name;
      if (objectName === name) {
        return i;
      }
    }
    console.error("ERROR: the array doen't contain the name you are looking for");
    return undefined;
  }

  mousePressed() {
    //POI for the map
    if (this.POIwindow !== undefined) {
      if (this.POIwindow.id === 'phoneLine') { //allows mouse interaction on the phoneLine POI
        let d = dist(
          this.POIwindow.layout.x + this.POIwindow.switch.xOff,
          this.POIwindow.layout.y + this.POIwindow.switch.yOff,
          physics.mConstraint.mouse.position.x,
          physics.mConstraint.mouse.position.y
        );
        if (d <= this.POIwindow.switch.radius && !this.POIwindow.switch.active) {
          this.POIwindow.switch.active = true;
          this.POIwindow.switch.activate();
          this.POIwindow.turnOffMapPOI();
          snd[5].play(); //plug
          return //stops the function so a window is not triggered while the user is trying to close one
        }
      }
      let d = dist(
        this.POIwindow.compoundBody.position.x + this.POIwindow.layout.w/2 - this.POIwindow.layout.thickness/2,
        this.POIwindow.compoundBody.position.y - this.POIwindow.layout.h/2 + this.POIwindow.layout.thickness/2,
        physics.mConstraint.mouse.position.x,
        physics.mConstraint.mouse.position.y
      );
      if (d <= this.POIwindow.layout.buttonRadius) { //exit button
        this.POIwindow.removeFromWorld();
        return //stops the function so a window is not triggered while the user is trying to close one
      }
    }
    else if (this.POIwindow === undefined) { //checks if the mouse clics on a POI on the map
      for (let i = 0; i < this.objects[0].obj.POI.length; i++) {
        let poi = this.objects[0].obj.POI[i];
        if (poi.mouseOver && poi.active) {
          let newWindow = new Window({
            type: 'map',
            id: poi.id,
            cliché: poi.img
          });
          this.POIwindow = newWindow;
        }
      }
    }

    //Phone dial: check mousePressed with the dial
    let phoneID = this.findArrayID('phone');
    if (
      this.objects[phoneID].obj.outlet.plugged //power is plugged?
      && this.objects[phoneID].obj.phoneOutlet.plugged //combine is plugged?
      && !this.objects[phoneID].obj.detector.collisionDetector() //Nothing is on top i.e. the line is open
      && this.objects[phoneID].obj.dial.state !== 'sending'
    ) {
      if (this.objects[phoneID].obj.dial.button0.active) {
        snd[0].play(); //buttonPress
        this.objects[phoneID].obj.dial.timer = this.objects[phoneID].obj.dial.timerValue; //reset the dial timer
        this.objects[phoneID].obj.dial.sequence += this.objects[phoneID].obj.dial.button0.value;
      }
      else if (this.objects[phoneID].obj.dial.button1.active) {
        snd[0].play(); //buttonPress
        this.objects[phoneID].obj.dial.timer = this.objects[phoneID].obj.dial.timerValue; //reset the dial timer
        this.objects[phoneID].obj.dial.sequence += this.objects[phoneID].obj.dial.button1.value;
      }
    }
  }

  keyPressed() { //for testing
    if (keyCode === 49) { //1
      let newWindow = new Window({
        type: 'phone',
        id: 'hospital',
        cliché: img[33]
      });
      this.phoneWindow = newWindow;
    }

    if (keyCode === 50) { //2
      snd[13].play();
      let tableau = {
        name: 'tableau',
        obj: new Tableau({
          x: undefined,
          y: undefined,
          w: undefined,
          h: undefined,
          category: defaultCategory,
          mask: defaultCategory
        })
      }
      this.objects.push(tableau);
    }
  }
}
