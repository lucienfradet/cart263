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
      y: this.top.h/2 - manualOffset
    }, true);

    physics.addToWorld(this.compoundBody);

    //plug
    this.plugStartDistance = this.base.y - 150;
    this.plug = {
      body: undefined,
      x: this.base.x + this.base.w/2,
      y: this.plugStartDistance,
      w: 15,
      h: 15,
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
    const NUM_ROPE_SEGMENTS = 50;
    let cableLength = this.plugStartDistance;
    let start = this.plug.y + this.plug.h/2;
    let end = this.base.y;
    let spaceBetween = (end - start)/NUM_ROPE_SEGMENTS;

    let previous = null;
    for (let y = start + spaceBetween; y < end - spaceBetween - this.segmentSize/2; y += spaceBetween + this.segmentSize/2) {
      let segment = Bodies.rectangle(this.base.x + this.base.w/2, y, this.segmentSize, this.segmentSize, {
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
          pointA: { x: 0, y: +this.plug.h/2 },
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
        pointB: { x: this.base.w/2, y: 0 },
        stiffness: 1,
        length: this.spaceBetween
      });
    this.cable.push(constrain);
    physics.addToWorld([constrain]);

    //outlet
    this.outlet = {
      body: undefined,
      active: false,
      plugged: false,
      x: canvas.w - 60,
      y: canvas.h/10 * 6,
      w:30,
      h:30,
      options: {
        isStatic: true,
        collisionFilter: {
          category: backCategory,
          mask: defaultCategory
        }
      }
    }

    this.outlet.body = Bodies.rectangle(this.outlet.x, this.outlet.y, this.outlet.w, this.outlet.h, this.outlet.options);
    physics.addToWorld([this.outlet.body]);

    //phoneOutlet
    this.phoneOutletSize = 15
    this.phoneOutlet = {
      xOffset: - this.base.w/2 + this.phoneOutletSize/2, //offset from the phone.base.postion
      yOffset: this.base.h/6,
      active: true,
      plugged: false
    }

  }

  checkForMouseInteraction() {
    //Plug the Plug sti!
    if (!this.outlet.plugged) {
      let d = dist(this.outlet.body.position.x, this.outlet.body.position.y, this.plug.body.position.x, this.plug.body.position.y);
      if (d <= this.outlet.w / 2 && this.outlet.active) {
        let constraint = Constraint.create({
            bodyA: this.outlet.body,
            bodyB: this.plug.body,
            stiffness: 1,
            length: 0
          }
        );
        Body.setInertia(this.plug.body, Infinity);
        Body.setAngle(this.plug.body, 0);
        Body.setAngularVelocity(this.plug.body, 0);
        physics.addToWorld([constraint]);
        this.outlet.plugged = true;
      }
    }

    let doesTheCombineExist = false
    for (let i = 0; i < state.objects.length; i++) {
      if (state.objects[i].name === 'combine') {
        doesTheCombineExist = true;
      }
    }

    //check if combine exists
    if (doesTheCombineExist) {
      //plug the phoneOutlet sti!
      if (!this.phoneOutlet.plugged) {
        let d = dist(
          this.compoundBody.position.x + this.phoneOutlet.xOffset,
          this.compoundBody.position.y + this.phoneOutlet.yOffset,
          state.objects[4].obj.plug.body.position.x,
          state.objects[4].obj.plug.body.position.y
        );
        if (d <= this.phoneOutletSize && this.phoneOutlet.active) {
          let constraint = Constraint.create({
              bodyA: this.compoundBody,
              pointA: { x: this.phoneOutlet.xOffset - this.phoneOutletSize / 4 * 3, y: this.phoneOutlet.yOffset },
              bodyB: state.objects[4].obj.plug.body,
              stiffness: 1,
              length: 0
            }
          );
          Body.setInertia(state.objects[4].obj.plug.body, Infinity);
          Body.setAngle(state.objects[4].obj.plug.body, 0);
          Body.setAngularVelocity(state.objects[4].obj.plug.body, 0);
          state.objects[4].obj.plug.body.collisionFilter.mask = 0;
          physics.addToWorld([constraint]);
          this.phoneOutlet.plugged = true;
        }
      }
    }
  }

  update() {
    this.checkForMouseInteraction();
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

    //outlet
    push();
    translate(this.outlet.body.position.x, this.outlet.body.position.y);
    rotate(this.outlet.body.angle);
    rectMode(CENTER);
    fill(200, 125);
    noStroke();
    rect(0, 0, this.outlet.w, this.outlet.w);
    pop();

    //phoneOutlet
    push();
    translate(this.compoundBody.position.x, this.compoundBody.position.y);
    rotate(this.compoundBody.angle);
    translate(this.phoneOutlet.xOffset, this.phoneOutlet.yOffset);
    rectMode(CENTER);
    fill(0, 100);
    noStroke();
    rect(0, 0, this.phoneOutletSize, this.phoneOutletSize);
    pop();

  }
}
