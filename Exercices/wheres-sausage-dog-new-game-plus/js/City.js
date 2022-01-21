//City layout

class City {
  constructor() {
    this.cityDimension = 800;
    this.numRow = 75;
    this.numCol = this.numRow;
    this.cellWidth = this.cityDimension / this.numRow;
    this.cellHeight = this.cityDimension / this.numCol;
    this.streetWidth = this.cellWidth / 100; //arbitrary ratio according to the building size
    this.rotation = 0;

    this.grid = [];

    this.buildings = [];
    this.pNoise = {
      xOff:0,
      yOff:0,
      increment: 0.08
    }
    this.buildingHeight = {
      min: 25,
      max: 150
    }

    this.createGrid();
    this.createBulding();

  }

  createGrid() {
    for (let x = 0; x < this.numRow; x++) {
      this.pNoise.xOff = 0;
      for (let y = 0; y < this.numCol; y++) {
        let tile = {
          x: x * this.cellHeight,
          y: y * this.cellWidth,
          noise: noise(this.pNoise.xOff, this.pNoise.yOff, this.pNoise.zOff)
        }
        this.grid.push(tile);
        this.pNoise.xOff += this.pNoise.increment;
      }
      this.pNoise.yOff += this.pNoise.increment;
    }
  }

  createBulding() {
    for (let i = 0; i < this.grid.length; i++) {
      let tile = this.grid[i];
      let config = {
        x: undefined,
        y: undefined,
        z: undefined,
        baseWidth: this.cellWidth - this.streetWidth,
        baseHeight: this.cellHeight -this.streetWidth,
        h: map(tile.noise, 0, 1, this.buildingHeight.min, this.buildingHeight.max),
        colorA: map(tile.noise, 0, 1, 50, 255),
        colorB: map(tile.noise, 0, 1, 100, 255)
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


    translate(-width/2, -height/2, -700);
    rotateX(PI/3.5);
  }

}
