class Window {
  constructor({type, id}) {
    if (type === 'map') {

      this.layout = {
        x: canvas.w/2,
        y: canvas.h/2,
        w: 250,
        h: 225,
        thickness: 10
      }

      this.items = [];
      if (id === 'shack') {
        let book = new Book({
          x: this.layout.x,
          y: this.layout.y,
          w: 50,
          h: 50*1.5,
          category: poiCategory,
          mask: defaultCategory | poiCategory
        })
        this.items.push(book);
      }
    }

    if (type === 'phone') {

    }

    this.partsConfig = [];
    this.parts = [];

    let topConfig = {
      x: this.layout.x,
      y: this.layout.y - this.layout.h/2 + this.layout.thickness/2,
      w: this.layout.w - 2 * this.layout.thickness,
      h: this.layout.thickness,
      options: {
        isStatic: true,
        collisionFilter: {
          group: 3
        }
      }
    }
    this.partsConfig.push(topConfig);
    this.parts.push(this.addRect(topConfig));

    let bottomConfig = {
      x: this.layout.x,
      y: this.layout.y + this.layout.h/2 - this.layout.thickness/2,
      w: this.layout.w - 2 * this.layout.thickness,
      h: this.layout.thickness,
      options: {
        isStatic: true,
        collisionFilter: {
          group: 3
        }
      }
    }
    this.partsConfig.push(bottomConfig);
    this.parts.push(this.addRect(bottomConfig));

    let leftConfig = {
      x: this.layout.x - this.layout.w/2 + this.layout.thickness/2,
      y: this.layout.y,
      w: this.layout.thickness,
      h: this.layout.h,
      options: {
        isStatic: true,
        collisionFilter: {
          group: 3
        }
      }
    }
    this.partsConfig.push(leftConfig);
    this.parts.push(this.addRect(leftConfig));

    let rightConfig = {
      x: this.layout.x + this.layout.w/2 - this.layout.thickness/2,
      y: this.layout.y,
      w: this.layout.thickness,
      h: this.layout.h,
      options: {
        isStatic: true,
      }
    }
    this.partsConfig.push(rightConfig);
    this.parts.push(this.addRect(rightConfig));

    this.compoundBody = this.createBody(this.parts);
    this.composite = Composite.add(physics.world, this.compoundBody);

    Body.setStatic(this.compoundBody, true);

    //Set collisionFilters
    this.compoundBody.collisionFilter.category = poiCategory;
    this.compoundBody.collisionFilter.mask = defaultCategory | poiCategory;

    console.log(this.compoundBody);
  }

  //next two function are from CART253 - Project 2
  //Creates rectangular matter.js bodies
  addRect({ x, y, w, h, options = {} }) {
	let body = Bodies.rectangle(x, y, w, h, options);
	return body;
  }

  //Create the compoundBody with the different parts
  createBody(parts) {
    let compoundBody = Body.create({ parts: parts });
    return compoundBody;
  }

  update() {

  }

  display() {
    //background
    push();
    rectMode(CENTER);
    fill(0, 150);
    rect(this.layout.x, this.layout.y, this.layout.w, this.layout.h);
    pop();
    //Cadre if needed
    for (let i = 1; i < this.parts.length; i++) { //the first element in a compound Body is a reference body that shouldn't be displayed
      let part = this.parts[i];
      let partConfig = this.partsConfig[i - 1];
      push();
      translate(part.position.x, part.position.y);
      rotate(part.angle);
      rectMode(CENTER);
      fill(255, 150);
      noStroke();
      rect(0, 0, partConfig.w, partConfig.h);
      pop();
    }

    //items
    if (this.items.length > 0) {
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        item.display();
        item.update();
      }
    }
  }
}
