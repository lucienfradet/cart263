class Treasure {
  constructor() {
    this.img = img.clown;
    this.size = 150;
    this.x = random(0 + this.size/2, city.cityDimension - this.size/2);
    this.y = random(0 + this.size/2, city.cityDimension - this.size/2);
    this.z = 25;
    this.rotationSpeed = 0;
    this.isFree = false;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    rotateZ(this.rotationSpeed);
    imageMode(CENTER);
    image(this.img, 0, 0, this.size, this.size);
    pop();
  }

  checkCollision() {
    let overlap = false;

    loop1:
    while (!overlap) {
      overlap = true; //prendre pour acquis que overlap
      for (let i = 0; i < city.buildings.length; i++) {
        let build = city.buildings[i];
        if (build.x - build.baseWidth/2 >= this.x + this.size/2 //building to the right
          || build.y - build.baseWidth/2 >= this.y + this.size/2 //building on top
          || build.x + build.baseWidth/2 <= this.x - this.size/2 //building to the left
          || build.y + build.baseWidth/2 <= this.y - this.size/2) { //building under
          //not overlapping
        }
          //overlapping
        else if (!build.dead) { //check if the building is still active
          overlap = false; //it is so start the loop again
          break loop1;
        }
        else {
          this.isFree = true;
        }
      }
        //no overlapping/active buildings we did it
    }

  }

  freedom() {
    this.size += random(0, 5);
    this.rotationSpeed += 0.01;
    this.z += 0.1;

    if (this.size > 500) {
      resetCity();
    }
  }
}
