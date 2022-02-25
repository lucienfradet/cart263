//Allows to display a talking mouth somewhere

class Mouth {
  constructor({x, y, w, angle}) {
    this.img = {
      frame1: img[26],
      frame2: img[27],
      frame3: img[28],
      frame4: img[29]
    }

    this.pos = {
      x: x,
      y: y,
      w: w,
      h: this.img.frame1.height / this.img.frame1.width * w, //set height with image size ratio
      angle: angle
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    angleMode(DEGREES);
    rotate(this.pos.angle);
    imageMode(CENTER);
    if (frameCount % 40 < 15) {
      image(this.img.frame1, 0, 0, this.pos.w, this.pos.h);
    }
    else if (frameCount % 30 < 15) {
     image(this.img.frame2, 0, 0, this.pos.w, this.pos.h);
    }
    else if (frameCount % 20 < 15) {
      image(this.img.frame3, 0, 0, this.pos.w, this.pos.h);
    }
    else if (frameCount % 10 < 15) {
      image(this.img.frame4, 0, 0, this.pos.w, this.pos.h);
    }
    pop();
  }
}
