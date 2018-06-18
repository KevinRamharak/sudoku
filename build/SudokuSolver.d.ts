import { Sudoku } from './Sudoku';
import { Change } from './Change';
import { Coord } from './Coord';
export declare class SudokuSolver {
    /**
     * returns all possible values for a given coordinate inside the given sudoku
     * @param sudoku
     * @param coord
     */
    getPossibleValues(sudoku: Sudoku, coord: Coord): number[];
    /**
     * returns all coordinates of the block that the given coordinate is in
     * @param coord
     */
    getAllBlockCoords(sudoku: Sudoku, coord: Coord): Coord[];
    getAllHorizontalRowCoords(sudoku: Sudoku, coord: Coord): Coord[];
    getAllVerticalRowCoords(sudoku: Sudoku, coord: Coord): Coord[];
    /**
     * returns the neighbouring horizontal rows that are part of the same block of given coordinate
     * @param sudoku
     * @param coord
     */
    findCorrespondingHoriontalRows(sudoku: Sudoku, coord: Coord): number[][];
    /**
     * returns the neighbouring vertical rows that are part of the same block of given coordinate
     * @param sudoku
     * @param coord
     */
    findCorrespondingVerticalRows(sudoku: Sudoku, coord: Coord): number[][];
    getEmptyCoords(sudoku: Sudoku): Coord[];
    /**
     * returns all the applied changes to the given sudoku. these changes are made to all coordinates that have only one possible value.
     * @param sudoku
     */
    applyCertainChanges(sudoku: Sudoku): Change[];
    /**
     * repets `applyCertainChanges` until no more changes can be made.
     * @param sudoku
     */
    applyAllCertainChanges(sudoku: Sudoku): Change[];
    /**
     * returns applied changes to the given sudoku. these changes are made to coordinates where the neighbouring rows (in its own block) are already saturated with a possible value. this means the current coordinate is the only remaining place for the corresponding possible value.
     * @param sudoku
     */
    applyNeighbourChanges(sudoku: Sudoku): Change[];
    /**
     * repeats `applyNeighbourChanges` until no more changes can be made.
     * @param sudoku
     */
    applyAllNeighbourChanges(sudoku: Sudoku): Change[];
    /**
     * returns all applied changes to the given sudoku. these changes are made to all coordinates where that coordinate is the only one in its block with a certain possible value.
     *
     * #NOTE: This is a lot of computational work for minimum value. Only seen it work once for a value that can easily be solved by another method. But because of the possiblity of it adding some value and the work I put into it ill keep it
     *
     * @param sudoku
     */
    applyLeftoverChanges(sudoku: Sudoku): Change[];
    /**
     * repeats `apllyLeftoverChanges` until no more changes can be made.
     * @param sudoku
     */
    applyAllLeftoverChanges(sudoku: Sudoku): Change[];
    /**
     * tries to solve the given sudoku nd returns the commited changes.
     *
     * `iterationMode === true` seems to be slower. The main reason should be that the easier algorithms get tried out first. This means that by exhausting the faster methods first you should get a more completed sudoku before trying the more expensive methods. This also probably depends on the given sudoku and its difficutly.
     *
     * @param sudoku
     * @param iterationMode when true each method is tried once before moving to the next one until no more changes can be made. when false each method is tried until no changes can be made before moving to the next method.
     * @param log enable logging to the console
     */
    solve(sudoku: Sudoku, iterationMode?: boolean, logToStdout?: boolean): Change[];
}
