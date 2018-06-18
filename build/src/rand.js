"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rand = (min, max) => {
    if (typeof max === 'undefined') {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min)) + min;
};
//# sourceMappingURL=rand.js.map