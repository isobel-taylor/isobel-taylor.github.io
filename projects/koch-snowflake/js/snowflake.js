class Snowflake {
    constructor(x1, y1, x2, y2, colourStart, colourEnd) {
        this.p1 = createVector(x1, y1);
        this.p2 = createVector(x2, y2);

        this.colourStart = colourStart;
        this.colourEnd = colourEnd;

        this.children = [];
    }

    divide(depth = 1) {
        // Prevent it going too far, this will crash the browser if you go down
        // to infinity.
        if (depth > window.MAX_DEPTH) {
            return;
        }

        if (this.children.length === 0) {
            // Calculate the three key points to which the child segments will
            // attach.
            const oneQuarterPoint = p5.Vector.lerp(this.p1, this.p2, 1 / 3);
            const threeQuarterPoint = p5.Vector.lerp(this.p1, this.p2, 2 / 3);
            const twoQuarterPoint = p5.Vector.sub(
                threeQuarterPoint,
                oneQuarterPoint,
            )
                .rotate(-60)
                .add(oneQuarterPoint);

            const oneQuarterColour = lerp(
                this.colourStart,
                this.colourEnd,
                1 / 4,
            );
            const twoQuarterColour = lerp(
                this.colourStart,
                this.colourEnd,
                1 / 2,
            );
            const threeQuarterColor = lerp(
                this.colourStart,
                this.colourEnd,
                3 / 4,
            );

            this.children = [
                new Snowflake(
                    this.p1.x,
                    this.p1.y,
                    oneQuarterPoint.x,
                    oneQuarterPoint.y,
                    this.colourStart,
                    oneQuarterColour,
                ),
                new Snowflake(
                    oneQuarterPoint.x,
                    oneQuarterPoint.y,
                    twoQuarterPoint.x,
                    twoQuarterPoint.y,
                    oneQuarterColour,
                    twoQuarterColour,
                ),
                new Snowflake(
                    twoQuarterPoint.x,
                    twoQuarterPoint.y,
                    threeQuarterPoint.x,
                    threeQuarterPoint.y,
                    twoQuarterColour,
                    threeQuarterColor,
                ),
                new Snowflake(
                    threeQuarterPoint.x,
                    threeQuarterPoint.y,
                    this.p2.x,
                    this.p2.y,
                    threeQuarterColor,
                    this.colourEnd,
                ),
            ];
        } else {
            for (const children of this.children) {
                children.divide(depth + 1);
            }
        }
    }

    show() {
        if (this.children.length === 0) {
            const SEGMENTS = 12;

            for (let i = 0; i < SEGMENTS; i++) {
                const startPoint = p5.Vector.lerp(
                    this.p1,
                    this.p2,
                    i / SEGMENTS,
                );
                const endPoint = p5.Vector.lerp(
                    this.p1,
                    this.p2,
                    (i + 1) / SEGMENTS,
                );

                const startColour = lerp(
                    this.colourStart,
                    this.colourEnd,
                    i / SEGMENTS,
                );
                const endColour = lerp(
                    this.colourStart,
                    this.colourEnd,
                    (i + 1) / SEGMENTS,
                );

                strokeWeight(1);
                stroke((startColour + endColour) / 2, 360, 360);
                line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
            }
        } else {
            for (const children of this.children) {
                children.show();
            }
        }
    }
}
