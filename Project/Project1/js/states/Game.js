//Game class

class Game extends State {
  constructor() {
    super();

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

    let map = {
      name: 'map',
      obj: new Map()
    };
    this.objects.push(map);

    let book = {
      name: 'book',
      obj: new Book({
        x: canvas.w/2,
        y: canvas.h/2,
        w: 80,
        h: 120
      })
    };
    this.objects.push(book);

    let book2 = {
      name: 'book',
      obj: new Book({
        x: canvas.w/2 + 50,
        y: canvas.h/2 + 50,
        w: 80,
        h: 120
      })
    };
    this.objects.push(book2);

    //Arrays that contain Pop Up windows
    this.windows = [];

    console.log(this.objects);
    this.setCollisionFilter();
  }

  setCollisionFilter() {
    //NOTE
    //If mask is zero, collision (AND MOUSE CONSTRAINT) is disable unless they have the same positive group!

    let collisionFilter = { //Fouille moe pourquoi mais ça fait que le truc colide pas...
      category: 2,
      group: -1,
      mask: 0
    }
    this.objects[0].obj.mapBody.collisionFilter.category = 1;//map
    this.objects[0].obj.mapBody.collisionFilter.group = 2;
    //this.objects[0].obj.mapBody.collisionFilter.mask = 0;

    //walls
    for (let i = 0; i < this.walls.length; i++) {
      this.walls[i].obj.body.collisionFilter.category = 2;
      this.walls[i].obj.body.collisionFilter.group = 2;
    }

    //books
    this.objects[1].obj.body.collisionFilter.group = 3;
    this.objects[2].obj.body.collisionFilter.group = 1;
  }

  display() {
    background(100);
    translate(testCanvas.w/2 - canvas.w/2, testCanvas.h/2 - canvas.h/2);
    //display real canvas
    push();
    fill(0);
    rect(0, 0, canvas.w, canvas.h);
    pop();

    for (let i = 0; i < this.walls.length; i++) {
      this.walls[i].obj.display();
    }
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].obj.display();
      this.objects[i].obj.update();
    }

    if (this.windows.length > 0) {
      for (let i = 0; i < this.windows.length; i++) {
        this.windows[i].display();
        this.windows[i].update();
      }
    }

    physics.displayMouseConstraint();
  }

  mousePressed() {
    for (let i = 0; i < this.objects[0].obj.POI.length; i++) {
      let poi = this.objects[0].obj.POI[i];
      if (poi.active) {
        let newWindow = new Window({
          type: 'map',
          id: poi.id
        });
        this.windows.push(newWindow);
      }
    }
  }
}
