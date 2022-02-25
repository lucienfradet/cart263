//static (walls) class
class Static extends Thing {
  constructor({x, y, w, h, fill: { r, g, b, a }}) {
    super();
    this.pos = {
      x: x,
      y: y
    };
    this.w = w;
    this.h = h;
    this.fill = {
      r: r,
      g: g,
      b: b,
      a: a
    }

    this.body = Bodies.rectangle(this.pos.x, this.pos.y, this.w, this.h, {
      isStatic: true,
      collisionFilter: {
        category: defaultCategory,
        }
      }
    );
    Composite.add(physics.world, this.body); //adds the body to matter.js world
  }

  update() {

  }

  display() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    rectMode(CENTER);
    noStroke();
    fill(this.fill.r, this.fill.g, this.fill.b, this.fill.a);
    rect(pos.x, pos.y, this.w, this.h);
    pop();
  }
}
