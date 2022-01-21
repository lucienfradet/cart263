//City layout
//Creates the city grid, creates the building and deals with position
//contains arrays for grid and buildings

class City {
  constructor(size) {
    //More variables than needed but I decided to simplefy everything and make everything a square while still keeping the possibility of changing it in the future
    this.cityDimension = 800;
    this.numRow = size;
    this.numCol = this.numRow;
    this.cellWidth = this.cityDimension / this.numRow;
    this.cellHeight = this.cityDimension / this.numCol;
    this.streetWidth = 0; //arbitrary ratio according to the building size //Not Used since it's not really buildings anymore
    this.rotation = 0;

    this.grid = [];

    this.buildings = [];
    this.pNoise = { //2D noise to dertermine the height of the buildings. Would have been nice to animate but figured the double forLoops would drop frameRate if out of setup
      xOff:0,
      yOff:0,
      increment: 0.2
    }
    this.buildingHeight = {
      min: 25,
      max: 150
    }

    this.createGrid();
    this.createBulding();
  }

  //Grid city layout generator
  createGrid() {
    for (let x = 0; x < this.numRow; x++) {
      this.pNoise.xOff = 0;
      for (let y = 0; y < this.numCol; y++) {
        let tile = {
          x: y * this.cellHeight,
          y: x * this.cellWidth,
          noise: noise(this.pNoise.xOff, this.pNoise.yOff, this.pNoise.zOff)
        }
        this.grid.push(tile);
        this.pNoise.xOff += this.pNoise.increment;
      }
      this.pNoise.yOff += this.pNoise.increment;
    }
  }

  //Creates a single array with all the buildings fallowing the grid and noise values
  createBulding() {
    for (let i = 0; i < this.grid.length; i++) {
      let tile = this.grid[i];
      let config = {
        x: undefined,
        y: undefined,
        z: undefined,
        baseWidth: this.cellWidth - this.streetWidth,
        baseHeight: this.cellHeight -this.streetWidth,
        h: map(tile.noise, 0, 1, this.buildingHeight.min, this.buildingHeight.max), //maps the noise to the building heights
        colorA: map(tile.noise, 0, 1, 50, 255), //Same thing with noise and colors
        colorB: map(tile.noise, 0, 1, 100, 255) //Numbers are arbitrary, I like the colors they provide!
      }
      //offset so x and y relate to the upper left corner of the box and match the grid //Boxes are always drawn from their XYZ center!
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
