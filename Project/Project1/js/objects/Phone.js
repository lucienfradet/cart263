class Phone extends Thing {
  constructor({x, y}) {
    super();
    this.parts = [];

    this.base = {
      x: x,
      y: y,
      w: 130,
      h: 50,
      options: {
        //inertia: Infinity
      }
    }
    this.parts.push(physics.addRect(this.base));

    this.topHeight = 60;
    this.top = {
      x: this.base.x,
      y: this.base.y - this.base.h/2 - this.topHeight/2,
      w: 70,
      h: this.topHeight,
      options: {

      }
    }
    this.parts.push(physics.addRect(this.top));

    this.compoundBody = physics.createBody(this.parts);

    //Set center of gravity in the middle of the base

    //manualOffset because the Center is not exactly in between the two bodies. It depends on the mass of each one.
    //I'm not sure how to automatise this operation.
    //In the mean time, this value needs to be changed if the size of the Phone is chnaged
    let manualOffset =  7.5;
    Body.setCentre(this.compoundBody, {
      x: 0,
      y: this.base.h/2 + this.top.h/2 - this.base.h/2 - manualOffset
    }, true);

    Composite.add(physics.world, this.compoundBody);


  }

  update() {

  }

  display() {
    //base
    push();
    translate(this.compoundBody.position.x, this.compoundBody.position.y);
    rotate(this.compoundBody.angle);
    rectMode(CENTER);
    fill(255, 150);
    noStroke();
    rect(0, 0, this.base.w, this.base.h);
    pop();

    //top
    push();
    translate(this.compoundBody.position.x, this.compoundBody.position.y);
    rotate(this.compoundBody.angle);
    translate(0, -this.base.h/2 - this.top.h/2);
    rectMode(CENTER);
    fill(255, 150);
    noStroke();
    rect(0, 0, this.top.w, this.top.h);
    pop();
  }
}
