import { Change } from './Change';
import { Coord } from './Coord';
import { Matrix } from './Matrix';
import { MatrixValidator } from './MatrixValidator';

export class Sudoku {
    public readonly validator: MatrixValidator = new MatrixValidator();
    public readonly changes: Change[] = [];
    public readonly matrix: Matrix;

    constructor(public readonly size: number) {
        this.matrix = new Matrix(size);
    }

    public get isSolved(): boolean {
        return this.validator.checkMatrix(this.matrix);
    }

    public get isSolvable(): boolean {
        return true;
    }

    public get isValid(): boolean {
        return this.validator.matrixIsValid(this.matrix);
    }

    public get(coord: Coord): number {
        return this.matrix.get(coord);
    }

    public set(coord: Coord, value: number): void {
        this.commit(new Change(coord, value, this.matrix.get(coord)));
    }

    public commit(change: Change): number;
    public commit(changes: Change[]): number;
    public commit(changeOrChanges: Change | Change[]): number {
        if (!Array.isArray(changeOrChanges)) {
            changeOrChanges = [changeOrChanges];
        }
        for (const change of changeOrChanges) {
            this.changes.push(change);
            this.matrix.set(change.coord, change.value);
        }
        return this.changes.length;
    }

    public rollback(amount: number): Change[] {
        const changes = this.changes.splice(this.changes.length - amount);
        for (const change of changes) {
            this.matrix.set(change.coord, change.old, true);
        }
        return changes;
    }

    public fill(matrix: number[]): void;
    public fill(matrix: number[][]): void;
    public fill(matrix: number[] | number[][]): void {
        const oneDimension = typeof matrix[0] === 'number';
        const length = oneDimension ? Math.sqrt(matrix.length) : matrix.length;
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.matrix.set(
                    new Coord(x, y),
                    oneDimension
                        ? matrix[y * length + x]
                        : (matrix as any)[y][x],
                    true,
                );
            }
        }
    }

    public static create(matrix: number[]): Sudoku;
    public static create(matrix: number[][]): Sudoku;
    public static create(matrix: number[] | number[][]): Sudoku;
    public static create(matrix: number[] | number[][]): Sudoku {
        const oneDimenstion = typeof matrix[0] === 'number';
        let length;
        if (oneDimenstion) {
            length = Math.sqrt(matrix.length);
            if (Math.floor(length) !== length) {
                throw new Error(`invalid matrix length of '${length}'`);
            }
        } else {
            length = matrix.length;
        }
        const sudoku = new Sudoku(length);
        sudoku.fill(matrix as any);
        return sudoku;
    }
}
