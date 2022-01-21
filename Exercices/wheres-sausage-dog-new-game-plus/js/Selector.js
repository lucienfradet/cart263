class Selector {
  constructor() {
    this.size = 5;
    this.x = undefined;
    this.y = undefined;
    this.z = undefined;

    this.dist = [];
    this.selected = undefined;
  }

  display() {
    push();
    noStroke();
    fill(204, 0, 112);
    translate(this.x, this.y, this.z);
    if (mouseIsPressed) {
      sphere(this.size * 4);
    }
    else {
      sphere(this.size);
    }
    pop();
  }

  update() {
    this.x = map(mouseX, 0, width, 0, city.grid[city.grid.length - 1].x + city.buildings[0].baseWidth);
    this.x = constrain(this.x, city.grid[0].x, city.grid[city.grid.length - 1].x + city.buildings[0].baseWidth);

    this.y = map(mouseY, 0, height, 0, city.grid[city.grid.length - 1].y + city.buildings[0].baseWidth);
    this.y = constrain(this.y, city.grid[0].y, city.grid[city.grid.length - 1].y + city.buildings[0].baseWidth);

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
    this.selected = smallest;
    return smallest;
  }

}
