function Box(x, y, w, h, options) {
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.x = x;
    this.y = y
    this.w = w;
    this.h = h;
    this.angle = this.body.angle;
    this.angleInDegree = (360 - degrees(this.angle) + 360 + 90) % 360

    Composite.add(world, this.body);

    this.show = function () {
        var pos = this.body.position;
        this.angle = this.body.angle;
        this.angleInDegree = (360 - degrees(this.angle) + 360 + 90) % 360

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