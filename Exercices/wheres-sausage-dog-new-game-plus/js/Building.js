//Buildings/Terrain objects

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

    this.posInitial = { //Stocking the value before the start shaking so they return to the initial position
      x: this.x,
      y: this.y
    }

    this.dead = false; //True when the building has been digged out by the Selector
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
      this.vibratoum(); //VIBRATOUUUUM!!!!!!!!!
    }
    else {
      this.x = this.posInitial.x;
      this.y = this.posInitial.y;
    }

    if (this.dead) {
      this.z += 15; //Ships the damn block out in the sky. //Would be interesting to remove them from the array afterwards but heh...
    }
  }

  vibratoum() { //VIBRATOOOOOOOUUUM SACRAMENT! //shakes building and stuff. great classic.
    //if (!this.dead) {
      this.x += random(-5, 5);
      this.x = constrain(this.x, this.posInitial.x - 5, this.posInitial.x + 5);

      this.y += random(-5, 5);
      this.y = constrain(this.y, this.posInitial.y - 5, this.posInitial.y + 5);
    //}

  }

  //see description in script.js
  mousePressed() {
    this.posInitial.x = this.x;
    this.posInitial.y = this.y;
  }
}
