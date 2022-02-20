class Window {
  constructor({type, id}) {
    this.items = [];

    if (type === 'map') {

      this.layout = {
        x: canvas.w/2,
        y: canvas.h/2,
        w: 270,
        h: 245,
        thickness: 30,
        buttonRadius: 15
      }

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
    }
    this.partsConfig.push(topConfig);
    this.parts.push(physics.addRect(topConfig));

    let bottomConfig = {
      x: this.layout.x,
      y: this.layout.y + this.layout.h/2 - this.layout.thickness/2,
      w: this.layout.w - 2 * this.layout.thickness,
      h: this.layout.thickness,
    }
    this.partsConfig.push(bottomConfig);
    this.parts.push(physics.addRect(bottomConfig));

    let leftConfig = {
      x: this.layout.x - this.layout.w/2 + this.layout.thickness/2,
      y: this.layout.y,
      w: this.layout.thickness,
      h: this.layout.h,
    }
    this.partsConfig.push(leftConfig);
    this.parts.push(physics.addRect(leftConfig));

    let rightConfig = {
      x: this.layout.x + this.layout.w/2 - this.layout.thickness/2,
      y: this.layout.y,
      w: this.layout.thickness,
      h: this.layout.h,
    }
    this.partsConfig.push(rightConfig);
    this.parts.push(physics.addRect(rightConfig));

    this.compoundBody = physics.createBody(this.parts);
    Composite.add(physics.world, this.compoundBody);

    Body.setStatic(this.compoundBody, true);

    //Set collisionFilters
    this.compoundBody.collisionFilter.category = poiCategory;
    this.compoundBody.collisionFilter.mask = defaultCategory | poiCategory;

    console.log(this.compoundBody);
    console.log(this.items);
  }

  removeFromWorld() {
    Composite.remove(physics.world, this.compoundBody);
    for (let i = 0; i < this.items.length; i++) {
      let itemBody = this.items[i].body; //IMPORTANT to have objects inside body property!
      Composite.remove(physics.world, itemBody);
    }
    state.POIwindow = undefined;
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

    //button
    push();
    translate(
      this.compoundBody.position.x + this.layout.w/2 - this.layout.thickness/2,
      this.compoundBody.position.y - this.layout.h/2 + this.layout.thickness/2
    );
    rotate(this.compoundBody.angle);
    rectMode(CENTER);
    fill(255, 200);
    noStroke();
    ellipse(0, 0, this.layout.buttonRadius * 2);
    pop();

    //items
  //  if (this.items.length > 0) { //should I add this back??
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        item.display();
        item.update();
      }
  //  }
  }
}
