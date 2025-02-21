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

        if (x <= xMin || x >= xMax) {
            return false;
        }

        if (y <= yMin || y >= yMax) {
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
        this.drawUnrevealedBackground(x, y);

        if (this.flagged) {
            this.drawFlag(x, y);
        }
    }

    showRevealed(x, y) {
        this.drawRevealedBackground(x, y);

        if (this.hasBomb) {
            this.drawBomb(x, y);
        }

        if (this.bombCount !== undefined) {
            this.drawNumber(x, y);
        }
    }

    drawRevealedBackground(x, y) {
        if (this.killedPlayer) {
            fill(255, 0, 0);
        } else {
            fill(200);
        }

        stroke(100);
        strokeWeight(1);
        rectMode(CORNER);
        square(x, y, window.cellWidth);

        stroke(150);
        line(x + 1, y + 1, x + window.cellWidth - 1, y + 1);
        line(x + 1, y + window.cellWidth - 1, x + 1, y + 1);
    }

    drawUnrevealedBackground(x, y) {
        fill(200);
        noStroke();
        rectMode(CORNER);
        square(x, y, window.cellWidth);

        stroke(100);
        strokeWeight(1);
        line(
            x + 1,
            y + window.cellWidth - 1,
            x + window.cellWidth - 1,
            y + window.cellWidth - 1,
        );
        line(
            x + window.cellWidth - 1,
            y + 1,
            x + window.cellWidth - 1,
            y + window.cellWidth - 1,
        );
        line(
            x + 2,
            y + window.cellWidth - 2,
            x + window.cellWidth - 2,
            y + window.cellWidth - 2,
        );
        line(
            x + window.cellWidth - 2,
            y + 2,
            x + window.cellWidth - 2,
            y + window.cellWidth - 2,
        );

        stroke(255);
        line(x + 1, y + 1, x + window.cellWidth - 1, y + 1);
        line(x + 1, y + 1, x + 1, y + window.cellWidth - 1);
        line(x + 2, y + 2, x + window.cellWidth - 2, y + 2);
        line(x + 2, y + 2, x + 2, y + window.cellWidth - 2);
    }

    drawFlag(x, y) {
        fill(0);
        stroke(0);
        strokeWeight(1);
        line(
            x + window.cellWidth * 0.6 - 1,
            y + window.cellWidth * 0.5,
            x + window.cellWidth * 0.6 - 1,
            y + window.cellWidth * 0.8,
        );
        line(
            x + window.cellWidth * 0.6 - 2,
            y + window.cellWidth * 0.5,
            x + window.cellWidth * 0.6 - 2,
            y + window.cellWidth * 0.8,
        );

        fill(200, 0, 0);
        noStroke();
        triangle(
            x + window.cellWidth * 0.6,
            y + window.cellWidth * 0.2,
            x + window.cellWidth * 0.25,
            y + window.cellWidth * 0.4,
            x + window.cellWidth * 0.6,
            y + window.cellWidth * 0.6,
        );

        fill(0);
        stroke(0);
        strokeWeight(1);
        line(
            x + window.cellWidth * 0.2,
            y + window.cellWidth * 0.8,
            x + window.cellWidth * 0.8,
            y + window.cellWidth * 0.8,
        );
        line(
            x + window.cellWidth * 0.3,
            y + window.cellWidth * 0.8 - 1,
            x + window.cellWidth * 0.7,
            y + window.cellWidth * 0.8 - 1,
        );
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
            y + window.cellWidth * 0.6,
        );
    }

    drawBomb(x, y) {
        fill(0);
        stroke(0);
        strokeWeight(2);
        circle(
            x + window.cellWidth * 0.5,
            y + window.cellWidth * 0.5,
            window.cellWidth * 0.4,
        );

        line(
            x + window.cellWidth * 0.25,
            y + window.cellWidth * 0.25,
            x + window.cellWidth * 0.75,
            y + window.cellWidth * 0.75,
        );
        line(
            x + window.cellWidth * 0.75,
            y + window.cellWidth * 0.25,
            x + window.cellWidth * 0.25,
            y + window.cellWidth * 0.75,
        );
        line(
            x + window.cellWidth * 0.5,
            y + window.cellWidth * 0.2,
            x + window.cellWidth * 0.5,
            y + window.cellWidth * 0.8,
        );
        line(
            x + window.cellWidth * 0.2,
            y + window.cellWidth * 0.5,
            x + window.cellWidth * 0.8,
            y + window.cellWidth * 0.5,
        );

        fill(255);
        stroke(255);
        circle(
            x + window.cellWidth * 0.5 - 1,
            y + window.cellWidth * 0.5 - 1,
            1,
        );
    }
}
