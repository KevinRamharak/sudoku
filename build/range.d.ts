export declare type RangeCallback = (index: number) => false | void;
export declare function range(callback: RangeCallback, end: number): number;
export declare function range(callback: RangeCallback, start: number, end: number): number;
export default range;
