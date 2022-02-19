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

    let book = {
      name: 'book',
      obj: new Book({
        x: canvas.w/2,
        y: canvas.h/2
      })
    };
    this.objects.push(book);

    let map = {
      name: 'map',
      obj: new Map()
    };
    this.objects.push(map);
  }

  update() {

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
    }

    physics.displayMouseConstraint();
  }

  mousePressed() {

  }
}
