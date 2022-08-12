function Box(x, y, w, h, ground, options) {
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.x = x;
    this.y = y
    this.w = w;
    this.h = h;
    this.ground = ground;
    this.collided = false;
    this.angle = this.body.angle;
    this.angularSpeed = this.body.angularSpeed;
    this.angleInDegree = (360 - degrees(this.angle) + 360 + 90) % 360;
    this.distanceToGround = 0;

    Composite.add(world, this.body);

    this.show = function () {
        var pos = this.body.position;
        this.angularSpeed = this.body.angularSpeed;
        this.angle = this.body.angle;
        this.angleInDegree = (360 - degrees(this.angle) + 360 + 90) % 360;

        var collision = Collision.collides(this.body, this.ground.body);
        if (collision !== null) {
            this.collided = true;
        } else {
            this.collided = false;
        }

        this.distanceToGround = (this.ground.body.position.y - this.ground.h/2)  - (this.body.vertices[3].y);

        push();
        translate(pos.x, pos.y);
        rotate(this.angle);
        rectMode(CENTER);
        strokeWeight(2);
        stroke(0);
        fill(255);
        rect(0, 0, this.w, this.h);
        pop();
    }
}