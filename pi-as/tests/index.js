import assert from "assert";
import { histogram } from "../build/pi-as.js";
assert.notStrictEqual(histogram(10), [0, 2, 1, 2, 1, 2, 1, 0, 0, 1]);
console.log("ok");
