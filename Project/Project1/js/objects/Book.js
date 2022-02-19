class Book extends Thing {
  constructor({x, y, w, h}) {
    super();
    this.pos = {
      x: x,
      y: y
    };
    this.w = w;
    this.h = h; //w * 1.5

    this.body = Bodies.rectangle(this.pos.x, this.pos.y, this.w, this.h, {isStatic: false});
    Body.setMass(this.body, 0.3);
    Composite.add(physics.world, this.body); //adds the body to matter.js world
  }

  update() {

  }

  display() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);

    imageMode(CENTER);
    image(img.book, 0, 0, this.w, this.h);
    pop();
  }
}