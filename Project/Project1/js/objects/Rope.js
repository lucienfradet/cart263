//Rope that the player pulls once he has the tableau. Instead of waiting for the timer to funish

class Rope extends Thing {
  constructor({x, y, w, h, category, mask}) {
    super();
    this.pos = { //pos of the start of the rope
      x: x,
      y: y
    };
    this.w = w; //width of the base
    this.h = h; //length of the rope
    this.category = category;
    this.mask = mask;

    this.delay = 0;

    this.baseHeightRatio = 1.5;
    //base
    this.base = {
      body: undefined,
      x: this.pos.x,
      y: this.pos.y + this.h + this.w*this.baseHeightRatio/2,
      w: this.w,
      h: this.w*this.baseHeightRatio
    }

    this.base.body = Bodies.rectangle(this.base.x, this.base.y, this.base.w, this.base.h, {
      collisionFilter: {
        category: this.category,
        mask: this.mask
      }
    });
    Composite.add(physics.world, this.base.body);

    //rope
    this.rope = [];
    this.segmentSize = 10
    const NUM_ROPE_SEGMENTS = 15;
    let start = this.pos.y;
    let end = this.pos.y + this.h;
    let spaceBetween = (end - start)/NUM_ROPE_SEGMENTS;

    let previous = null;
    for (let y = start + spaceBetween; y < end - spaceBetween - this.segmentSize/2; y += spaceBetween + this.segmentSize/2) {

      let fixed = false;
      if (!previous) { //make the first one static
        fixed = true;
      }

      let segment = Bodies.rectangle(this.pos.x, y, this.segmentSize, this.segmentSize, {
        isStatic: fixed,
        collisionFilter: {
          category: defaultCategory,
          mask: defaultCategory
          }
      });
      this.rope.push(segment);

      if (previous) {
        let constrain = undefined;
        constrain = Constraint.create({
          bodyA: previous,
          bodyB: segment,
          stiffness: 1,
          length: spaceBetween
        });
        this.rope.push(constrain);

        physics.addToWorld([
          segment,
          constrain
        ])
      }
      else {
        physics.addToWorld([
          segment
        ])
      }
      previous = segment;
    }

    //Attach the last segment to the ropeHead
    let lastRopeID = this.rope.length - 1;
    if (this.rope[lastRopeID].label === 'Constraint') {
      lastRopeID = this.rope.length - 2;
    }
    let constrain = Constraint.create({
        bodyA: this.rope[lastRopeID],
        bodyB: this.base.body,
        pointB: { x: 0, y: -this.base.h/2 },
        stiffness: 1,
        length: spaceBetween
      });
    this.rope.push(constrain);
    physics.addToWorld([constrain]);
  }

  //check if the rope is pulled
  update() {
    if (this.base.body.position.y + this.base.h/2 > canvas.h/2 -25) {
      this.delay = 0;
      let tableau = state.findArrayID('tableau');
      if (tableau !== undefined) {
        snd[16].play(); //bells
        snd[15].play(); //yes
        state = new EndWin();
      }
      else {
        if (this.delay === 0) {
          snd[16].play(); //bells
          state = new EndLost();
          this.delay++;
        }
      }
    }
  }

  display() {
    //base
    push();
    translate(this.base.body.position.x, this.base.body.position.y);
    rotate(this.base.body.angle);
    imageMode(CENTER);
    noStroke();
    image(img[13], 0, 0);
    pop();

    //Rope segments
    for (let i = 0; i < this.rope.length; i++) { //Every other is a constraint in the rope array
      if (this.rope[i].label !== 'Constraint') {
        push();
        translate(this.rope[i].position.x, this.rope[i].position.y);
        rotate(this.rope[i].angle);
        imageMode(CENTER);
        noStroke();
        image(img[14], 0, 0);
        pop();
      }
    }
  }
}
