"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const range_1 = require("./range");
const Coord_1 = require("./Coord");
class Matrix {
    constructor(length, initialValue = 0) {
        this.length = length;
        this.matrix = [];
        range_1.range((y) => {
            this.matrix[y] = [];
            range_1.range((x) => {
                this.matrix[y][x] = initialValue;
            }, length);
        }, length);
    }
    get(coord) {
        try {
            const val = this.matrix[coord.y][coord.x];
            if (typeof val === 'undefined') {
                throw new RangeError(`'${coord}' -> y coord seems out of bound`);
            }
            return val;
        }
        catch (e) {
            if (e instanceof RangeError) {
                throw e;
            }
            else {
                throw new RangeError(`'${coord}' -> x coord seems out of bound`);
            }
        }
    }
    set(coord, value, rangeCheckOverride = false) {
        if (!rangeCheckOverride && (value < 1 || value > this.length)) {
            throw new RangeError(`expected 'value' to be between '1' and '${this.length}'`);
        }
        this.matrix[coord.y][coord.x] = value;
    }
    getHorizontalRow(n) {
        return this.matrix[n];
    }
    getVerticalRow(n) {
        const row = [];
        for (let y = 0; y < this.length; y++) {
            row.push(this.get(new Coord_1.Coord(n, y)));
        }
        return row;
    }
    getDiagonalRow() {
        throw new Error('not implemented');
        return [];
    }
    getHorizontalRows() {
        return this.matrix;
    }
    getVerticalRows() {
        const rows = [];
        for (let x = 0; x < this.length; x++) {
            rows.push(this.getVerticalRow(x));
        }
        return rows;
    }
    getBlock(coord) {
        const blockLength = Math.sqrt(this.length);
        const block = [];
        const blockX = coord.x - (coord.x % blockLength);
        const blockY = coord.y - (coord.y % blockLength);
        for (let i = blockY; i < blockY + blockLength; i++) {
            block.push(this.getHorizontalRow(i).slice(blockX, blockX + blockLength));
        }
        return block;
    }
    getFlatBlock(coord) {
        return this.getBlock(coord).reduce((acc, val) => acc.concat(val), []);
    }
}
exports.Matrix = Matrix;
//# sourceMappingURL=Matrix.js.map