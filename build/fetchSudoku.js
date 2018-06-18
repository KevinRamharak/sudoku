"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const rand_1 = require("./rand");
async function fetchSudoku(difficulty = 'random', source = 'sugoku') {
    switch (source) {
        // GIVES INVALID SUDOKUS
        case 'sugoku':
            return node_fetch_1.default(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
                .then(async (response) => {
                const data = await response.json();
                if (typeof data.board !== 'undefined') {
                    return data.board;
                }
                else {
                    throw new Error(`received unexpected data: ${data}`);
                }
            })
                .catch((e) => {
                throw e;
            });
        // GIVES INVALID SUDOKUS
        case 'dachev':
            return node_fetch_1.default(`http://blago.dachev.com/sudoku/api/v1/board`)
                .then(async (response) => {
                const data = await response.json();
                return data.payload.puzzle.map((val) => (val === null ? 0 : val));
            })
                .catch((e) => {
                throw e;
            });
        case 'cheon':
            const diff = difficulty === 'easy'
                ? 1
                : difficulty === 'medium'
                    ? 2
                    : difficulty === 'hard'
                        ? 3
                        : difficulty === 'random'
                            ? rand_1.rand(1, 4)
                            : rand_1.rand(1, 4);
            return node_fetch_1.default(`http://www.cs.utep.edu/cheon/ws/sudoku/new/?size=9&level=${diff}`)
                .then(async (response) => {
                const data = await response.json();
                let matrix = [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                ];
                for (const square of data.squares) {
                    matrix[square.y][square.x] = square.value;
                }
                return matrix;
            })
                .catch((e) => {
                throw e;
            });
        default:
            throw new Error('invalid sudoku source');
    }
}
exports.fetchSudoku = fetchSudoku;
//# sourceMappingURL=fetchSudoku.js.map