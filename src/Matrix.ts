import { range } from './range';
import { Coord } from './Coord';

export class Matrix {
    public readonly matrix: number[][] = [];

    get(coord: Coord): number {
        try {
            const val = this.matrix[coord.y][coord.x];
            if (typeof val === 'undefined') {
                throw new RangeError(
                    `'${coord}' -> y coord seems out of bound`,
                );
            }
            return val;
        } catch (e) {
            if (e instanceof RangeError) {
                throw e;
            } else {
                throw new RangeError(
                    `'${coord}' -> x coord seems out of bound`,
                );
            }
        }
    }

    set(coord: Coord, value: number, rangeCheckOverride: boolean = false) {
        if (!rangeCheckOverride && (value < 1 || value > this.length)) {
            throw new RangeError(
                `expected 'value' to be between '1' and '${this.length}'`,
            );
        }
        this.matrix[coord.y][coord.x] = value;
    }

    getHorizontalRow(n: number): number[] {
        return this.matrix[n];
    }

    getVerticalRow(n: number): number[] {
        const row: number[] = [];
        for (let y = 0; y < this.length; y++) {
            row.push(this.get(new Coord(n, y)));
        }
        return row;
    }

    getDiagonalRow(): number[] {
        throw new Error('not implemented');
        return [];
    }

    getHorizontalRows(): number[][] {
        return this.matrix;
    }

    getVerticalRows(): number[][] {
        const rows: number[][] = [];
        for (let x = 0; x < this.length; x++) {
            rows.push(this.getVerticalRow(x));
        }
        return rows;
    }

    getBlock(coord: Coord): number[][] {
        const blockLength = Math.sqrt(this.length);
        const block: number[][] = [];
        const blockX = coord.x - (coord.x % blockLength);
        const blockY = coord.y - (coord.y % blockLength);
        for (let i = blockY; i < blockY + blockLength; i++) {
            block.push(
                this.getHorizontalRow(i).slice(blockX, blockX + blockLength),
            );
        }
        return block;
    }

    getFlatBlock(coord: Coord): number[] {
        return this.getBlock(coord).reduce((acc, val) => acc.concat(val), []);
    }

    constructor(public readonly length: number, initialValue: number = 0) {
        range((y) => {
            this.matrix[y] = [];
            range((x) => {
                this.matrix[y][x] = initialValue;
            }, length);
        }, length);
    }
}
