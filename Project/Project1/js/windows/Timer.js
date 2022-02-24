class Timer {
  constructor() {
    this.w = 350;
    this.h = 125;
    this.pos = {
      x: canvas.w - this.w/2,
      y: this.h/2
    };

    this.timerValue = 120 * 60; //(seconds * frames)
    this.timer = this.timerValue;

    this.frames = [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ];
  }

  update() {
    this.timer--;
    if (this.timer < 0) {
      console.log('gameOver Big');
    }
  }

  display() {
    push();
    noStroke();

    let step = this.timerValue / this.frames.length;
    if (this.timer <= this.timerValue && this.timer > step * 4) {
      fill(0, 100, 111);
    }
    else if (this.timer <= step * 4 && this.timer > step * 3) {
      fill(0, 128, 142);
    }
    else if (this.timer <= step * 3 && this.timer > step * 2) {
      fill(0, 160, 178);
    }
    else if (this.timer <= step * 2 && this.timer > step * 1) {
      fill(0, 200, 222);
    }
    else if (this.timer <= step) {
      fill(0, 230, 255);
    }

    rectMode(CENTER);
    rect(this.pos.x, this.pos.y, this.w, this.h);
    pop();
  }
}
