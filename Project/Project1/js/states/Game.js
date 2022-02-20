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
    }
    this.objects.push(map);

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

    let book2 = {
      name: 'book',
      obj: new Book({
        x: canvas.w/2 - 100,
        y: canvas.h/2 + 50,
        w: 80,
        h: 120,
        category: defaultCategory,
        mask: defaultCategory
      })
    }
    this.objects.push(book2);

    let phone = {
      name: 'phone',
      obj: new Phone({
        x: canvas.w/2 + 200,
        y: canvas.h/2 + 200,
      })
    }
    this.objects.push(phone);

    let combine = {
      name: 'combine',
      obj: new Combine({
        x: canvas.w/2 + 200,
        y: canvas.h/2 - 100,
      })
    }
    this.objects.push(combine);

    //Arrays that contain Pop Up windows
    this.POIwindow = undefined;

    console.log(this.objects);
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

    if (this.POIwindow !== undefined) {
        this.POIwindow.display();
        this.POIwindow.update();
    }

    physics.displayMouseConstraint();
  }

  mousePressed() {
    if (this.POIwindow !== undefined) {
      let d = dist(
        this.POIwindow.compoundBody.position.x + this.POIwindow.layout.w/2 - this.POIwindow.layout.thickness/2,
        this.POIwindow.compoundBody.position.y - this.POIwindow.layout.h/2 + this.POIwindow.layout.thickness/2,
        physics.mConstraint.mouse.position.x,
        physics.mConstraint.mouse.position.y
      );
      if (d <= this.POIwindow.layout.buttonRadius) {
        this.POIwindow.removeFromWorld();
        console.log('hello');
      }
    }
    if (this.POIwindow === undefined) {
      for (let i = 0; i < this.objects[0].obj.POI.length; i++) {
        let poi = this.objects[0].obj.POI[i];
        if (poi.active) {
          let newWindow = new Window({
            type: 'map',
            id: 'shack'
          });
          this.POIwindow = newWindow;
        }
      }
    }
  }
}
