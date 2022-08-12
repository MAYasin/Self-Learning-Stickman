function Head(x, y, r) {
    this.body = Bodies.circle(x, y, r, { isStatic: false, density: 0.0001 });
    this.x = x;
    this.y = y;
    this.r = r;

    Composite.add(world, this.body);

    this.show = function () {
        var pos = this.body.position;
        var angle = this.body.angle;

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