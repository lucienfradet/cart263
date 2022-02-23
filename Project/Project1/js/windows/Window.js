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

  //Function to get bodies outside the windows and into the real world
  getOutOfBox(body) {
    //check if the mouse is grabbing something and return the body's ID
    let isItDragging = function() {
      if (physics.mConstraint.constraint.bodyB !== null) {
        return physics.mConstraint.constraint.bodyB.id;
      }
    }

    if (isItDragging() === body.id) {
      let mPos = physics.mConstraint.mouse.position;
      let lay = this.layout;
      let offset = -this.layout.thickness;
      if (
        mPos.x > lay.x + lay.w/2 - offset //to the right
        || mPos.x < lay.x - lay.w/2 + offset //to the left
        || mPos.y < lay.y - lay.h/2 + offset //above
        || mPos.y > lay.y + lay.h/2 - offset //under
      ) {
        //its trying to GET OUT!!!
        body.collisionFilter.category = defaultCategory;
        body.collisionFilter.mask = defaultCategory;
      }
    }
  }

  //Function to get bodies inside the windows and out the real world
  getInTheBox(body) {
    //check if the mouse is grabbing something and return the body's ID
    let isItDragging = function() {
      if (physics.mConstraint.constraint.bodyB !== null) {
        return physics.mConstraint.constraint.bodyB.id;
      }
    }

    if (isItDragging() === body.id) {
      let mPos = physics.mConstraint.mouse.position;
      let lay = this.layout;
      let offset = this.layout.thickness;
      if (
        mPos.x > lay.x + lay.w/2 - offset //to the right
        || mPos.x < lay.x - lay.w/2 + offset //to the left
        || mPos.y < lay.y - lay.h/2 + offset //above
        || mPos.y > lay.y + lay.h/2 - offset //under
      ) {

      }
      else {
        //its trying to GET IN!!!
        body.collisionFilter.category = poiCategory;
        body.collisionFilter.mask = defaultCategory | poiCategory;
      }
    }
  }


  update() {
    this.getOutOfBox(this.items[0].body);
    this.getInTheBox(state.objects[state.findArrayID('book')].obj.body);
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
