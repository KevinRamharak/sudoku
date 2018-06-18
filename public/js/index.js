define("util", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ = (query) => document.querySelector(query);
    exports.$$ = (query) => document.querySelectorAll(query);
    exports.$new = (tag) => document.createElement(tag);
});
define("index", ["require", "exports", "util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const sudoku = util_1.$('#sudoku');
    if (!sudoku)
        throw new Error(`could not find element '#sudoku'`);
    const matrix = [
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
    function createSudoku(element, matrix) {
        const table = util_1.$new('table');
        for (let y = 0; y < matrix.length; y++) {
            const row = util_1.$new('tr');
            for (let x = 0; x < matrix.length; x++) {
                const col = util_1.$new('td');
                const input = util_1.$new('input');
                input.type = 'text';
                input.value = matrix[y][x];
                col.appendChild(input);
                row.appendChild(col);
            }
            table.appendChild(row);
        }
        Array.from(element.children).forEach((child) => element.removeChild(child));
        element.appendChild(table);
    }
    try {
        createSudoku(sudoku, matrix);
    }
    catch (e) {
        throw e;
    }
});
//# sourceMappingURL=index.js.map