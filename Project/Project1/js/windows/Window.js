class Window {
  constructor({type, id}) {
    this.id = id;
    this.type = type;
    this.items = [];

    if (type === 'map') {

      this.layout = {
        x: canvas.w/2,
        y: canvas.h/2,
        w: 400,
        h: 300,
        thickness: 30,
        buttonRadius: 15
      }

      if (id === 'shack') {
        let book = {
          name: 'book',
          obj: new Book({
            x: this.layout.x,
            y: this.layout.y,
            w: 50,
            h: 50*1.5,
            category: poiCategory,
            mask: defaultCategory | poiCategory
          })
        }

        this.items.push(book);
      }

      if (id === 'phoneBooth') {
          let combine = {
            name: 'combine',
            obj: new Combine({
              x: this.layout.x - this.layout.w/10 * 2,
              y: this.layout.y + this.layout.w/10 * 2,
              category: poiCategory,
              mask: defaultCategory | poiCategory
            })
          }
          this.items.push(combine);
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
  }

  //Removes bodies from the physics and clears the POIwindow object
  //ALSO pushes objects to the main objects array if they've been taken out the POI
  //AND deactivate the POI if the object of interest is out of it
  removeFromWorld() {
    Composite.remove(physics.world, this.compoundBody);
    if (this.id !== 'phoneBooth') {
      for (let i = 0; i < this.items.length; i++) {
        let itemBody = this.items[i].obj.body; //IMPORTANT to have objects inside body property!
        if (itemBody.collisionFilter.category !== defaultCategory) { //check if it's in the main world or still in the window
          Composite.remove(physics.world, itemBody);
        }
        else {
          this.turnOffMapPOI();
          state.objects.push(this.items[i]); //push the object inside the main world
        }
      }
    }
    else { //special case for the complicated phone compoundbody...
      let combine = this.items[0].obj;
      if (combine.compoundBody.collisionFilter.category !== defaultCategory) {
        Composite.remove(physics.world, [combine.compoundBody, combine.plug.body]);
        for (let i = 0; i < combine.cable.length; i++) {
          let thing = combine.cable[i];
          if (thing.type === 'body') {
            Composite.remove(physics.world, thing);
          }
        }
      }
      else {
        this.turnOffMapPOI();
        state.objects.push(this.items[0]);
      }
    }
    state.POIwindow = undefined;
  }

  turnOffMapPOI() {
    //Turn off the POI if object of interest is out!
    let mapID = state.findArrayID('map');
    let poiID = state.objects[mapID].obj.findPOIID(this.id); //(I'm aware that most of my nameID should not only be called 'id'... It gets really confusing indeed.)
    state.objects[mapID].obj.POI[poiID].active = false;
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

        if (this.id === 'phoneBooth') { //special case for the complicated combine...
          let combine = this.items[0].obj;
          combine.plug.body.collisionFilter.category = defaultCategory;
          combine.plug.body.collisionFilter.mask = defaultCategory;
          for (let i = 0; i < combine.cable.length; i++) {
            let thing = combine.cable[i];
            if (thing.type === 'body') {
              thing.collisionFilter.category = defaultCategory;
              thing.collisionFilter.mask = defaultCategory;
            }
          }
        }
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

    if (this.id !== 'phoneBooth') {
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
    else {  //special case for the complicated combine...

    }
  }

  //Function to find the id of a specifc object in the objects array
  findArrayID(name) {
    for (let i = 0; i < this.items.length; i++) {
      let objectName = this.objects[i].name;
      if (objectName === name) {
        return i;
      }
    }
    console.log("ERROR: the array doen't contain the name you are looking for");
  }

  update() {
    if (this.id === 'phoneBooth') {
      this.getOutOfBox(this.items[0].obj.compoundBody);
    }
    //these are for testing and should be removed!
    //else {this.getOutOfBox(this.items[0].obj.body);}
    //this.getInTheBox(state.objects[state.findArrayID('book')].obj.body);
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

    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i].obj;
      item.display();
      item.update();
    }
  }
}
