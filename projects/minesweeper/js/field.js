class Field {
    constructor(cellsWide, cellsTall, bombCount) {
        this.cellsWide = cellsWide;
        this.cellsTall = cellsTall;
        this.bombCount = bombCount;

        this.initialised = false;
        this.isGameOver = false;
        this.gameWon = false;

        this.grid = new Array(cellsWide);

        for (let i = 0; i < cellsWide; i++) {
            this.grid[i] = new Array(cellsTall);

            for (let j = 0; j < cellsTall; j++) {
                this.grid[i][j] = new Cell(i, j);
            }
        }

        this.showTopUI();
    }

    show() {
        for (const cell of this.getAllCells()) {
            cell.show();
        }
    }

    showTopUI() {
        const emojiButton = select("#emoji");
        if (this.isGameOver) {
            emojiButton.elt.innerHTML = "😵";
        } else if (this.gameWon) {
            emojiButton.elt.innerHTML = "😎";
        } else {
            emojiButton.elt.innerHTML = "🙂";
        }

        this.showUnflaggedBombCount();
    }

    showUnflaggedBombCount() {
        const countLength = this.bombCount.toString().length;
        const unflaggedBombCount =
            this.bombCount -
            this.getAllCells().filter((cell) => cell.flagged).length;

        const digits = unflaggedBombCount.toString().split("");
        const blankDigits = new Array(countLength - digits.length).fill(
            "blank",
        );

        const finalDigits = [...blankDigits, ...digits];

        const scoreContainer = select("#score");

        const innerHtml = finalDigits.map((digit) => {
            return `<img src="./assets/${digit}.png" />`;
        });

        scoreContainer.elt.innerHTML = innerHtml.join("");
    }

    gameOver() {
        this.initialised = false;
        this.isGameOver = true;

        for (const cell of this.getAllCells()) {
            cell.gameOver();
        }
    }

    checkGameWon() {
        const allCells = this.getAllCells();
        const emptyCells = allCells.filter((cell) => !cell.hasBomb);
        const revealedCells = allCells.filter((cell) => cell.revealed);

        if (emptyCells.length === revealedCells.length) {
            this.gameWon = true;
        }
    }

    revealCellAtCoords(x, y) {
        if (this.gameWon) {
            return;
        }

        if (!this.initialised) {
            this.initialise(x, y);
        }

        const clickedCell = this.getCellAtCoords(x, y);
        if (clickedCell === undefined) {
            return;
        }

        clickedCell.reveal();

        this.checkGameWon();

        this.showTopUI();
    }

    clickTopUi() {
        this.reset();

        this.showTopUI();
    }

    flagCellAtCoords(x, y) {
        if (this.gameWon) {
            return;
        }

        if (!this.initialised) {
            return;
        }

        const clickedCell = this.getCellAtCoords(x, y);
        if (clickedCell === undefined) {
            return;
        }

        clickedCell.toggleFlagged();

        this.showTopUI();
    }

    revealSurroundingCellsAtCoords(x, y) {
        if (this.gameWon) {
            return;
        }

        if (!this.initialised) {
            return;
        }

        const clickedCell = this.getCellAtCoords(x, y);
        if (clickedCell === undefined) {
            return;
        }

        if (clickedCell.flagged) {
            return;
        }

        const surroundingCells = this.getSurroundingCells(
            clickedCell.i,
            clickedCell.j,
            true,
        );

        for (const cell of surroundingCells) {
            cell.reveal();
        }

        this.checkGameWon();

        this.showTopUI();
    }

    getCellAtCoords(x, y) {
        for (const cell of this.getAllCells()) {
            if (cell.contains(x, y)) {
                return cell;
            }
        }
    }

    initialise(x, y) {
        const clickedCell = this.getCellAtCoords(x, y);
        if (clickedCell === undefined) {
            return;
        }

        const surroundingCells = this.getSurroundingCells(
            clickedCell.i,
            clickedCell.j,
            true,
        );

        const options = this.getAllCells();

        const filteredOptions = options.filter(
            (cell) => !surroundingCells.includes(cell),
        );

        const randomOptions = filteredOptions
            .map((cell) => ({ data: cell, sortOrder: random() }))
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((cell) => cell.data);

        const cutoff = randomOptions.length - this.bombCount;

        const bombCells = randomOptions.toSpliced(0, cutoff);
        const emptyCells = randomOptions.toSpliced(cutoff);

        for (const cell of bombCells) {
            cell.setHasBomb(true);
        }

        for (const cell of emptyCells.concat(surroundingCells)) {
            cell.setHasBomb(false);
            cell.setBombCount();
        }

        this.initialised = true;
        this.isGameOver = false;
        this.gameWon = false;
    }

    getAllCells() {
        return this.grid.reduce((gridToDate, column) => {
            return gridToDate.concat(column);
        }, []);
    }

    checkCellExists(i, j) {
        try {
            this.getCell(i, j);

            return true;
        } catch (error) {
            return false;
        }
    }

    getCell(i, j) {
        if (this.grid[i][j] === undefined) {
            throw new Error(`Grid position ${i},${j} is not defined`);
        }

        return this.grid[i][j];
    }

    getSurroundingCells(i, j, includeSelf = false) {
        const cellGroup = [];

        for (let iOffset = -1; iOffset <= 1; iOffset++) {
            for (let jOffset = -1; jOffset <= 1; jOffset++) {
                if (
                    this.grid[i + iOffset] !== undefined &&
                    this.grid[i + iOffset][j + jOffset] !== undefined
                ) {
                    if (!includeSelf && iOffset === 0 && jOffset === 0) {
                        continue;
                    }

                    cellGroup.push(this.grid[i + iOffset][j + jOffset]);
                }
            }
        }

        return cellGroup;
    }

    reset() {
        this.initialised = false;
        this.isGameOver = false;
        this.gameWon = false;

        for (const cell of this.getAllCells()) {
            cell.reset();
        }
    }
}
