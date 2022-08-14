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
let ground;
let customOption;

let stickmen;
let bestStickman;

const count = 100;

function generateStickmen(count) {
    const stickmen = [];
    for (let i = 0; i < count; i++) {
        stickmen.push(new Ragdoll(80, 200, ground, customOption));
    }
    return stickmen;
}

//preload resources
function preload() {
    img = loadImage("assets/landscape.jpg");
}

//initialisation of the sketch
function setup() {
    //creating the canvas
    var canvas = createCanvas(1100, 600);
    img.resize(1100, 600);

    //creating the engine
    engine = Engine.create();

    //creating the renderer
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

    //ground
    ground = new Boundary(width / 2, height, width, width / 6);
    bounds.push(ground);

    customOption = {
        collisionFilter: {
            group: Body.nextGroup(true),
        }
    };

    modetext = "Idle";

    //walls
    bounds.push(new Boundary(0, height / 2, 20, height));
    bounds.push(new Boundary(width, height / 2, 20, height));
    //ceiling
    bounds.push(new Boundary(width / 2, 0, width, 20));

    //mouse constraint
    var canvasmouse = Mouse.create(canvas.elt);
    canvasmouse.pixelRatio = pixelDensity();
    var options = {
        mouse: canvasmouse
    }

    mConstraint = MouseConstraint.create(engine, options);
    Composite.add(world, mConstraint);
}

//drawing the canvas
function draw() {
    //Engine.update(engine)
    image(img, 0, 0);
    textSize(27);
    fill(207, 57, 83);
    strokeWeight(0);
    text(modetext, 10, 40);

    if (stickmen != null) {
        bestStickman = stickmen.find(s => s.score == Math.max(...stickmen.map(s => s.score)));


        for (let i = 0; i < stickmen.length; i++) {
            stickmen[i].update();
        }
        bestStickman.setTransparency(255);
        bestStickman.update();
    }

    for (const bound of bounds) {
        bound.show();
    }
}

//buttons
function saveModel() {
    localStorage.setItem("brainModel", JSON.stringify(bestStickman.brain));
}

function discardModel() {
    localStorage.removeItem("brainModel");
}

function clickReset() {
    modetext = "Idle";

    if (stickmen != null) {
        for (let i = 0; i < stickmen.length; i++) {
            stickmen[i].removeFromWorld();
        }
    }
}

function clickTrain() {
    modetext = "Training...";

    if (stickmen != null) {
        for (let i = 0; i < stickmen.length; i++) {
            stickmen[i].removeFromWorld();
        }
    }

    stickmen = generateStickmen(count);

    bestStickman = stickmen[0];

    if (localStorage.getItem("brainModel")) {
        bestStickman.brain = JSON.parse(localStorage.getItem("brainModel"));
    }
}

function clickInference() {
    modetext = "Inference";
}