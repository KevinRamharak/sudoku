"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Change_1 = require("./Change");
const UnsolvableSudokuError_1 = require("./UnsolvableSudokuError");
const Coord_1 = require("./Coord");
const rand_1 = require("./rand");
const uniqueValues = (v, i, a) => a.indexOf(v) === i;
class SudokuSolver {
    /**
     * returns all possible values for a given coordinate inside the given sudoku
     * @param sudoku
     * @param coord
     */
    getPossibleValues(sudoku, coord) {
        // get the block, horizontal row and vertical row of the coord
        const b = sudoku.matrix.getFlatBlock(coord);
        const h = sudoku.matrix.getHorizontalRow(coord.y);
        const v = sudoku.matrix.getVerticalRow(coord.x);
        // ignore the '0' value
        const [, ...allValues] = [...Array(sudoku.size).keys(), sudoku.size];
        const impossibleValues = [...b, ...h, ...v]
            .filter(uniqueValues)
            .filter((v) => v !== 0);
        const possibleValues = allValues.filter((v) => !impossibleValues.includes(v));
        return possibleValues;
    }
    /**
     * returns all coordinates of the block that the given coordinate is in
     * @param coord
     */
    getAllBlockCoords(sudoku, coord) {
        const allCoords = [];
        const blockLength = Math.sqrt(sudoku.size);
        const blockX = coord.x - (coord.x % blockLength);
        const blockY = coord.y - (coord.y % blockLength);
        for (let y = 0; y < blockLength; y++) {
            for (let x = 0; x < blockLength; x++) {
                allCoords.push(new Coord_1.Coord(blockX + x, blockY + y));
            }
        }
        return allCoords;
    }
    getAllHorizontalRowCoords(sudoku, coord) {
        const allCoords = [];
        for (let x = 0; x < sudoku.size; x++) {
            if (x !== coord.x) {
                allCoords.push(new Coord_1.Coord(x, coord.y));
            }
        }
        return allCoords;
    }
    getAllVerticalRowCoords(sudoku, coord) {
        const allCoords = [];
        for (let y = 0; y < sudoku.size; y++) {
            if (y !== coord.y) {
                allCoords.push(new Coord_1.Coord(coord.x, y));
            }
        }
        return allCoords;
    }
    /**
     * returns the neighbouring horizontal rows that are part of the same block of given coordinate
     * @param sudoku
     * @param coord
     */
    findCorrespondingHoriontalRows(sudoku, coord) {
        const rows = [];
        const blockSize = Math.sqrt(sudoku.size);
        const blankY = coord.y % blockSize;
        const lowestY = coord.y - blankY;
        for (let i = 0; i < blockSize; i++) {
            if (i === blankY)
                continue;
            rows.push(sudoku.matrix.getHorizontalRow(lowestY + i));
        }
        return rows;
    }
    /**
     * returns the neighbouring vertical rows that are part of the same block of given coordinate
     * @param sudoku
     * @param coord
     */
    findCorrespondingVerticalRows(sudoku, coord) {
        const rows = [];
        const blockSize = Math.sqrt(sudoku.size);
        const blankX = coord.x % blockSize;
        const lowestX = coord.x - blankX;
        for (let i = 0; i < blockSize; i++) {
            if (i === blankX)
                continue;
            rows.push(sudoku.matrix.getVerticalRow(lowestX + i));
        }
        return rows;
    }
    getEmptyCoords(sudoku) {
        const coords = [];
        for (let y = 0; y < sudoku.size; y++) {
            for (let x = 0; x < sudoku.size; x++) {
                if (sudoku.matrix.matrix[y][x] === 0) {
                    coords.push(new Coord_1.Coord(x, y));
                }
            }
        }
        return coords;
    }
    /**
     * returns all the applied changes to the given sudoku. these changes are made to all coordinates that have only one possible value.
     * @param sudoku
     */
    applyCertainChanges(sudoku) {
        const changes = [];
        for (let y = 0; y < sudoku.size; y++) {
            for (let x = 0; x < sudoku.size; x++) {
                const coord = new Coord_1.Coord(x, y);
                const oldValue = sudoku.get(coord);
                if (oldValue !== 0)
                    continue;
                const possibleValues = this.getPossibleValues(sudoku, coord);
                if (possibleValues.length === 0) {
                    throw new UnsolvableSudokuError_1.UnsolvableSudokuError(`no possible changes for ${coord}`);
                }
                if (possibleValues.length === 1) {
                    const change = new Change_1.Change(coord, possibleValues[0], oldValue);
                    changes.push(change);
                    sudoku.commit(change);
                }
                else {
                }
            }
        }
        return changes;
    }
    /**
     * repets `applyCertainChanges` until no more changes can be made.
     * @param sudoku
     */
    applyAllCertainChanges(sudoku) {
        const changes = [];
        let result;
        do {
            result = this.applyCertainChanges(sudoku);
            changes.push(...result);
        } while (result.length !== 0);
        return changes;
    }
    /**
     * returns applied changes to the given sudoku. these changes are made to coordinates where the neighbouring rows (in its own block) are already saturated with a possible value. this means the current coordinate is the only remaining place for the corresponding possible value.
     * @param sudoku
     */
    applyNeighbourChanges(sudoku) {
        const changes = [];
        for (let y = 0; y < sudoku.size; y++) {
            for (let x = 0; x < sudoku.size; x++) {
                const coord = new Coord_1.Coord(x, y);
                const oldValue = sudoku.get(coord);
                if (oldValue !== 0)
                    continue;
                const possibleValues = this.getPossibleValues(sudoku, coord);
                const h = this.findCorrespondingHoriontalRows(sudoku, coord);
                const v = this.findCorrespondingVerticalRows(sudoku, coord);
                const newPossibleValues = possibleValues.filter((value) => {
                    return [...h, ...v].every((row) => {
                        return row.includes(value);
                    });
                });
                if (newPossibleValues.length === 1) {
                    const change = new Change_1.Change(coord, newPossibleValues[0], oldValue);
                    changes.push(change);
                    sudoku.commit(change);
                }
            }
        }
        return changes;
    }
    /**
     * repeats `applyNeighbourChanges` until no more changes can be made.
     * @param sudoku
     */
    applyAllNeighbourChanges(sudoku) {
        const changes = [];
        let result;
        do {
            result = this.applyNeighbourChanges(sudoku);
            changes.push(...result);
        } while (result.length !== 0);
        return changes;
    }
    /**
     * returns all applied changes to the given sudoku. these changes are made to all coordinates where that coordinate is the only one in its block with a certain possible value.
     *
     * #NOTE: This is a lot of computational work for minimum value. Only seen it work once for a value that can easily be solved by another method. But because of the possiblity of it adding some value and the work I put into it ill keep it
     *
     * @param sudoku
     */
    applyLeftoverChanges(sudoku) {
        const changes = [];
        for (let y = 0; y < sudoku.size; y++) {
            for (let x = 0; x < sudoku.size; x++) {
                const coord = new Coord_1.Coord(x, y);
                const oldValue = sudoku.get(coord);
                if (oldValue !== 0)
                    continue;
                const possibleValues = this.getPossibleValues(sudoku, coord);
                const options = [
                    this.getAllBlockCoords(sudoku, coord),
                    this.getAllHorizontalRowCoords(sudoku, coord),
                    this.getAllVerticalRowCoords(sudoku, coord),
                ];
                for (const option of options) {
                    const surroundingPossibleValues = option
                        .filter((c) => {
                        return !(c.x === coord.x && c.y === coord.y);
                    })
                        .map((c) => this.getPossibleValues(sudoku, c))
                        .reduce((acc, next) => {
                        return acc.concat(next);
                    }, [])
                        .filter((value, index, array) => {
                        return array.indexOf(value) === index;
                    });
                    const possibilities = possibleValues
                        .filter((value) => {
                        return !surroundingPossibleValues.includes(value);
                    })
                        .filter((value, index, array) => {
                        return array.indexOf(value) === index;
                    });
                    if (possibilities.length === 1) {
                        const change = new Change_1.Change(coord, possibilities[0], oldValue);
                        changes.push(change);
                        sudoku.commit(change);
                    }
                }
            }
        }
        return changes;
    }
    /**
     * repeats `apllyLeftoverChanges` until no more changes can be made.
     * @param sudoku
     */
    applyAllLeftoverChanges(sudoku) {
        const changes = [];
        let result;
        do {
            result = this.applyLeftoverChanges(sudoku);
            changes.push(...result);
        } while (result.length !== 0);
        return changes;
    }
    /**
     * tries to solve the given sudoku nd returns the commited changes.
     *
     * `iterationMode === true` seems to be slower. The main reason should be that the easier algorithms get tried out first. This means that by exhausting the faster methods first you should get a more completed sudoku before trying the more expensive methods. This also probably depends on the given sudoku and its difficutly.
     *
     * @param sudoku
     * @param iterationMode when true each method is tried once before moving to the next one until no more changes can be made. when false each method is tried until no changes can be made before moving to the next method.
     * @param log enable logging to the console
     */
    solve(sudoku, iterationMode = true, logToStdout = false) {
        const allChanges = [];
        const actions = iterationMode
            ? [
                this.applyCertainChanges,
                this.applyNeighbourChanges,
                this.applyLeftoverChanges,
            ]
            : [
                this.applyAllCertainChanges,
                this.applyAllNeighbourChanges,
                this.applyAllLeftoverChanges,
            ];
        while (!sudoku.isSolved) {
            const changes = [];
            actions.forEach((action) => changes.push(...action.call(this, sudoku)));
            if (changes.length === 0) {
                let blacklist = [];
                while (!sudoku.isSolved) {
                    let coord;
                    let amount = 0;
                    try {
                        amount = 1;
                        const allCoords = this.getEmptyCoords(sudoku);
                        const emptyCoords = allCoords.filter((c) => {
                            return blacklist.every((o) => {
                                return !(o.x === c.x && o.y === c.y);
                            });
                        });
                        if (emptyCoords.length === 0) {
                            throw new Error(`exhausted all coords ${blacklist}`);
                        }
                        const randomCoordsIndex = rand_1.rand(0, emptyCoords.length);
                        coord = emptyCoords[randomCoordsIndex];
                        const possibleValues = this.getPossibleValues(sudoku, coord);
                        if (possibleValues.length === 0) {
                            throw new UnsolvableSudokuError_1.UnsolvableSudokuError(`no possible values for ${coord}`);
                        }
                        const randomValueIndex = rand_1.rand(0, possibleValues.length);
                        const value = possibleValues[randomValueIndex];
                        sudoku.set(coord, value);
                        const possibleChanges = this.solve(sudoku, iterationMode, logToStdout);
                        amount += possibleChanges.length;
                        allChanges.push(...possibleChanges);
                        blacklist = [];
                    }
                    catch (e) {
                        if (e instanceof UnsolvableSudokuError_1.UnsolvableSudokuError) {
                            blacklist.push(coord);
                            sudoku.rollback(amount);
                        }
                        else {
                            throw e;
                        }
                    }
                }
            }
            allChanges.push(...changes);
        }
        return allChanges;
    }
}
exports.SudokuSolver = SudokuSolver;
//# sourceMappingURL=SudokuSolver.js.map