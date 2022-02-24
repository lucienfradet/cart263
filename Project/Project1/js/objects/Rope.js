class Rope extends Thing {
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

    //base



    //rope thing
    this.rope = [];
    this.segmentSize = 10
    const NUM_ROPE_SEGMENTS = 15;
    let start = this.map.y + this.map.h/2;
    let end = this.ring.top.y - this.ring.top.h/2;
    let spaceBetween = (end - start)/NUM_ROPE_SEGMENTS;

    let previous = null;
    for (let y = start + spaceBetween; y < end - spaceBetween - this.segmentSize/2; y += spaceBetween + this.segmentSize/2) {
      let segment = Bodies.rectangle(this.map.x, y, this.segmentSize, this.segmentSize, {
        collisionFilter: {
          category: defaultCategory,
          mask: defaultCategory
          }
      });
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

      physics.addToWorld([
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
    physics.addToWorld([constrain]);
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
    image(img.book, 0, 0, this.w, this.h);
    pop();
  }
}
