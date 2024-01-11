import assert from "node:assert";
import test from "node:test";

import { histogram } from "../build/pi-as.js";

const HISTO_FOR_50000 = [5033, 5054, 4867, 4948, 5011, 5052, 5018, 4977, 5030, 5010];

test("known good values of num_digits", () => {
    assert.deepEqual(histogram(10), [0, 2, 1, 2, 1, 2, 1, 0, 0, 1]);
    assert.deepEqual(histogram(1024), [96, 117, 106, 105, 94, 101, 96, 97, 105, 107]);

    assert.deepEqual(histogram(50000), HISTO_FOR_50000);
});

test("value of num_digits that is too large should log value used", () => {
    assert.deepEqual(histogram(60000), HISTO_FOR_50000);
});
