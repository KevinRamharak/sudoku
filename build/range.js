"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function range(callback, startOrEnd = 0, end) {
    let start;
    if (!end) {
        start = 0;
        end = startOrEnd;
    }
    else {
        start = startOrEnd;
    }
    for (let i = start; i < end; i++) {
        if (callback(i) === false) {
            return i + 1;
        }
    }
    return end;
}
exports.range = range;
exports.default = range;
//# sourceMappingURL=range.js.map