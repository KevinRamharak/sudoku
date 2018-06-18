export declare class Coord {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    static from(coord: string): Coord;
    toString(): string;
}
