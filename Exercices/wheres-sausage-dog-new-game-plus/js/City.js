//City layout

class City {
  constructor() {
    this.numRow = 100;
    this.numCol = 75;
    this.cellWidth = canvas.w / this.numRow;
    this.cellHeight = canvas.h / this.numCol;

    this.grid = [];
    this.buildings = [];
    this.createGrid();
    this.createBulding();

  }

  createGrid() {
    for (let x = 0; x < this.numRow; x++) {
      for (let y = 0; y < this.numCol; y++) {
        let tile = {
          x: x * this.cellHeight,
          y: y * this.cellWidth
        }
        this.grid.push(tile);
      }
    }
  }

  createBulding() {
    for (let i = 0; i < this.grid.length; i++) {
      let tile = this.grid[i];
      let config = {
        x: undefined,
        y: undefined,
        z: undefined,
        baseWidth: this.cellWidth,
        baseHeight: this.cellHeight,
        h: random(15, 75)
      }
      //offset so x and y relate to the upper left corner of the box and match the grid
      config.x = tile.x + config.baseWidth/2;
      config.y = tile.y + config.baseHeight/2;
      config.z = 0 + config.h/2;

      let building = new Building(config)
      this.buildings.push(building);
    }
  }

  adjustFrame() {
    translate(-width/2, -height/4, -400);
    rotateX(PI/3);
  }

}
