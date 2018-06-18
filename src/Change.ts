import { Coord } from './Coord';
export class Change {
    constructor(
        public readonly coord: Coord,
        public readonly value: number,
        public readonly old: number,
    ) {}
}
