// module aliases
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Render = Matter.Render,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Common = Matter.Common,
    Composite = Matter.Composite,
    Collision = Matter.Collision,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Constraint = Matter.Constraint;

var engine;
var world;
var runner;
var mConstraint;
var bounds = [];

let img;
let modetext;
function preload() {
    img = loadImage("assets/landscape.jpg");
}

function setup() {
    var canvas = createCanvas(1100, 600);
    img.resize(1100, 600);

    resetbtn = createButton("Reset");
    resetbtn.mousePressed(resetSketch);

    trainbtn = createButton("Train");
    trainbtn.mousePressed(train);

    inferencebtn = createButton("Inference");
    inferencebtn.mousePressed(inference);

    engine = Engine.create();

    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 1100,
            height: 600,
            showAngleIndicator: true
        }
    });

    world = engine.world;

    // run the renderer
    Render.run(render);

    runner = Runner.create();

    Runner.run(runner, engine);

    var boundoptions = {
        isStatic: true,
    }
    //ground
    var ground = new Boundary(width / 2, height, width, width / 6);
    bounds.push(ground);

    modetext = "Idle";
    stickman = new Ragdoll(300, 200, ground);
    //walls
    bounds.push(new Boundary(0, height / 2, 20, height));
    bounds.push(new Boundary(width, height / 2, 20, height));
    //ceiling
    bounds.push(new Boundary(width / 2, 0, width, 20));

    var canvasmouse = Mouse.create(canvas.elt);
    canvasmouse.pixelRatio = pixelDensity();
    var options = {
        mouse: canvasmouse
    }

    mConstraint = MouseConstraint.create(engine, options);
    Composite.add(world, mConstraint);
}

function draw() {
    //Engine.update(engine)
    image(img, 0, 0);
    textSize(27);
    fill(207, 57, 83);
    strokeWeight(0);
    text(modetext, 10, 40);
    stickman.update();

    console.log(stickman.dead);

    for (const bound of bounds) {
        bound.show();
    }
}

function train() {
    modetext = "Training...";
    let val = random(255);
    background(val);
}

function resetSketch() {
    modetext = "Idle";
    stickman.removeFromWorld();
    stickman = new Ragdoll(300, 200);
}

function inference() {
    modetext = "Inference";
}