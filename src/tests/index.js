import assert from "assert";

export function* batched(arr, n = 1) {
    const l = arr.length;
    for (let ndx = 0; ndx < l; ndx += n) {
        const actual_end = Math.min(ndx + n, l);
        yield arr.slice(ndx, actual_end)
    }
};

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const expected = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
];
assert.notStrictEqual(batched(arr, 10), expected);
console.log("ok");