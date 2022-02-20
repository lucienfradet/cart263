//Combiné object (Le truc que tu tiens dans ta main pour parlé au télphone. SAVAIS-TU QUE ÇA S'APPELAIT UN COMBINÉ TOI!?!?)

class Combine extends Thing {
  constructor({x, y}) {
    super();
    this.parts = [];

    this.base = {
      x: x,
      y: y,
      w: 80,
      h: 15,
      options: {
        //inertia: Infinity
      }
    }
    this.parts.push(physics.addRect(this.base));

    //config for the left part of combine
    let leftW = 35,
        leftH = 35,
        leftX = this.base.x - this.base.w/2 - leftW/2,
        leftY = this.base.y + leftH/2;

    this.left = {
      x: leftX,
      y: leftY,
      w: leftW,
      h: leftH,
      options: {

      }
    }
    this.parts.push(physics.addRect(this.left));

    //config for the right part of combine
    let rightW = 35,
        rightH = 35,
        rightX = this.base.x + this.base.w/2 + rightW/2,
        rightY = this.base.y + rightH/2;

    this.right = {
      x: rightX,
      y: rightY,
      w: rightW,
      h: rightH,
      options: {

      }
    }
    this.parts.push(physics.addRect(this.right));

    this.compoundBody = physics.createBody(this.parts);

    //Set center of gravity in the middle of the base

    //manualOffset because the Center is not exactly in between the two bodies. It depends on the mass of each one.
    //I'm not sure how to automatise this operation.
    //In the mean time, this value needs to be changed if the size of the Phone is chnaged
    let manualOffset =  2;
    Body.setCentre(this.compoundBody, {
      x: 0,
      y: -this.base.h + manualOffset
    }, true);
    Body.setMass(this.compoundBody, 1.5);

    physics.addToWorld(this.compoundBody);

    //plug
    this.plugStartDistance = this.left.y - 100;
    this.plug = {
      body: undefined,
      x: this.left.x - this.left.w/2,
      y: this.plugStartDistance,
      w: 10,
      h: 10,
      options: {
        collisionFilter: {
          category: defaultCategory,
          mask: defaultCategory
        }
      }
    }

    this.plug.body = Bodies.rectangle(this.plug.x, this.plug.y, this.plug.w, this.plug.h, this.plug.options);
    physics.addToWorld([this.plug.body]);


    //cable
    this.cable = [];
    this.segmentSize = 2
    const NUM_ROPE_SEGMENTS = 30;
    let cableLength = this.plugStartDistance;
    let start = this.plug.y + this.plug.h/2;
    let end = this.left.y;
    let spaceBetween = (end - start)/NUM_ROPE_SEGMENTS;

    let previous = null;
    for (let y = start + spaceBetween; y < end - spaceBetween - this.segmentSize/2; y += spaceBetween + this.segmentSize/2) {
      let segment = Bodies.rectangle(this.left.x - this.left.w/2, y, this.segmentSize, this.segmentSize, {
        collisionFilter: {
          category: defaultCategory,
          mask: defaultCategory
          }
      });
      Body.setMass(segment, 0.001);
      this.cable.push(segment);

      let constrain = undefined;
      if (!previous) {
        constrain = Constraint.create({
          bodyA: this.plug.body,
          pointA: { x: 0, y: this.plug.h/2 },
          bodyB: segment,
          stiffness: 1,
          length: this.spaceBetween
        });
        this.cable.push(constrain);
      }
      else {
        constrain = Constraint.create({
          bodyA: previous,
          bodyB: segment,
          stiffness: 1,
          length: this.spaceBetween
        });
        this.cable.push(constrain);
      }

      physics.addToWorld([
        segment,
        constrain
      ])

      previous = segment;
    }

    //Attach the last segment to the phone
    let lastCableID = this.cable.length - 1;
    if (this.cable[lastCableID].label === 'Constraint') {
      lastCableID = this.cable.length - 2;
    }
    let constrain = Constraint.create({
        bodyA: this.cable[lastCableID],
        bodyB: this.compoundBody,
        pointB: { x: -this.base.w/2 - this.left.w, y: this.left.h/2 },
        stiffness: 1,
        length: this.spaceBetween
      });
    this.cable.push(constrain);
    physics.addToWorld([constrain]);
  }

  checkForMouseInteraction() {

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

    //left and right modules
    push();
    translate(this.compoundBody.position.x, this.compoundBody.position.y);
    rotate(this.compoundBody.angle);
    translate(-this.base.w/2 - this.left.w/2, this.left.h/2);
    rectMode(CENTER);
    fill(255, 150);
    noStroke();
    rect(0, 0, this.left.w, this.left.h);
    pop();

    push();
    translate(this.compoundBody.position.x, this.compoundBody.position.y);
    rotate(this.compoundBody.angle);
    translate(this.base.w/2 + this.left.w/2, this.right.h/2);
    rectMode(CENTER);
    fill(255, 150);
    noStroke();
    rect(0, 0, this.right.w, this.right.h);
    pop();

    //plug
    push();
    translate(this.plug.body.position.x, this.plug.body.position.y);
    rotate(this.plug.body.angle);
    rectMode(CENTER);
    fill(200, 125);
    noStroke();
    rect(0, 0, this.plug.w, this.plug.w);
    pop();

    //cable
    for (let i = 0; i < this.cable.length; i++) { //Every other is a constraint in the rope array
      if (this.cable[i].label !== 'Constraint') {
        push();
        translate(this.cable[i].position.x, this.cable[i].position.y);
        rotate(this.cable[i].angle);
        rectMode(CENTER);
        fill(200, 125);
        noStroke();
        rect(0, 0, this.segmentSize * 2.5, this.segmentSize * 2.5);
        pop();
      }
    }

  }
}
