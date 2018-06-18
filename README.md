# Sudoku Solver

my attempt at writing a quick solution for solving sudoku's. It was harder than I taught it would be. It can solve almost all easy sudoku's you throw at it but might have some trouble with the more difficult ones.

Might want to redo this project in some time and implement the well known strategies to solve sudoku's in a less spagetti code base.

# usage

> NOTE: I used 3 different API's to fetch sudoku puzzles from but I am not sure they allways produce valid sudokus. (at least 1 does not). See `./src/fetchSudoku` and adjust `./src/index.ts` at line 68 if you want to change the API

```
sudoku [-h|--help] [-i|--iter] [-l|--log] [-o|--online] [--diff='easy|medium|hard'] [file]
FLAGS:
    -h | --help         - show this help message
    -i | --iter         - use iteration mode
    -l | --log          - enable (more) verbose logging

INPUT
    -o | --online       - use an online API to generate a sudoku
    --diff=MODE         - difficulty of online generated sudoku
                          if ommited a random difficulty is chosen
            OR
    file                - JSON file where the root object has a 'sudoku' property
                          this property can be a one or two dimensional array representing
                          a sudoku

iteration mode tries each method once before repeating the process.

non-iteration mode tries each method as long as changes can be made
before moving to the next method.
```
