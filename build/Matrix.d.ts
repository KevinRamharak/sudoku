import { Coord } from './Coord';
export declare class Matrix {
    readonly length: number;
    readonly matrix: number[][];
    get(coord: Coord): number;
    set(coord: Coord, value: number, rangeCheckOverride?: boolean): void;
    getHorizontalRow(n: number): number[];
    getVerticalRow(n: number): number[];
    getDiagonalRow(): number[];
    getHorizontalRows(): number[][];
    getVerticalRows(): number[][];
    getBlock(coord: Coord): number[][];
    getFlatBlock(coord: Coord): number[];
    constructor(length: number, initialValue?: number);
}
