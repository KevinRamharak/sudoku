import { Coord } from './Coord';
import { Matrix } from './Matrix';

export class MatrixValidator {
    /**
     * Checks if the given row is a valid row. So 0's are ignored but
     */
    rowIsValid(row: number[]): boolean {
        const has: number[] = [];
        for (const i of row) {
            if (i === 0) continue;
            if (has.includes(i)) return false;
            if (i > row.length) return false;
            has.push(i);
        }
        return true;
    }

    matrixIsValid(matrix: Matrix, diagonal = false): boolean {
        for (let i = 0; i < matrix.length; i++) {
            // check rows left to right
            const row = matrix.getHorizontalRow(i);
            if (!this.rowIsValid(row)) return false;
            // create diagonal rows
        }

        // check diagonal row 0,0 -> n,n
        // for the diagonal rows
        if (diagonal) {
            const rowA = [];
            const rowB = [];
            for (let i = 0; i < matrix.length; i++) {
                rowA.push(matrix.get(new Coord(i, i)));
                let inverseI = matrix.length - i - 1;
                rowB.push(matrix.get(new Coord(inverseI, inverseI)));
            }
            if (!this.rowIsValid(rowA)) return false;
            if (!this.rowIsValid(rowB)) return false;
        }

        // create a row top to bottom
        for (let i = 0; i < matrix.length; i++) {
            const row = matrix.getVerticalRow(i);
            if (!this.rowIsValid(row)) return false;
        }
        return true;
    }

    /**
     * Checks if the given row is a solved row. (has 1 of each value for every integer from 1 up to length)
     */
    checkRow(row: number[]): boolean {
        const has: number[] = [];
        for (const i of row) {
            if (i === 0) return false;
            if (has.includes(i)) return false;
            if (i > row.length)
                throw new RangeError(
                    `value '${i}' exceeds row length: '${row.length}'`,
                );
            has.push(i);
        }
        return true;
    }

    /**
     * Checks if the given matrix is a solved matrix. (each horiontal, vertical and optionaly diagonal row must be valid)
     */
    checkMatrix(matrix: Matrix, diagonal = false): boolean {
        for (let i = 0; i < matrix.length; i++) {
            // check rows left to right
            const row = matrix.getHorizontalRow(i);
            if (!this.checkRow(row)) return false;
        }

        // check diagonal row 0,0 -> n,n
        // for the diagonal rows
        if (diagonal) {
            const rowA = [];
            const rowB = [];
            for (let i = 0; i < matrix.length; i++) {
                rowA.push(matrix.get(new Coord(i, i)));
                let inverseI = matrix.length - i - 1;
                rowB.push(matrix.get(new Coord(inverseI, inverseI)));
            }
            if (!this.checkRow(rowA)) return false;
            if (!this.checkRow(rowB)) return false;
        }
        // create a row top to bottom
        for (let i = 0; i < matrix.length; i++) {
            const row = matrix.getVerticalRow(i);
            if (!this.checkRow(row)) return false;
        }
        return true;
    }
}
