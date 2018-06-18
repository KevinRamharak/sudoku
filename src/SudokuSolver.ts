import { Sudoku } from './Sudoku';
import { Change } from './Change';
import { UnsolvableSudokuError } from './UnsolvableSudokuError';
import { Coord } from './Coord';
import { EAGAIN } from 'constants';
import { rand } from './rand';

const uniqueValues = (v: any, i: number, a: any[]) => a.indexOf(v) === i;

export class SudokuSolver {
    /**
     * returns all possible values for a given coordinate inside the given sudoku
     * @param sudoku
     * @param coord
     */
    public getPossibleValues(sudoku: Sudoku, coord: Coord): number[] {
        // get the block, horizontal row and vertical row of the coord
        const b = sudoku.matrix.getFlatBlock(coord);
        const h = sudoku.matrix.getHorizontalRow(coord.y);
        const v = sudoku.matrix.getVerticalRow(coord.x);

        // ignore the '0' value
        const [, ...allValues] = [...Array(sudoku.size).keys(), sudoku.size];
        const impossibleValues = [...b, ...h, ...v]
            .filter(uniqueValues)
            .filter((v) => v !== 0);
        const possibleValues = allValues.filter(
            (v) => !impossibleValues.includes(v),
        );
        return possibleValues;
    }

    /**
     * returns all coordinates of the block that the given coordinate is in
     * @param coord
     */
    public getAllBlockCoords(sudoku: Sudoku, coord: Coord): Coord[] {
        const allCoords: Coord[] = [];

        const blockLength = Math.sqrt(sudoku.size);
        const blockX = coord.x - (coord.x % blockLength);
        const blockY = coord.y - (coord.y % blockLength);

        for (let y = 0; y < blockLength; y++) {
            for (let x = 0; x < blockLength; x++) {
                allCoords.push(new Coord(blockX + x, blockY + y));
            }
        }

        return allCoords;
    }

    public getAllHorizontalRowCoords(sudoku: Sudoku, coord: Coord): Coord[] {
        const allCoords: Coord[] = [];

        for (let x = 0; x < sudoku.size; x++) {
            if (x !== coord.x) {
                allCoords.push(new Coord(x, coord.y));
            }
        }

        return allCoords;
    }

    public getAllVerticalRowCoords(sudoku: Sudoku, coord: Coord): Coord[] {
        const allCoords: Coord[] = [];

        for (let y = 0; y < sudoku.size; y++) {
            if (y !== coord.y) {
                allCoords.push(new Coord(coord.x, y));
            }
        }

        return allCoords;
    }

    /**
     * returns the neighbouring horizontal rows that are part of the same block of given coordinate
     * @param sudoku
     * @param coord
     */
    public findCorrespondingHoriontalRows(
        sudoku: Sudoku,
        coord: Coord,
    ): number[][] {
        const rows: number[][] = [];

        const blockSize = Math.sqrt(sudoku.size);
        const blankY = coord.y % blockSize;
        const lowestY = coord.y - blankY;

        for (let i = 0; i < blockSize; i++) {
            if (i === blankY) continue;
            rows.push(sudoku.matrix.getHorizontalRow(lowestY + i));
        }

        return rows;
    }

    /**
     * returns the neighbouring vertical rows that are part of the same block of given coordinate
     * @param sudoku
     * @param coord
     */
    public findCorrespondingVerticalRows(
        sudoku: Sudoku,
        coord: Coord,
    ): number[][] {
        const rows: number[][] = [];

        const blockSize = Math.sqrt(sudoku.size);
        const blankX = coord.x % blockSize;
        const lowestX = coord.x - blankX;

        for (let i = 0; i < blockSize; i++) {
            if (i === blankX) continue;
            rows.push(sudoku.matrix.getVerticalRow(lowestX + i));
        }

        return rows;
    }

    public getEmptyCoords(sudoku: Sudoku): Coord[] {
        const coords: Coord[] = [];

        for (let y = 0; y < sudoku.size; y++) {
            for (let x = 0; x < sudoku.size; x++) {
                if (sudoku.matrix.matrix[y][x] === 0) {
                    coords.push(new Coord(x, y));
                }
            }
        }

        return coords;
    }

