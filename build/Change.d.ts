import { Coord } from './Coord';
export declare class Change {
    readonly coord: Coord;
    readonly value: number;
    readonly old: number;
    constructor(coord: Coord, value: number, old: number);
}
