function setup() {
    createCanvas(windowWidth, windowHeight);

    window.MAX_DEPTH = width > 600 ? 5 : 4;

    angleMode(DEGREES);
    colorMode(HSB, 360);

    // Calculate the points around a circle at three equal spaces, and make our
    // snowflake out of them.
    window.snowflake = [0, 1, 2].map((index) => {
        const r = min(width, height) / 2.2;
        const x1 = r * cos(index * 120 + 90);
        const y1 = r * sin(index * 120 + 90);
        const x2 = r * cos((index + 1) * 120 + 90);
        const y2 = r * sin((index + 1) * 120 + 90);

        const colourStart = index * 120;
        const colourEnd = (index + 1) * 120;

        return new Snowflake(x1, y1, x2, y2, colourStart, colourEnd);
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
