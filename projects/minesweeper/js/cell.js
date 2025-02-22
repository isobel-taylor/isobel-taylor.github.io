const NUMBER_COLOURS = {
    1: { r: 0, g: 0, b: 255 },
    2: { r: 0, g: 100, b: 0 },
    3: { r: 255, g: 0, b: 0 },
    4: { r: 0, g: 0, b: 100 },
    5: { r: 100, g: 0, b: 0 },
    6: { r: 0, g: 100, b: 100 },
    7: { r: 0, g: 0, b: 0 },
    8: { r: 100, g: 0, b: 100 },
};

class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;

        this.reset();
    }

    setHasBomb(hasBomb) {
        this.hasBomb = hasBomb;
    }

    toggleFlagged() {
        if (!this.revealed) {
            this.flagged = !this.flagged;
        }
    }

    setBombCount() {
        const surroundingCells = window.field.getSurroundingCells(
            this.i,
            this.j,
        );

        const bombCount = surroundingCells.reduce((acc, cell) => {
            if (cell.hasBomb) {
                return acc + 1;
            } else {
                return acc;
            }
        }, 0);

        this.bombCount = bombCount;
    }

    contains(x, y) {
        const xMin = this.i * window.cellWidth;
        const yMin = this.j * window.cellWidth;
        const xMax = (this.i + 1) * window.cellWidth;
        const yMax = (this.j + 1) * window.cellWidth;

        if (x < xMin || x >= xMax) {
            return false;
        }

        if (y < yMin || y >= yMax) {
            return false;
        }

        return true;
    }

    gameOver() {
        this.revealed = true;
    }

    reveal() {
        if (this.revealed) {
            return;
        }

        if (this.flagged) {
            return;
        }

        this.revealed = true;

        if (this.hasBomb) {
            this.killedPlayer = true;
            window.field.gameOver();
            return;
        }

        if (this.bombCount > 0) {
            return;
        }

        for (const cell of window.field.getSurroundingCells(this.i, this.j)) {
            cell.reveal();
        }
    }

    reset() {
        this.hasBomb = undefined;
        this.bombCount = undefined;
        this.revealed = false;
        this.flagged = false;
        this.killedPlayer = false;
    }

    show() {
        const x = this.i * window.cellWidth;
        const y = this.j * window.cellWidth + window.topUiHeight;

        if (this.revealed) {
            this.showRevealed(x, y);
        } else {
            this.showUnrevealed(x, y);
        }
    }

    showUnrevealed(x, y) {
        imageMode(CORNER);

        if (this.flagged) {
            image(window.images.unrevealed_flagged, x, y);
        } else {
            image(window.images.unrevealed_blank, x, y);
        }
    }

    showRevealed(x, y) {
        imageMode(CORNER);

        if (this.killedPlayer) {
            image(window.images.revealed_bomb_exploded, x, y);
            return;
        }

        if (this.hasBomb) {
            image(window.images.revealed_bomb, x, y);
            return;
        }

        image(window.images.revealed_blank, x, y);

        if (this.bombCount !== undefined) {
            this.drawNumber(x, y);
        }
    }

    drawNumber(x, y) {
        const colour = NUMBER_COLOURS[this.bombCount];

        if (colour === undefined) {
            return;
        }

        fill(colour.r, colour.g, colour.b);
        noStroke();
        textSize(window.cellWidth);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);

        text(
            this.bombCount,
            x + window.cellWidth * 0.45,
            y + window.cellWidth * 0.6 + 1,
        );
    }
}
