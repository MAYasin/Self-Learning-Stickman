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
let gentext;
let customOption;
let slider;
let h3;

let stickmen;
let genCount = 0;
let bestStickman;

let starttime;

let writer;
let log = [];

let stoppingAlgo;


function generateStickmen(count, time) {
    const stickmen = [];
    for (let i = 0; i < count; i++) {
        stickmen.push(new Ragdoll(80, height / 1.4, bounds, customOption, time, genCount));
    }

    bestStickman = stickmen[0];
    return stickmen;
}

//preload resources
function preload() {
    img = loadImage("assets/landscape.jpg");
}

//initialisation of the sketch
function setup() {
    discardModel();
    stoppingAlgo = false;
    starttime = new Date();
    genCount = 0;
    //creating the canvas
    var canvas = createCanvas(1100, 600);
    img.resize(1100, 600);

    //slider
    slider = select('#slider');
    h3 = select('h3');

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

    customOption = {
        collisionFilter: {
            group: Body.nextGroup(true),
        }
    };

    modetext = "Idle";
    gentext = "Gen: undefined";

    //ground
    bounds.push(new Boundary(width / 2, height, width, width / 6));
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
    h3.html(slider.value() == 0 ? 1 : slider.value());
    //Engine.update(engine)
    image(img, 0, 0);
    textSize(27);
    fill(207, 57, 83);
    strokeWeight(0);
    text(modetext, 10, 40);
    text(gentext, 850, 40);

    if (stickmen != null) {

        stickmen.forEach(stickman => stickman.resetTransparency());
        bestStickman = stickmen.find(s => s.score == Math.max(...stickmen.map(s => s.score)));
        bestStickman.setTransparency(255);

        stickmen.forEach(stickman => stickman.update());

        var alldead = stickmen.every(s => s.dead);

        if (bestStickman.score > 950) {
            alldead = true;
            stoppingAlgo = true;
        }

        if (alldead) {
            genCount += 1;

            saveModel();
            for (let i = 0; i < stickmen.length; i++) {
                stickmen[i].removeFromWorld();
            }

            stickmen = undefined;

            if (!stoppingAlgo) {
                stickmen = generateStickmen(slider.value() == 0 ? 1 : slider.value(), new Date());

                if (localStorage.getItem("brainModel")) {

                    stickmen.forEach((element, index) => {
                        element.brain = JSON.parse(localStorage.getItem("brainModel"));
                        if (index != 0) {
                            NeuralNetwork.mutate(element.brain, 0.1);
                        }
                    });
                }
            } else {
                stoppingAlgo = false;
                genCount = 0;
                modetext = "Idle";
                saveLog();
                saveModelObj();
                discardModel();
            }
        }

    }

    gentext = "Gen: " + (stickmen == null ? "undefined" : genCount);

    for (const bound of bounds) {
        bound.show();
    }

    strokeWeight(10);
    stroke(0, 255, 0);
    line(80, 400, 80, 510);

    stroke(255, 0, 0);
    line(1030, 400, 1030, 510);
}

//html utils
function saveModel() {
    localStorage.setItem("brainModel", JSON.stringify(bestStickman.brain));

    log.push(bestStickman.getLog());
}

function discardModel() {
    localStorage.removeItem("brainModel");
}

function clickReset() {
    discardModel();
    genCount = 0;
    modetext = "Idle";

    if (stickmen != null) {
        for (let i = 0; i < stickmen.length; i++) {
            stickmen[i].removeFromWorld();
        }
    }

    stickmen = undefined;
}

function clickTrain() {
    genCount = 0;
    if (stickmen != null) {
        for (let i = 0; i < stickmen.length; i++) {
            stickmen[i].removeFromWorld();
        }
    }
    stickmen = undefined;

    stickmen = generateStickmen(slider.value() == 0 ? 1 : slider.value(), new Date());

    modetext = "Training... " + stickmen.length + " stickmen";
}

function clickInference() {
    modetext = "Inference";
    gentext = "Gen: 1000";
}

function saveLog() {
    writer = createWriter('Log.json');
    writer.write(JSON.stringify(log));
    writer.close();
}

function saveModelObj() {
    writer = createWriter('Model.json');
    writer.write(localStorage.getItem("brainModel"));
    writer.close();
}