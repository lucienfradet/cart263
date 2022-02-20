/* ---> matter.js <--- PHYSICS ENGINE */

//module aliases for matter.js
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Runner = Matter.Runner,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

class Physics {
  constructor() {
    this.engine = Engine.create({ gravity: {y: 1} }); //creates a world with default settings
    this.world = this.engine.world; //world in the engine for further use
    this.runner = Runner.create(); //not in use

    //Create MouseConstraint
    canvas.mouse = Mouse.create(canvas.obj.elt); //canvas element in the P5.js canvas wrapper
    canvas.mouse.pixelRatio = pixelDensity(); //Adapt to the pixel density of the screen in use
    let options = {
      mouse: canvas.mouse,
      constraint: {
        stiffness: 0.009,
        angularStiffness: 0.2
      }
    }
    this.mConstraint = MouseConstraint.create(this.engine, options);
    Composite.add(this.world, this.mConstraint);
    //Adjust the offset caused by the canvasTest fuckery
    this.mConstraint.mouse.offset.x = -testCanvas.w/2 + canvas.w/2;
    this.mConstraint.mouse.offset.y = -testCanvas.h/2 + canvas.h/2;

    this.mConstraint.collisionFilter.mask = defaultCategory | poiCategory | phoneCategory; //objects in the back shall not be draggable
  }

  //Run that damn physics engine baby!
  runWorld() {
    Runner.run(this.engine);
  }

  addToWorld(array) {
    Composite.add(physics.world, array);
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

  //display mConstraint for testing
  displayMouseConstraint() {
    push();
    let pos = {
      x: this.mConstraint.mouse.position.x,
      y: this.mConstraint.mouse.position.y
    }
    fill(255,255,255,150);
    noStroke();
    ellipseMode(CENTER);
    ellipse(pos.x, pos.y, 10);
    pop();

    //display line
    if (this.mConstraint.body) {
      let pos = this.mConstraint.body.position;
      let offset = this.mConstraint.constraint.pointB;
      let mouse = this.mConstraint.mouse.position;
      push();
      stroke(0, 255, 0);
      line(pos.x + offset.x, pos.y + offset.y, mouse.x, mouse.y);
      pop();
    }
  }
}
