//I just realised I really don't need all these damn this and should really use non global variables for the constructor...
class Map extends Thing {
  constructor() {
    super();
    //Testing frictionStatic
    this.frictionStaticForAnker = 10;

    //Map
    this.smallFactor = 100;
    this.map = {
      x: canvas.w/2,
      y: -220,
      w: canvas.w - this.smallFactor,
      h: 300
    }

    this.mapBody = Bodies.rectangle(this.map.x, this.map.y, this.map.w, this.map.h, {
      isStatic: false,
    });
    Body.setMass(this.mapBody, 1);

    //Map Attach
    this.attach = {
      x: this.map.x,
      y: this.map.y - this.map.h/2 - 3000,
      stiffness: 0.00035
    }

    this.constraints = {
      bottomRight: undefined,
      bottomRightConfig: {
        bodyA: this.mapBody,
        pointA: { x: -this.map.w/2, y: -this.map.h/2 },
        pointB: { x: this.attach.x, y: this.attach.y },
        stiffness: this.attach.stiffness
      },
      bottomLeft: undefined,
      bottomLeftConfig: {
        bodyA: this.mapBody,
        pointA: { x: this.map.w/2, y: -this.map.h/2 },
        pointB: { x: this.attach.x, y: this.attach.y },
        stiffness: this.attach.stiffness
      },
    }

    this.constraints.bottomRight = Constraint.create(this.constraints.bottomRightConfig);
    this.constraints.bottomLeft = Constraint.create(this.constraints.bottomLeftConfig);

    //ring
    this.ringDistance = 30;
    this.ring = {
      top: {
        body: undefined,
        x: this.mapBody.position.x,
        y: this.mapBody.position.y + this.map.h/2 + this.ringDistance,
        w: 25,
        h: 10
      },
      bottom: {
        body: undefined,
        x: this.mapBody.position.x,
        y: this.mapBody.position.y + this.map.h/2 + this.ringDistance + 25,
        w: 25,
        h: 10
      }
    }
    this.ring.top.body = Bodies.rectangle(this.ring.top.x, this.ring.top.y, this.ring.top.w, this.ring.top.h, {
      friction: 1,
      frictionStatic: this.frictionStaticForAnker
    });
    this.ring.bottom.body = Bodies.rectangle(this.ring.bottom.x, this.ring.bottom.y, this.ring.bottom.w, this.ring.bottom.h, {
      friction: 1,
      frictionStatic: this.frictionStaticForAnker
    });

    this.ringConstrain = {
      left: {
        constrain: undefined,
        constrainConfig: {
          bodyA: this.ring.top.body,
          pointA: { x: -this.ring.top.w/2, y: -this.ring.top.h/2 },
          bodyB: this.ring.bottom.body,
          pointB: { x: -this.ring.top.w/2, y: this.ring.top.h/2 },
          stiffness: 1,
        }
      },
      right: {
        constrain: undefined,
        constrainConfig: {
          bodyA: this.ring.top.body,
          pointA: { x: this.ring.top.w/2, y: -this.ring.top.h/2 },
          bodyB: this.ring.bottom.body,
          pointB: { x: this.ring.top.w/2, y: this.ring.top.h/2 },
          stiffness: 1,
        }
      },
      middle: {
        constrain: undefined,
        constrainConfig: {
          bodyA: this.ring.top.body,
          pointA: { x: -this.ring.top.w/2, y: -this.ring.top.h/2 },
          bodyB: this.ring.bottom.body,
          pointB: { x: this.ring.top.w/2, y: this.ring.top.h/2 },
          stiffness: 1,
        }
      }
    }
    this.ringConstrain.left.constrain = Constraint.create(this.ringConstrain.left.constrainConfig);
    this.ringConstrain.right.constrain = Constraint.create(this.ringConstrain.right.constrainConfig);
    this.ringConstrain.middle.constrain = Constraint.create(this.ringConstrain.middle.constrainConfig);

    //rope thing
    this.rope = [];
    this.segmentSize = 4
    const NUM_ROPE_SEGMENTS = 15;
    let start = this.map.y + this.map.h/2;
    let end = this.ring.top.y - this.ring.top.h/2;
    let spaceBetween = (end - start)/NUM_ROPE_SEGMENTS;

    let previous = null;
    for (let y = start + spaceBetween; y < end - spaceBetween - this.segmentSize/2; y += spaceBetween + this.segmentSize/2) {
      let segment = Bodies.rectangle(this.map.x, y, this.segmentSize, this.segmentSize);
      //Body.setMass(segment, 0.01);
      this.rope.push(segment);

      let constrain = undefined;
      if (!previous) {
        constrain = Constraint.create({
          bodyA: this.mapBody,
          pointA: { x: 0, y: this.mapBody.position.y + this.map.h },
          bodyB: segment,
          stiffness: 1,
          length: this.spaceBetween
        });
        this.rope.push(constrain);
      }
      else {
        constrain = Constraint.create({
          bodyA: previous,
          bodyB: segment,
          stiffness: 1,
          length: this.spaceBetween
        });
        this.rope.push(constrain);
      }

      this.addToWorld([
        segment,
        constrain
      ])

      previous = segment;
    }

    //Attach the last segment to the ring
    let lastRopeID = this.rope.length - 1;
    if (this.rope[lastRopeID].label === 'Constraint') {
      lastRopeID = this.rope.length - 2;
    }
    let constrain = Constraint.create({
        bodyA: this.rope[lastRopeID],
        bodyB: this.ring.top.body,
        stiffness: 1,
        length: this.spaceBetween
      });
    this.rope.push(constrain);
    this.addToWorld([constrain]);

    //anker
    this.anker = {
      body: undefined,
      x: canvas.w / 2 - 25,
      y: canvas.h - 30,
      w: 50,
      h: 8
    };

    this.anker.body = Bodies.rectangle(this.anker.x, this.anker.y, this.anker.w, this.anker.h, {
      isStatic: true,
      friction: 1,
      frictionStatic: this.frictionStaticForAnker
    });

    //adds the body to matter.js world
    this.addToWorld([
      this.mapBody,
      this.constraints.bottomRight,
      this.constraints.bottomLeft,
      this.ring.top.body,
      this.ring.bottom.body,
      this.ringConstrain.left.constrain,
      this.ringConstrain.right.constrain,
      this.ringConstrain.middle.constrain,
      this.anker.body
    ]);

    console.log(this.mapBody);
  }

