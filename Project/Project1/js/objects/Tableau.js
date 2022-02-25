// !! Important to have the body inside a body property !!

class Tableau extends Thing {
  constructor({x, y, w, h, category, mask}) {
    super();
    this.soundSwitch = true;
    this.pos = {
      x: canvas.w/2,
      y: canvas.h/2 - 15000
    };
    this.w = canvas.w - 200;
    this.h = canvas.h - 120;
    this.category = defaultCategory;
    this.mask = defaultCategory;

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
    if (this.body.position.y > 0 && this.soundSwitch) {
      snd[14].play();
      this.soundSwitch = false;
    }
  }

  display() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    noStroke();
    fill(255, 200);
    rect(0, 0, this.w, this.h)

    imageMode(CENTER);
    image(img[32], 0, 0, this.w, this.h);
    pop();
  }
}
