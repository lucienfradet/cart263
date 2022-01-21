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
  }

  display() {
    push();
    noStroke();
    fill(this.colorA, this.colorB, this.colorA);
    translate(this.x, this.y, this.z);
    box(this.baseWidth,  this.baseHeight, this.h);
    pop();
  }
}
