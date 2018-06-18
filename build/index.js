#!/usr/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchSudoku_1 = require("./fetchSudoku");
const readSudoku_1 = require("./readSudoku");
const Sudoku_1 = require("./Sudoku");
const SudokuSolver_1 = require("./SudokuSolver");
const main = async (args) => {
    if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
        console.log(`\
sudoku [-h|--help] [-i|--iter] [-l|--log] [-o|--online] [--diff='easy|medium|hard'] [file]
FLAGS:
    -h | --help         - show this help message
    -i | --iter         - use iteration mode
    -l | --log          - enable (more) verbose logging

INPUT
    -o | --online       - use an online API to generate a sudoku
    --diff=MODE         - difficulty of online generated sudoku
                          if ommited a random difficulty is chosen
            OR
    file                - JSON file where the root object has a 'sudoku' property
                          this property can be a one or two dimensional array representing
                          a sudoku

iteration mode tries each method once before repeating the process.

non-iteration mode tries each method as long as changes can be made
before moving to the next method.
`);
        return;
    }
    // really crude argument checking
    const iterationMode = args.includes('-i') || args.includes('--iter');
    const logMode = args.includes('-l') || args.includes('--log');
    const onlineMode = args.includes('-o') || args.includes('--online');
    const difficulty = args.includes('--diff=easy')
        ? 'easy'
        : args.includes('--diff=medium')
            ? 'medium'
            : args.includes('--diff=hard')
                ? 'hard'
                : 'random';
    const difficutlyPresent = args.filter((s) => s.startsWith('--diff='));
    if (difficutlyPresent.length > 0 && difficulty === 'random') {
        throw new Error(`invalid difficulty: ${difficutlyPresent}`);
    }
    const filename = args.filter((s) => !s.startsWith('-'))[0];
    if ((!onlineMode && !filename) || (onlineMode && filename)) {
        throw new Error(`expected either online mode or a filename to retrieve the sudoku`);
    }
    // create an empty puzzle
    const solver = new SudokuSolver_1.SudokuSolver();
    // parse and/or generate input matrix?
    // maybe use an API to generate a puzzle for us?
    const puzzle = onlineMode
        ? await fetchSudoku_1.fetchSudoku(difficulty, 'cheon')
        : readSudoku_1.readSudoku(filename);
    const sudoku = Sudoku_1.Sudoku.create(puzzle);
    // pass the puzzle to some solve function
    try {
        console.log('initial state:');
        console.dir(sudoku.matrix.matrix);
        const changes = solver.solve(sudoku, iterationMode, logMode);
        console.log(`${sudoku.isSolved ? '' : 'un'}finished state:`);
        console.log(`number of changes made: ${changes.length}`);
        console.dir(sudoku.matrix.matrix);
    }
    catch (e) {
        // if (e instanceof UnsolvableSudokuError) {
        console.log('interupted state:');
        console.dir(sudoku.matrix.matrix);
        console.log(`ERROR: ${e.stack}`);
        process.exitCode = 1;
        // } else {
        // throw e;
        // }
    }
};
main(process.argv.slice(2));
//# sourceMappingURL=index.js.map