  addToWorld(array) {
    Composite.add(physics.world, array);
  }



  display() {
    //Map
    push();
    translate(this.mapBody.position.x, this.mapBody.position.y);
    rotate(this.mapBody.angle);
    rectMode(CENTER);
    fill(255, 150);
    noStroke();
    rect(0, 0, this.map.w, this.map.h);
    pop();

    //ring
    push(); //Top
    translate(this.ring.top.body.position.x, this.ring.top.body.position.y);
    rotate(this.ring.top.body.angle);
    rectMode(CENTER);
    fill(255, 150);
    noStroke();
    rect(0, 0, this.ring.top.w, this.ring.top.h);
    pop();

    push(); //Bottom
    translate(this.ring.bottom.body.position.x, this.ring.bottom.body.position.y);
    rotate(this.ring.bottom.body.angle);
    rectMode(CENTER);
    fill(255, 150);
    noStroke();
    rect(0, 0, this.ring.bottom.w, this.ring.bottom.h);
    pop();

    //Rope segments
    for (let i = 0; i < this.rope.length; i++) { //Every other is a constraint in the rope array
      if (this.rope[i].label !== 'Constraint') {
        push();
        translate(this.rope[i].position.x, this.rope[i].position.y);
        rotate(this.rope[i].angle);
        rectMode(CENTER);
        fill(255, 150);
        noStroke();
        rect(0, 0, this.segmentSize, this.segmentSize);
        pop();
      }
    }

    //anker
    push();
    translate(this.anker.body.position.x, this.anker.body.position.y);
    rotate(this.anker.body.angle);
    rectMode(CENTER);
    fill(255, 150);
    noStroke();
    rect(0, 0, this.anker.w, this.anker.h);
    pop();

    //constraints
    let bottomRightX = this.constraints.bottomRight.bodyA.position.x;
    let bottomRightY = this.constraints.bottomRight.bodyA.position.y;
    let bottomRightOffsetX = this.constraints.bottomRight.pointA.x;
    let bottomRightOffsetY = this.constraints.bottomRight.pointA.y;

    let bottomLeftX = this.constraints.bottomLeft.bodyA.position.x;
    let bottomLeftY = this.constraints.bottomLeft.bodyA.position.y;
    let bottomLeftOffsetX = this.constraints.bottomLeft.pointA.x;
    let bottomLeftOffsetY = this.constraints.bottomLeft.pointA.y;
    push();
    strokeWeight(1);
    stroke(255, 150);
    line(bottomRightX + bottomRightOffsetX, bottomRightY + bottomRightOffsetY, this.constraints.bottomRight.pointB.x, this.constraints.bottomRight.pointB.y);
    line(bottomLeftX + bottomLeftOffsetX, bottomLeftY + bottomLeftOffsetY, this.constraints.bottomRight.pointB.x, this.constraints.bottomRight.pointB.y);
    pop();
  }
}
