function preload() {
    window.digits = {
        blank: loadImage("assets/blank.png"),
        0: loadImage("assets/0.png"),
        1: loadImage("assets/1.png"),
        2: loadImage("assets/2.png"),
        3: loadImage("assets/3.png"),
        4: loadImage("assets/4.png"),
        5: loadImage("assets/5.png"),
        6: loadImage("assets/6.png"),
        7: loadImage("assets/7.png"),
        8: loadImage("assets/8.png"),
        9: loadImage("assets/9.png"),
    };
}

function setup() {
    createCanvas(800, 700);

    window.cellWidth = 20;
    window.topUiHeight = 50;

    const columns = floor(width / window.cellWidth);
    const rows = floor((height - window.topUiHeight) / window.cellWidth);

    const cellCount = columns * rows;
    const bombCount = floor(cellCount / 5);

    window.field = new Field(columns, rows, bombCount);
}

function mousePressed() {
    if (mouseY < window.topUiHeight) {
        window.field.clickTopUi();
        return;
    }

    if (keyIsDown(CONTROL)) {
        window.field.flagCellAtCoords(mouseX, mouseY - window.topUiHeight);
        return;
    }
    if (keyIsDown(SHIFT)) {
        window.field.revealSurroundingCellsAtCoords(
            mouseX,
            mouseY - window.topUiHeight,
        );
        return;
    }
    
    window.field.revealCellAtCoords(mouseX, mouseY - window.topUiHeight);
}

function draw() {
    background(220);

    window.field.show();
}
