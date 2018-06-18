import { Matrix } from './Matrix';
export declare class MatrixValidator {
    /**
     * Checks if the given row is a valid row. So 0's are ignored but
     */
    rowIsValid(row: number[]): boolean;
    matrixIsValid(matrix: Matrix, diagonal?: boolean): boolean;
    /**
     * Checks if the given row is a solved row. (has 1 of each value for every integer from 1 up to length)
     */
    checkRow(row: number[]): boolean;
    /**
     * Checks if the given matrix is a solved matrix. (each horiontal, vertical and optionaly diagonal row must be valid)
     */
    checkMatrix(matrix: Matrix, diagonal?: boolean): boolean;
}
