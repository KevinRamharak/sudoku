"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
async function fetchSudoku(difficulty = 'random') {
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
}
exports.fetchSudoku = fetchSudoku;
//# sourceMappingURL=fetchSudoku.js.map