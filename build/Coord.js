"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static from(coord) {
        const [x, y] = coord.split(',').map((i) => Number.parseInt(i));
        return new Coord(x, y);
    }
    toString() {
        return `{ x: ${this.x}, y: ${this.y} }`;
    }
}
exports.Coord = Coord;
//# sourceMappingURL=Coord.js.map