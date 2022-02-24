// !! Important to have the body inside a body property !!

class Tableau extends Thing {
  constructor({x, y, w, h, category, mask}) {
    super();
    this.pos = {
      x: canvas.w/2,
      y: canvas.h/2 - 7000
    };
    this.w = canvas.w - 100;
    this.h = canvas.h - 120;
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
    Body.setMass(this.body, 300);
    Composite.add(physics.world, this.body); //adds the body to matter.js world
    Body.applyForce(this.body, { x: this.body.position.x, y: this.body.position.y }, { x: 0, y: 150 });
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
    image(img.array[0], 0, 0, this.w, this.h);
    pop();
  }
}
