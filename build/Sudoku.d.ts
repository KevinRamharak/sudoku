import { Change } from './Change';
import { Coord } from './Coord';
import { Matrix } from './Matrix';
import { MatrixValidator } from './MatrixValidator';
export declare class Sudoku {
    readonly size: number;
    readonly validator: MatrixValidator;
    readonly changes: Change[];
    readonly matrix: Matrix;
    constructor(size: number);
    readonly isSolved: boolean;
    readonly isSolvable: boolean;
    readonly isValid: boolean;
    get(coord: Coord): number;
    set(coord: Coord, value: number): void;
    commit(change: Change): number;
    commit(changes: Change[]): number;
    rollback(amount: number): Change[];
    fill(matrix: number[]): void;
    fill(matrix: number[][]): void;
    static create(matrix: number[]): Sudoku;
    static create(matrix: number[][]): Sudoku;
    static create(matrix: number[] | number[][]): Sudoku;
}
