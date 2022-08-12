function Head(x, y, r, ground, customOption) {
    this.body = Bodies.circle(x, y, r, { isStatic: false, density: 0.0001, collisionFilter: customOption.collisionFilter});
    this.x = x;
    this.y = y;
    this.r = r;
    this.ground = ground;
    this.collided = false;

    Composite.add(world, this.body);

    this.show = function () {
        var pos = this.body.position;
        var angle = this.body.angle;

        var collision = Collision.collides(this.body, this.ground.body);
        if (collision !== null) {
            this.collided = true;
        } else {
            this.collided = false;
        }

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        ellipseMode(CENTER);
        strokeWeight(2);
        stroke(0);
        fill(255);
        ellipse(0, 0, this.r * 2);
        pop();
    }
}