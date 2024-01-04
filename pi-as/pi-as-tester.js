import * as pi_as from './pi-as.js';

const N = 50000;

const jsLog = (msg) => console.log('JS: %s', msg);

// Functions imported from WASM.
let wasm_pi_digits, wasm_histogram, wasm_version;

wasm_histogram = pi_as.histogram;
wasm_pi_digits = pi_as.pi_digits();
wasm_version = pi_as.version();

jsLog(`wasm_version: '${wasm_version}'`);

console.log('JS: wasm_pi_digits: ', wasm_pi_digits);

// Passing a string across the JS to WASM boundary.
const str = "Hello from AssemblyScript + JS + WASM with unicode ⚡!";
pi_as.aslog(str);

jsLog(`histogram(${N})`);
const rc = wasm_histogram(N);
if (rc) {
    console.log('JS: rc: ', rc);
}