    /**
     * returns all the applied changes to the given sudoku. these changes are made to all coordinates that have only one possible value.
     * @param sudoku
     */
    public applyCertainChanges(sudoku: Sudoku): Change[] {
        const changes: Change[] = [];

        for (let y = 0; y < sudoku.size; y++) {
            for (let x = 0; x < sudoku.size; x++) {
                const coord = new Coord(x, y);
                const oldValue = sudoku.get(coord);
                if (oldValue !== 0) continue;

                const possibleValues = this.getPossibleValues(sudoku, coord);

                if (possibleValues.length === 0) {
                    throw new UnsolvableSudokuError(
                        `no possible changes for ${coord}`,
                    );
                }

                if (possibleValues.length === 1) {
                    const change = new Change(
                        coord,
                        possibleValues[0],
                        oldValue,
                    );
                    changes.push(change);
                    sudoku.commit(change);
                } else {
                }
            }
        }

        return changes;
    }

    /**
     * repets `applyCertainChanges` until no more changes can be made.
     * @param sudoku
     */
    public applyAllCertainChanges(sudoku: Sudoku): Change[] {
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
    public applyNeighbourChanges(sudoku: Sudoku): Change[] {
        const changes: Change[] = [];

        for (let y = 0; y < sudoku.size; y++) {
            for (let x = 0; x < sudoku.size; x++) {
                const coord = new Coord(x, y);
                const oldValue = sudoku.get(coord);
                if (oldValue !== 0) continue;

                const possibleValues = this.getPossibleValues(sudoku, coord);

                const h = this.findCorrespondingHoriontalRows(sudoku, coord);
                const v = this.findCorrespondingVerticalRows(sudoku, coord);

                const newPossibleValues = possibleValues.filter((value) => {
                    return [...h, ...v].every((row) => {
                        return row.includes(value);
                    });
                });

                if (newPossibleValues.length === 1) {
                    const change = new Change(
                        coord,
                        newPossibleValues[0],
                        oldValue,
                    );
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
    public applyAllNeighbourChanges(sudoku: Sudoku): Change[] {
        const changes: Change[] = [];
        let result: Change[];
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
    public applyLeftoverChanges(sudoku: Sudoku): Change[] {
        const changes: Change[] = [];

        for (let y = 0; y < sudoku.size; y++) {
            for (let x = 0; x < sudoku.size; x++) {
                const coord = new Coord(x, y);
                const oldValue = sudoku.get(coord);
                if (oldValue !== 0) continue;

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
                        const change = new Change(
                            coord,
                            possibilities[0],
                            oldValue,
                        );
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
    public applyAllLeftoverChanges(sudoku: Sudoku): Change[] {
        const changes = [];
        let result: Change[];
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
    public solve(
        sudoku: Sudoku,
        iterationMode: boolean = true,
        logToStdout: boolean = false,
    ): Change[] {
        const allChanges: Change[] = [];

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
            const changes: Change[] = [];
            actions.forEach((action) =>
                changes.push(...action.call(this, sudoku)),
            );
            if (changes.length === 0) {
                let blacklist: Coord[] = [];
                while (!sudoku.isSolved) {
                    let coord: Coord;
                    let amount: number = 0;
                    try {
                        amount = 1;
                        const allCoords = this.getEmptyCoords(sudoku);
                        const emptyCoords = allCoords.filter((c) => {
                            return blacklist.every((o) => {
                                return !(o.x === c.x && o.y === c.y);
                            });
                        });
                        if (emptyCoords.length === 0) {
                            throw new Error(
                                `exhausted all coords ${blacklist}`,
                            );
                        }
                        const randomCoordsIndex = rand(0, emptyCoords.length);
                        coord = emptyCoords[randomCoordsIndex];
                        const possibleValues = this.getPossibleValues(
                            sudoku,
                            coord,
                        );

                        if (possibleValues.length === 0) {
                            throw new UnsolvableSudokuError(
                                `no possible values for ${coord}`,
                            );
                        }

                        const randomValueIndex = rand(0, possibleValues.length);
                        const value = possibleValues[randomValueIndex];

                        sudoku.set(coord, value);
                        const possibleChanges = this.solve(
                            sudoku,
                            iterationMode,
                            logToStdout,
                        );
                        amount += possibleChanges.length;
                        allChanges.push(...possibleChanges);
                    } catch (e) {
                        if (e instanceof UnsolvableSudokuError) {
                            blacklist.push(coord!);
                            sudoku.rollback(amount);
                        } else {
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
