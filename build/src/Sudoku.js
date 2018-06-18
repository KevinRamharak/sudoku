"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Change_1 = require("./Change");
const Coord_1 = require("./Coord");
const Matrix_1 = require("./Matrix");
const MatrixValidator_1 = require("./MatrixValidator");
class Sudoku {
    constructor(size) {
        this.size = size;
        this.validator = new MatrixValidator_1.MatrixValidator();
        this.changes = [];
        this.matrix = new Matrix_1.Matrix(size);
    }
    get isSolved() {
        return this.validator.checkMatrix(this.matrix);
    }
    get isSolvable() {
        return true;
    }
    get isValid() {
        return this.validator.matrixIsValid(this.matrix);
    }
    get(coord) {
        return this.matrix.get(coord);
    }
    set(coord, value) {
        this.commit(new Change_1.Change(coord, value, this.matrix.get(coord)));
    }
    commit(changeOrChanges) {
        if (!Array.isArray(changeOrChanges)) {
            changeOrChanges = [changeOrChanges];
        }
        for (const change of changeOrChanges) {
            this.changes.push(change);
            this.matrix.set(change.coord, change.value);
        }
        return this.changes.length;
    }
    rollback(amount) {
        const changes = this.changes.splice(this.changes.length - amount);
        for (const change of changes) {
            this.matrix.set(change.coord, change.old, true);
        }
        return changes;
    }
    fill(matrix) {
        const oneDimension = typeof matrix[0] === 'number';
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.matrix.set(new Coord_1.Coord(x, y), oneDimension ? matrix[x * y + y] : matrix[y][x], true);
            }
        }
    }
    static create(matrix) {
        const oneDimenstion = typeof matrix[0] === 'number';
        let length;
        if (oneDimenstion) {
            length = Math.sqrt(matrix.length);
            if (Math.floor(length) !== length) {
                throw new Error(`invalid matrix length of '${length}'`);
            }
        }
        else {
            length = matrix.length;
        }
        const sudoku = new Sudoku(length);
        sudoku.fill(matrix);
        return sudoku;
    }
}
exports.Sudoku = Sudoku;
//# sourceMappingURL=Sudoku.js.map