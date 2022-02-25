//The game is on a timer represented by a window and a boat approaching

class Timer {
  constructor() {
    this.w = 400;
    this.h = 175;
    this.pos = {
      x: canvas.w - this.w/2,
      y: this.h/2
    };

    this.timerValue = 3 * 60 * 60; //(minutes * seconds * frames)
    this.timer = this.timerValue;

    this.frames = [
      img[6],
      img[7],
      img[8],
      img[9],
      img[10],
      img[11]
    ];
  }

  update() {
    //Checks if the timer is over or not
    this.timer--;
    if (this.timer < 0) {
      //spawning the tableau is the end goal
      let tableau = state.findArrayID('tableau');
      if (tableau !== undefined) {
        snd[16].play(); //bells
        snd[15].play(); //yes
        state = new EndWin();
      }
      else {
        snd[17].play();
        state = new EndTimeOut();
      }
    }
  }

  display() {
    push();
    rectMode(CENTER);
    imageMode(CENTER);
    noStroke();
    fill(230);
    let xOff = 50;
    rect(this.pos.x - xOff, this.pos.y, this.w, this.h);

    let step = this.timerValue / this.frames.length;
    if (this.timer <= this.timerValue && this.timer > step * 5) {
      image(this.frames[0], this.pos.x - xOff, this.pos.y);
    }
    else if (this.timer <= step * 5 && this.timer > step * 4) {
      image(this.frames[1], this.pos.x - xOff, this.pos.y);
    }
    else if (this.timer <= step * 4 && this.timer > step * 3) {
      image(this.frames[2], this.pos.x - xOff, this.pos.y);
    }
    else if (this.timer <= step * 3 && this.timer > step * 2) {
      image(this.frames[3], this.pos.x - xOff, this.pos.y);
    }
    else if (this.timer <= step * 2 && this.timer > step * 1) {
      image(this.frames[4], this.pos.x - xOff, this.pos.y);
    }
    else if (this.timer <= step) {
      image(this.frames[5], this.pos.x - xOff, this.pos.y);
    }
    pop();
  }
}
