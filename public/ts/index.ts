import { $, $$, $new } from './util';

const sudoku = $('#sudoku') as HTMLDivElement;

if (!sudoku) throw new Error(`could not find element '#sudoku'`);

const matrix: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function createSudoku(element: HTMLDivElement, matrix: number[][]) {
    const table = $new('table');

    for (let y = 0; y < matrix.length; y++) {
        const row = $new('tr');
        for (let x = 0; x < matrix.length; x++) {
            const col = $new('td');
            const input = $new('input');
            input.type = 'text';
            input.value = matrix[y][x] as any;
            col.appendChild(input);
            row.appendChild(col);
        }
        table.appendChild(row);
    }

    Array.from(element.children).forEach((child) => element.removeChild(child));
    element.appendChild(table);
}

try {
    createSudoku(sudoku, matrix);
} catch (e) {
    throw e;
}
