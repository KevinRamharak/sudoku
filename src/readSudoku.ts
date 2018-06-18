import fs from 'fs';

export function readSudoku(filename: string): number[] | number[][] {
    const content = fs.readFileSync(filename, {
        encoding: 'utf-8',
    });
    const json = JSON.parse(content);
    if (!json.sudoku)
        throw new Error(
            `expected JSON with a property called 'sudoku' as a 'number[] | number[][]'`,
        );
    return json.sudoku as number[] | number[][];
}
