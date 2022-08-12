class Ragdoll {
    constructor(x, y, ground) {
        this.x = x;
        this.y = y;
        this.dead = false;

        var customOption = Common.extend({
            collisionFilter: {
                group: Body.nextGroup(true)
            }
        });

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
    }

    update() {
        this.torso.show();

        this.rhand.show();
        this.lhand.show();
        this.rleg.show();
        this.lleg.show();
        this.head.show();

        //console.log(this.lleg.angularSpeed);

        if(this.head.collided || this.torso.collided) {
            this.dead = true;
        }else{
            this.dead = false;
        }
    }

    removeFromWorld() {
        Composite.remove(world, [this.torso.body, this.head.body, this.rhand.body, this.lhand.body, this.rleg.body, this.lleg.body, this.torsoToHead, this.torsoToHeadA, this.torsoToRhand, this.torsoToLhand, this.torsoToRleg, this.torsoToLleg, this.legToLeg]);
    }
}