export const rand = (min: number, max?: number) => {
    if (typeof max === 'undefined') {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min)) + min;
};
