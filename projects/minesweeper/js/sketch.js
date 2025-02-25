function preload() {
    window.images = {
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
        revealed_blank: loadImage("assets/revealed_blank.png"),
        revealed_bomb_exploded: loadImage("assets/revealed_bomb_exploded.png"),
        revealed_bomb: loadImage("assets/revealed_bomb.png"),
        unrevealed_blank: loadImage("assets/unrevealed_blank.png"),
        unrevealed_flagged: loadImage("assets/unrevealed_flagged.png"),
        face_background: loadImage("assets/face_background.png"),
    };
}

function setup() {
    createCanvas(800, 640);

    window.cellWidth = 20;
    window.topUiHeight = 0;

    const columns = floor(width / window.cellWidth);
    const rows = floor((height - window.topUiHeight) / window.cellWidth);

    const cellCount = columns * rows;
    const bombCount = floor(cellCount / 6);

    window.field = new Field(columns, rows, bombCount);

    const emojiButton = select("#emoji");
    emojiButton.elt.addEventListener("click", () => window.field.clickTopUi());
}

function mousePressed() {
    // if (mouseY < window.topUiHeight) {
    //     window.field.clickTopUi();
    //     return;
    // }

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
