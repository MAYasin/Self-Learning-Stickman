class Ragdoll {
    constructor(x, y, ground, customOption) {
        this.x = x;
        this.y = y;
        this.dead = false;

        this.score = 0;

        this.brain = new NeuralNetwork([9, 8, 2]);

        this.torso = new Box(this.x, this.y, 20, 60, ground, customOption);

        this.head = new Head(this.x, this.y - 50, 18, ground, customOption);

        this.rhand = new Box(this.x + 25, this.y - 10, 30, 4, ground, customOption);
        this.lhand = new Box(this.x - 25, this.y - 10, 30, 4, ground, customOption);

        this.rleg = new Box(this.x + 10, this.y + 50, 8, 40, ground, customOption);
        this.lleg = new Box(this.x - 10, this.y + 50, 8, 40, ground, customOption);

        this.torsoToHead = Constraint.create({
            bodyA: this.torso.body,
            bodyB: this.head.body,
            pointA: { x: 0, y: -30 },
            pointB: { x: 0, y: 18 },
            stiffness: 1,
        });

        this.torsoToHeadA = Constraint.create({
            bodyA: this.torso.body,
            bodyB: this.head.body,
            pointA: { x: 0, y: 0 },
            pointB: { x: 0, y: 0 },
            stiffness: 1,
        });

        this.torsoToRhand = Constraint.create({
            bodyA: this.torso.body,
            bodyB: this.rhand.body,
            pointA: { x: 10, y: -10 },
            pointB: { x: -15, y: 0 },
            stiffness: 0.6,
        });
        this.torsoToLhand = Constraint.create({
            bodyA: this.torso.body,
            bodyB: this.lhand.body,
            pointA: { x: -10, y: -10 },
            pointB: { x: 15, y: 0 },
            stiffness: 0.6,
        });

        this.torsoToRleg = Constraint.create({
            bodyA: this.torso.body,
            bodyB: this.rleg.body,
            pointA: { x: 10, y: 30 },
            pointB: { x: 0, y: -20 },
            stiffness: 0.6,
        });
        this.torsoToLleg = Constraint.create({
            bodyA: this.torso.body,
            bodyB: this.lleg.body,
            pointA: { x: -10, y: 30 },
            pointB: { x: 0, y: -20 },
            stiffness: 0.6,
        });

        this.legToLeg = Constraint.create({
            bodyA: this.lleg.body,
            bodyB: this.rleg.body,
            stiffness: 0.01,
        });

        this.fullbody = Composite.add(world, [
            this.torsoToHead, this.torsoToHeadA, this.torsoToRhand, this.torsoToLhand, this.torsoToRleg, this.torsoToLleg, this.legToLeg
        ]
        );

        this.setTransparency(150);
    }

    setTransparency(alpha) {
        this.torso.transparency = alpha;
            this.head.transparency = alpha;
            this.rhand.transparency = alpha;
            this.lhand.transparency = alpha;
            this.rleg.transparency = alpha;
            this.lleg.transparency = alpha;
    }

    control(rotateLleg, rotateRleg) {
        if (!this.dead) {
            rotateRleg = rotateRleg/Math.pow(10, 1);
            rotateLleg = rotateLleg/Math.pow(10, 1);

            var xRval = (this.rleg.body.vertices[0].x + this.rleg.body.vertices[1].x) / 2;
            var yRval = (this.rleg.body.vertices[0].y + this.rleg.body.vertices[1].y) / 2;
            Body.rotate(this.rleg.body, rotateRleg, { x: xRval, y: yRval });

            var xLval = (this.lleg.body.vertices[0].x + this.lleg.body.vertices[1].x) / 2;
            var yLval = (this.lleg.body.vertices[0].y + this.lleg.body.vertices[1].y) / 2;
            Body.rotate(this.lleg.body, rotateLleg, { x: xLval, y: yLval });
        }
    }

    update() {
        if (this.head.collided || this.torso.collided) {
            this.dead = true;

            this.torso.body.isStatic = true;
            this.head.body.isStatic = true;
            this.rhand.body.isStatic = true;
            this.lhand.body.isStatic = true;
            this.rleg.body.isStatic = true;
            this.lleg.body.isStatic = true;

            this.torso.color = 0;
            this.head.color = 0;
            this.rhand.color = 0;
            this.lhand.color = 0;
            this.rleg.color = 0;
            this.lleg.color = 0;

            this.setTransparency(50);
        }

        if (!this.dead) {
            this.score = this.torso.body.position.x - this.x;
            const outputs = NeuralNetwork.feedForward([this.lleg.angle, this.lleg.angularSpeed, this.lleg.collided ? 1 : 0, this.lleg.distanceToGround, this.torso.angle, this.rleg.angle, this.rleg.angularSpeed, this.rleg.collided ? 1 : 0, this.rleg.distanceToGround], this.brain)
            //console.log(this.brain.layers[0].inputs);
            console.log(outputs);
            this.control(outputs[0], outputs[1]);
        }

        this.torso.show();

        this.rhand.show();
        this.lhand.show();
        this.rleg.show();
        this.lleg.show();
        this.head.show();
    }

    removeFromWorld() {
        Composite.remove(world, [this.torso.body, this.head.body, this.rhand.body, this.lhand.body, this.rleg.body, this.lleg.body, this.torsoToHead, this.torsoToHeadA, this.torsoToRhand, this.torsoToLhand, this.torsoToRleg, this.torsoToLleg, this.legToLeg]);
    }
}