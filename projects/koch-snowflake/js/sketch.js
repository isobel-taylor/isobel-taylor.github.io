function setup() {
    createCanvas(400, 400);

    angleMode(DEGREES);
    window.snowflake = [0, 1, 2].map((index) => {
        const r = width / 2.2;
        const x1 = r * cos(index * 120 + 90);
        const y1 = r * sin(index * 120 + 90);
        const x2 = r * cos((index + 1) * 120 + 90);
        const y2 = r * sin((index + 1) * 120 + 90);

        return new Snowflake(x1, y1, x2, y2);
    });
}

function mousePressed() {
    for (const snowflake of window.snowflake) {
        snowflake.divide();
    }
}

function draw() {
    background(0);
    translate(width / 2, height / 2);

    for (const snowflake of window.snowflake) {
        snowflake.show();
    }
}
