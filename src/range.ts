export type RangeCallback = (index: number) => false | void;
export function range(callback: RangeCallback, end: number): number;
export function range(
    callback: RangeCallback,
    start: number,
    end: number,
): number;
export function range(
    callback: RangeCallback,
    startOrEnd = 0,
    end?: number,
): number {
    let start;
    if (!end) {
        start = 0;
        end = startOrEnd;
    } else {
        start = startOrEnd;
    }
    for (let i = start; i < end; i++) {
        if (callback(i) === false) {
            return i + 1;
        }
    }
    return end;
}

export default range;
