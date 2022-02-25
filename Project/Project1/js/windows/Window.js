class Window {
  constructor({type, id, cliché}) {
    this.id = id;
    this.img = cliché;
    this.type = type;
    this.items = [];

    if (type === 'map') {

      this.layout = {
        x: canvas.w/2,
        y: canvas.h/2,
        w: 400,
        h: 300,
        thickness: 30,
        buttonRadius: 15,
        category: poiCategory,
        mask: defaultCategory | poiCategory
      }

      if (id === 'shack') {
        let rat = {
          name: 'rat',
          obj: new Rat({
            x: this.layout.x,
            y: this.layout.y,
            w: 50,
            h: 25,
            category: poiCategory,
            mask: defaultCategory | poiCategory
          })
        }
        this.items.push(rat);
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

      if (id === 'postOffice') {
        this.background = undefined;
      }

      if (id === 'phoneLine') {
        this.background = undefined;
        this.switch = {
          xOff: 15, //from this.layout position
          yOff: 0,
          radius: 50,
          active: false,
          activate: function() { //turn the phone outlet on!
            let phoneID = state.findArrayID('phone');
            state.objects[phoneID].obj.outlet.active = true;
          }
        }
      }
    }

    if (type === 'phone') {
      this.layout = {
        x: canvas.w - canvas.w/4 + 25,
        y: canvas.h/2 - canvas.h/4 + 25,
        w: 200,
        h: 200,
        thickness: 30,
        buttonRadius: 0,
        category: phoneCategory,
        mask: defaultCategory | phoneCategory
      }
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
    this.compoundBody.collisionFilter.category = this.layout.category;
    this.compoundBody.collisionFilter.mask = this.layout.mask;
  }

  //Removes bodies from the physics and clears the POIwindow object
  //ALSO pushes objects to the main objects array if they've been taken out the POI
  //AND deactivate the POI if the object of interest is out of it
  removeFromWorld() {
    Composite.remove(physics.world, this.compoundBody);
    if (this.id !== 'phoneBooth') {
      for (let i = 0; i < this.items.length; i++) {
        let itemBody = this.items[i].obj.body; //IMPORTANT to have objects inside body property!
        if (itemBody.collisionFilter.category === poiCategory) { //check if it's in the main world or still in the window
          Composite.remove(physics.world, itemBody);
        }
        else if (itemBody.collisionFilter.category === poiCategory) { //check if item is in the phone window
          if (this.type === 'phone') {
            Composite.remove(physics.world, itemBody); //remove items if a phoneWindow is being closed
          }
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
          Body.setPosition(body, { x: mPos.x, y: mPos.y});
          body.collisionFilter.category = phoneCategory;
          body.collisionFilter.mask = defaultCategory | phoneCategory;
        }
      }
    }
    else {  //special case for the complicated combine...

    }
  }

  //Function to find the id of a specifc object in the items array
  findArrayID(name) {
    for (let i = 0; i < this.items.length; i++) {
      let objectName = this.items[i].name;
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

    if (this.id === 'shack') {
      this.getOutOfBox(this.items[0].obj.body);
    }

    if (this.id === 'hospital') {
      //is the rat in the main world or in an open POI?
      let objID = state.findArrayID('rat');
      if (objID !== undefined) {
        this.getInTheBox(state.objects[objID].obj.body);
      }
      if (state.POIwindow !== undefined && state.POIwindow.id === 'shack') {
        let ratID = state.POIwindow.findArrayID('rat');
        this.getInTheBox(state.POIwindow.items[ratID].obj.body);
        state.objects.push(state.POIwindow.items[ratID]); //push the object inside the main world
      }
    }

    //this.getInTheBox(state.objects[state.findArrayID('book')].obj.body);
  }

  display() {
    //Cadre if needed
    // for (let i = 1; i < this.parts.length; i++) { //the first element in a compound Body is a reference body that shouldn't be displayed
    //   let part = this.parts[i];
    //   let partConfig = this.partsConfig[i - 1];
    //   push();
    //   translate(part.position.x, part.position.y);
    //   rotate(part.angle);
    //   rectMode(CENTER);
    //   fill(255, 150);
    //   noStroke();
    //   rect(0, 0, partConfig.w, partConfig.h);
    //   pop();
    // }

    //button
    // push();
    // translate(
    //   this.compoundBody.position.x + this.layout.w/2 - this.layout.thickness/2,
    //   this.compoundBody.position.y - this.layout.h/2 + this.layout.thickness/2
    // );
    // rotate(this.compoundBody.angle);
    // rectMode(CENTER);
    // fill(255, 200);
    // noStroke();
    // ellipse(0, 0, this.layout.buttonRadius * 2);
    // pop();

    push();
    noStroke();
    rectMode(CENTER);
    fill(255, 230);
    rect(this.layout.x, this.layout.y, this.layout.w - 10, this.layout.h - 10);
    pop();

    if (this.id === 'phoneLine') {
      //display phoneSwitch
      push();
      imageMode(CENTER);
      if (this.switch.active) {
        image(this.img, this.layout.x, this.layout.y);
      }
      else {
        image(img[19], this.layout.x, this.layout.y);
      }
      pop();
    }
    else {
      push();
      imageMode(CENTER);
      image(this.img, this.layout.x, this.layout.y);
      pop();
    }

    if (this.type === 'phone') {
      push();
      imageMode(CENTER);
      image(img[31], this.layout.x, this.layout.y);
      pop();
    }

    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i].obj;
      item.display();
      item.update();
    }
  }
}
