class Building {
  constructor({
    x,
    y,
    z,
    baseWidth,
    baseHeight,
    h,
    colorA,
    colorB
  }) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    this.h = h;
    this.colorA = colorA;
    this.colorB = colorB;

    this.posInitial = {
      x: this.x,
      y: this.y
    }

    this.dead = false;
  }

  display() {
    push();
    noStroke();
    fill(this.colorA, this.colorB, this.colorA);
    translate(this.x, this.y, this.z);
    box(this.baseWidth,  this.baseHeight, this.h);
    pop();
  }

  update() {
    if (mouseIsPressed) {
      this.vibratoum(); //VIBRATOUUUUM
    }
    else {
      this.x = this.posInitial.x;
      this.y = this.posInitial.y;
    }

    if (this.dead) {
      this.z += 15;
    }
  }

  vibratoum() {
    //if (!this.dead) {
      this.x += random(-5, 5);
      this.x = constrain(this.x, this.posInitial.x - 5, this.posInitial.x + 5);

      this.y += random(-5, 5);
      this.y = constrain(this.y, this.posInitial.y - 5, this.posInitial.y + 5);
    //}

  }

  mousePressed() {
    this.posInitial.x = this.x;
    this.posInitial.y = this.y;
  }
}
