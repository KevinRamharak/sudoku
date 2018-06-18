export class Coord {
    constructor(public readonly x: number, public readonly y: number) {}
    static from(coord: string) {
        const [x, y] = coord.split(',').map((i) => Number.parseInt(i));
        return new Coord(x, y);
    }
    toString(): string {
        return `{ x: ${this.x}, y: ${this.y} }`;
    }
}
