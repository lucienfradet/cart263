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
    this.compoundBody.collisionFilter.mask = defaultCategory; //set mask

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

    //phone detector to check if the hand piece is picked up or not
    this.detector = {
      body: undefined,
      xOff: 0,
      yOff: -this.base.h/2 - this.top.h - 3,
      h: 1,
      w: this.top.w - 50,
      options: {
        isSensor: true,
        isStatic: true,
        collisionFilter: {
          category: defaultCategory,
          mask: defaultCategory
        }
      },
      active: false, //not used at the moment
      collisionDetector: function() {
        let phoneID = state.findArrayID('phone');
        let phone = state.objects[phoneID].obj;
        let detectorID = this.body.id;
        let compoundBodyID = phone.compoundBody.id;
        let compoundBodyPart1ID = phone.compoundBody.parts[1].id;
        let compoundBodyPart2ID = phone.compoundBody.parts[2].id;

        for (let i = 0; i < physics.engine.pairs.collisionActive.length; i++) { //check if a body is colliding with the detector
          let bodyA = physics.engine.pairs.collisionActive[i].bodyA;
          let bodyB = physics.engine.pairs.collisionActive[i].bodyB
          if (bodyA.id === detectorID || bodyB.id === detectorID) {
            if ( //ommit collisions with the phone compoundBody and it's parts
              bodyA.id !== compoundBodyID
              && bodyA.id !== compoundBodyPart1ID
              && bodyA.id !== compoundBodyPart2ID
              && bodyB.id !== compoundBodyID
              && bodyB.id !== compoundBodyPart1ID
              && bodyB.id !== compoundBodyPart2ID
            ) {
              return true;
            }
          }
        }
        return false;
      }
    }

    this.detector.body = Bodies.rectangle(this.detector.xOff, this.detector.yOff, this.detector.w, this.detector.h, this.detector.options);
    physics.addToWorld([this.detector.body]);

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
      xOffset: - this.base.w/2 + this.phoneOutletSize/2 - 5, //offset from the phone.base.position
      yOffset: this.base.h/6,
      active: true,
      plugged: false
    }

    //Phone dial
    this.dial = {
      button0: {
        value: '0',
        xOff: -15,  //diplay from compoundBody.position
        yOff: -50,
        radius: 12.5,
        active: false
      },
      button1: {
        value: '1',
        xOff: 15,
        yOff: -50,
        radius: 12.5,
        active: false
      },
      interacting: false,
      state: '',
      timer: 180, //3 seconds
      timerValue: 180,
      sequence: '', //test sequence 101
      hospitalSequence: '1000101'
    }

    //phoneCall with hospital
    this.phoneCallHospital = {
      spawnWindow: function() {
        let newWindow = new Window({
          type: 'phone',
          id: 'hospital'
        });
        state.phoneWindow = newWindow;
      },
      happy: false
    }

  }
  //END OF CONSTRUCTOR

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
        snd[5].play(); //plug
        this.outlet.plugged = true;
      }
    }

    let doesTheCombineExist = function() {
      for (let i = 0; i < state.objects.length; i++) {
        if (state.objects[i].name === 'combine') {
          return true;
        }
      }
      return false;
    }

    //check if combine exists
    if (doesTheCombineExist()) {
      //plug the phoneOutlet sti!
      if (!this.phoneOutlet.plugged) {
        let combineID = state.findArrayID('combine');
        let d = dist(
          this.compoundBody.position.x + this.phoneOutlet.xOffset,
          this.compoundBody.position.y + this.phoneOutlet.yOffset,
          state.objects[combineID].obj.plug.body.position.x,
          state.objects[combineID].obj.plug.body.position.y
        );
        if (d <= this.phoneOutletSize && !this.phoneOutlet.plugged) {
          let constraint = Constraint.create({
              bodyA: this.compoundBody,
              pointA: { x: this.phoneOutlet.xOffset - this.phoneOutletSize / 4 * 3, y: this.phoneOutlet.yOffset },
              bodyB: state.objects[combineID].obj.plug.body,
              stiffness: 1,
              length: 0
            }
          );
          Body.setInertia(state.objects[combineID].obj.plug.body, Infinity);
          Body.setAngle(state.objects[combineID].obj.plug.body, 0);
          Body.setAngularVelocity(state.objects[combineID].obj.plug.body, 0);
          state.objects[combineID].obj.plug.body.collisionFilter.mask = 0;
          physics.addToWorld([constraint]);
          snd[5].play(); //plug
          this.phoneOutlet.plugged = true;
        }
      }
    }

    //dial
    let d0 = dist(
      this.compoundBody.position.x + this.dial.button0.xOff,
      this.compoundBody.position.y + this.dial.button0.yOff,
      physics.mConstraint.mouse.position.x,
      physics.mConstraint.mouse.position.y
    );
    let d1 = dist(
      this.compoundBody.position.x + this.dial.button1.xOff,
      this.compoundBody.position.y + this.dial.button1.yOff,
      physics.mConstraint.mouse.position.x,
      physics.mConstraint.mouse.position.y
    );

    if (d0 <= this.dial.button0.radius) {
      this.dial.button0.active = true;
    }
    else {
      this.dial.button0.active = false;
    }

    if (d1 <= this.dial.button1.radius) {
      this.dial.button1.active = true;
    }
    else {
      this.dial.button1.active = false;
    }

  }

  update() {
    this.checkForMouseInteraction();

    //update the detector position according to this.compoundBody.position
    angleMode(RADIANS);
    let origin = {
      x: this.compoundBody.position.x,
      y: this.compoundBody.position.y
    }
    let r = abs(this.detector.yOff);
    let angle = this.compoundBody.angle;
    Body.setPosition(this.detector.body, {
      x: origin.x + (r * cos(angle - PI/2)),
      y: origin.y + (r * sin(angle - PI/2))
    });
    Body.setAngle(this.detector.body, this.compoundBody.angle);

    //dialing statements
    if (this.outlet.plugged && this.phoneOutlet.plugged) {//Check if phone is fully plugged
      if (this.detector.collisionDetector() && this.dial.state !== 'hungup') {
        snd[1].play(); //hungUp
        snd[3].stop(); //openLine
        this.dial.state = 'hungup'
        this.dial.sequence = '';
        this.dial.timer = this.dial.timerValue;
        if (this.state === 'calling') {
          this.phoneCall.angry = true;
        }
      }

      if (!this.detector.collisionDetector() && this.dial.state === 'hungup' || this.dial.state === '') {
        snd[4].play(); //pickedUp
        snd[3].loop(); //openLine
        this.dial.state = 'open';
      }

      if (this.dial.sequence !== '' && this.dial.state !== 'calling' && this.dial.state !== 'sending') {
        snd[3].stop(); //openLine
        this.dial.state = 'composing';
        this.dial.timer--;
      }

      if (this.dial.timer < 0 && this.dial.state !== 'fail') {
        if (this.dial.sequence === this.dial.hospitalSequence) { //good number was composed
          this.dial.timer = this.dial.timerValue;
          snd[7].loop(); //sending
          this.dial.state = 'sending'; //set to sending
          //play ending sound
        }
        else {
          this.dial.timer = this.dial.timerValue;
          this.dial.sequence = '';
          this.dial.state = 'fail';
        }
      }

      if (this.dial.state === 'fail') {
        this.dial.timer--;
        if (this.dial.timer < 0) {
          this.dial.timer = this.dial.timerValue; //or when sound finishes
          this.dial.state = '';
        }
      }

      if (this.dial.state === 'sending') {
        this.dial.timer--;
        if (this.dial.timer < 0) {
          snd[7].stop();
          this.dial.timer = this.dial.timerValue;
          this.state = 'calling'
          this.callEnCours();
        }
      }
    }
  }

  callEnCours() {
    if (this.phoneCall.happy) {
      //play aggreement sequence
    }
    if (!this.phoneCall.happy) {
      //play requesting sequence
    }
  }


  display() {
    //base
    push();
    translate(this.compoundBody.position.x, this.compoundBody.position.y);
    rotate(this.compoundBody.angle);
    imageMode(CENTER);
    fill(255, 150);
    noStroke();
    //translate(0 -img.array[3].width - 155, 0 -img.array[3].height +5);
    image(img[3], 7, 0);
    pop();

    // //top
    // push();
    // translate(this.compoundBody.position.x, this.compoundBody.position.y);
    // rotate(this.compoundBody.angle);
    // translate(0, -this.base.h/2 - this.top.h/2);
    // rectMode(CENTER);
    // fill(255, 150);
    // noStroke();
    // rect(0, 0, this.top.w, this.top.h);
    // pop();
    //
    // //detector
    // push();
    // translate(this.detector.body.position.x, this.detector.body.position.y);
    // rotate(this.detector.body.angle);
    // rectMode(CENTER);
    // fill(255, 50);
    // noStroke();
    // rect(0, 0, this.detector.w, this.detector.h);
    // pop();

    //plug
    push();
    translate(this.plug.body.position.x, this.plug.body.position.y);
    rotate(this.plug.body.angle);
    rectMode(CENTER);
    fill(0, 200);
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
        fill(0, 125);
        noStroke();
        rect(0, 0, this.segmentSize * 2.5, this.segmentSize * 2.5);
        pop();
      }
    }

    //outlet
    push();
    translate(this.outlet.body.position.x, this.outlet.body.position.y);
    rotate(this.outlet.body.angle);
    imageMode(CENTER);
    fill(0, 150);
    noStroke();
    image(img[24], 0, 0);
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

    if (this.outlet.plugged) {
      //dial buttons
      //button0
      push();
      translate(this.compoundBody.position.x, this.compoundBody.position.y);
      rotate(this.compoundBody.angle);
      translate(this.dial.button0.xOff, this.dial.button0.yOff);
      ellipseMode(CENTER);
      noStroke();
      if (this.dial.button0.active) {
        fill(255, 200);
        ellipse(0, 0, this.dial.button0.radius*2, this.dial.button0.radius*2);
      }
      else {

      }
      pop();

      //button1
      push();
      translate(this.compoundBody.position.x, this.compoundBody.position.y);
      rotate(this.compoundBody.angle);
      translate(this.dial.button1.xOff, this.dial.button1.yOff);
      ellipseMode(CENTER);
      noStroke();
      if (this.dial.button1.active) {
        fill(255, 200);
        ellipse(0, 0, this.dial.button1.radius*2, this.dial.button1.radius*2);
      }
      else {

      }
      pop();
    }
  }
}
