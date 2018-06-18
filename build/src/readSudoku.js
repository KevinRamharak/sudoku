"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function readSudoku(filename) {
    const content = fs_1.default.readFileSync(filename, {
        encoding: 'utf-8',
    });
    const json = JSON.parse(content);
    if (!json.sudoku)
        throw new Error(`expected JSON with a property called 'sudoku' as a 'number[] | number[][]'`);
    return json.sudoku;
}
exports.readSudoku = readSudoku;
//# sourceMappingURL=readSudoku.js.map