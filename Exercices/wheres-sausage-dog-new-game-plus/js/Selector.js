class Selector {
  constructor() {
    this.size = 10;
    this.x = undefined;
    this.y = undefined;
    this.z = undefined;

    this.dist = [];
  }

  display() {
    push();
    noStroke();
    fill(204, 0, 112);
    translate(this.x, this.y, this.z);
    sphere(this.size);
    pop();
  }

  update() {
    this.x = map(mouseX, 0, width, 0, city.grid[city.grid.length - 1].x);
    this.y = map(mouseY, 0, height, 0, city.grid[city.grid.length - 1].y);

    this.dist = [];
    for (let i = 0; i < city.buildings.length; i++) {
      let build = city.buildings[i];
      let d = dist(this.x, this.y, build.x, build.y);
      this.dist.push(d);
    }
    this.z = city.buildings[this.findSmallest(this.dist)].h;
  }

  findSmallest(array) { //Raymond Chen's inspired code found here: https://devblogs.microsoft.com/oldnewthing/20140526-00/?p=903
    let smallest = 0;
    for (let i = 1; i < array.length; i++) {
      if (array[i] < array[smallest]) {
        smallest = i;
      }
    }
    return smallest;
  }

}
