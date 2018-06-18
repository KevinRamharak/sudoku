import fetch from 'node-fetch';
import { rand } from './rand';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'random';
export async function fetchSudoku(
    difficulty: Difficulty = 'random',
    source: string = 'sugoku',
): Promise<number[][]> {
    switch (source) {
        // GIVES INVALID SUDOKUS
        case 'sugoku':
            return fetch(
                `https://sugoku.herokuapp.com/board?difficulty=${difficulty}`,
            )
                .then(async (response) => {
                    const data: any = await response.json();
                    if (typeof data.board !== 'undefined') {
                        return data.board as number[][];
                    } else {
                        throw new Error(`received unexpected data: ${data}`);
                    }
                })
                .catch((e) => {
                    throw e;
                });
        // GIVES INVALID SUDOKUS
        case 'dachev':
            return fetch(`http://blago.dachev.com/sudoku/api/v1/board`)
                .then(async (response) => {
                    const data: any = await response.json();
                    return data.payload.puzzle.map(
                        (val: number | null) => (val === null ? 0 : val),
                    );
                })
                .catch((e) => {
                    throw e;
                });
        case 'cheon':
            const diff =
                difficulty === 'easy'
                    ? 1
                    : difficulty === 'medium'
                        ? 2
                        : difficulty === 'hard'
                            ? 3
                            : difficulty === 'random'
                                ? rand(1, 4)
                                : rand(1, 4);
            return fetch(
                `http://www.cs.utep.edu/cheon/ws/sudoku/new/?size=9&level=${diff}`,
            )
                .then(async (response) => {
                    const data: any = await response.json();
                    let matrix: number[][] = [
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
                    for (const square of data.squares) {
                        matrix[square.y][square.x] = square.value;
                    }
                    return matrix;
                })
                .catch((e) => {
                    throw e;
                });
        default:
            throw new Error('invalid sudoku source');
    }
}
