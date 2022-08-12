function Box(x, y, w, h, options) {
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.x = x;
    this.y = y
    this.w = w;
    this.h = h;

    Composite.add(world, this.body);

    this.show = function () {
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(2);
        stroke(0);
        fill(255);
        rect(0, 0, this.w, this.h);
        pop();
    }
}