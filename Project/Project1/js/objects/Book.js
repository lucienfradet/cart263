// !! Important to have the body inside a body property !!

class Book extends Thing {
  constructor({x, y, w, h, category, mask}) {
    super();
    this.pos = {
      x: x,
      y: y
    };
    this.w = w;
    this.h = h; //w * 1.5
    this.category = category;
    this.mask = mask;

    this.body = Bodies.rectangle(this.pos.x, this.pos.y, this.w, this.h, {
      isStatic: false,
      collisionFilter: {
        category: this.category,
        mask: this.mask
        }
      }
    );
    Body.setMass(this.body, 0.3);
    Body.setAngle(this.body, PI/3)
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
    clearRiso();
    translate(this.w/2, this.h/2);
    risoBlack.image(img.array[0], 0, 0, this.w, this.h);
    drawRiso();
    pop();
  }
}
