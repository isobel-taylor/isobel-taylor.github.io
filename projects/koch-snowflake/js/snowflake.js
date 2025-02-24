class Snowflake {
    constructor(x1, y1, x2, y2) {
        this.p1 = createVector(x1, y1);
        this.p2 = createVector(x2, y2);

        this.children = [];
    }

    divide(depth = 1) {
        // Prevent it going too far, this will crash the browser if you go down
        // to infinity.
        if (depth > 6) {
            return;
        }

        if (this.children.length === 0) {
            // Calculate the three key points to which the child segments will
            // attach.
            const one_third = p5.Vector.lerp(this.p1, this.p2, 1 / 3);
            const two_third = p5.Vector.lerp(this.p1, this.p2, 2 / 3);
            const point = p5.Vector.sub(one_third, two_third)
                .rotate(60)
                .add(two_third);

            this.children = [
                new Snowflake(this.p1.x, this.p1.y, one_third.x, one_third.y),
                new Snowflake(one_third.x, one_third.y, point.x, point.y),
                new Snowflake(point.x, point.y, two_third.x, two_third.y),
                new Snowflake(two_third.x, two_third.y, this.p2.x, this.p2.y),
            ];
        } else {
            for (const children of this.children) {
                children.divide(depth + 1);
            }
        }
    }

    show() {
        if (this.children.length === 0) {
            stroke(255);
            strokeWeight(1);
            line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        } else {
            for (const children of this.children) {
                children.show();
            }
        }
    }
}
