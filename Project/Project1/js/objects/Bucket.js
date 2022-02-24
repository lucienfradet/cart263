// !! Important to have the body inside a body property !!

class Bucket extends Thing {
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
    this.thickness = 15;
    this.sideOffset = 15;
    this.angleOffset = PI/10;

    this.parts = [];

    this.base = {
      x: this.pos.x,
      y: this.pos.y,
      w: this.w,
      h: this.thickness,
      options: {
        category: category,
        mask: mask
      }
    }
    this.parts.push(physics.addRect(this.base));

    //config for the left part of combine
    let leftW = this.thickness,
        leftH = this.h,
        leftX = this.base.x - this.base.w/2 - this.sideOffset,
        leftY = this.base.y - leftH/2;

    this.left = {
      x: leftX,
      y: leftY,
      w: leftW,
      h: leftH,
      options: {
        category: category,
        mask: mask
      }
    }
    this.parts.push(physics.addRect(this.left));
    Body.setAngle(this.parts[1], -this.angleOffset);

    //config for the right part of combine
    let rightW = this.thickness,
        rightH = this.h,
        rightX = this.base.x + this.base.w/2 + this.sideOffset,
        rightY = this.base.y - leftH/2;

    this.right = {
      x: rightX,
      y: rightY,
      w: rightW,
      h: rightH,
      options: {
        category: category,
        mask: mask
      }
    }
    this.parts.push(physics.addRect(this.right));
    Body.setAngle(this.parts[2], this.angleOffset);

    this.body = physics.createBody(this.parts);
    this.body.collisionFilter.category = category;
    this.body.collisionFilter.mask = mask;

    let manualOffset =  -60;
    Body.setCentre(this.body, {
      x: 0,
      y: -this.base.h - manualOffset
    }, true);
    Body.setMass(this.body, 0.3);
    Body.setAngle(this.body, PI)
    Composite.add(physics.world, this.body); //adds the body to matter.js world
  }

  update() {

  }

  display() {

    //base
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    imageMode(CENTER);
    fill(255, 150);
    noStroke();
    image(img[5], 0, 0, img[5].width * 0.9, img[5].height * 0.9);
    pop();

    //left and right modules
    // push();
    // translate(this.body.position.x, this.body.position.y);
    // rotate(this.body.angle);
    // translate(-this.base.w/2 - this.sideOffset, -this.left.h/2);
    // rotate(-this.angleOffset);
    // rectMode(CENTER);
    // fill(255, 150);
    // noStroke();
    // rect(0, 0, this.left.w, this.left.h);
    // pop();
    //
    // push();
    // translate(this.body.position.x, this.body.position.y);
    // rotate(this.body.angle);
    // translate(this.base.w/2 + this.sideOffset, -this.right.h/2);
    // rotate(this.angleOffset);
    // rectMode(CENTER);
    // fill(255, 150);
    // noStroke();
    // rect(0, 0, this.right.w, this.right.h);
    // pop();
  }
}
