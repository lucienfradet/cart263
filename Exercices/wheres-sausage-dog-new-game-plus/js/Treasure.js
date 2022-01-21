class Treasure {
  constructor() {
    this.img = img.clown;
    this.x = random(0, city.cityDimension);
    this.y = random(0, city.cityDimension);
    this.z = 25;
    this.size = 150;
    this.isFree = false;
  }

  display() {
    push();
    translate(0, 0, this.z);
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.size, this.size);
    pop();
  }

  checkCollision() {
    let overlap = false;

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
          break;
        }
      }
        //no overlapping active buildings we did it
    }
    this.isFree = true;
    console.log('ITFUCKINGWORKS');
  }

  isFree() {
    console.log(ITFUCKINGWORKS);
  }
}
