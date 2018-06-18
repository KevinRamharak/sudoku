export declare type Difficulty = 'easy' | 'medium' | 'hard' | 'random';
export declare function fetchSudoku(difficulty?: Difficulty, source?: string): Promise<number[][]>;
