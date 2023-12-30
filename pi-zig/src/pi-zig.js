
const N = 45;
const WASMFILE = 'pi-zig.wasm';

const jsLog = (msg) => {
    console.log('JS: %s', msg);
}

// Functions imported from WASM.
let wasm_alloc, wasm_free, wasm_memory;

let wasm_pi_digits, wasm_histogram;

// Convenience function to prepare a typed byte array
// from a pointer and a length into WASM memory.
const getView = (ptr, len) => new Uint8Array(memory.buffer, ptr, len);

// JS strings are UTF-16 and have to be encoded into an
// UTF-8 typed byte array in WASM memory.
const encodeStr = (str) => {
    const capacity = str.length * 2 + 5; // As per MDN
    const ptr = wasm_alloc(capacity);
    const { written } = new TextEncoder().encodeInto(str, getView(ptr, capacity));
    return [ptr, written, capacity];
}

// Decode UTF-8 typed byte array in WASM memory into
// UTF-16 JS string.
const decodeStr = (ptr, len) => new TextDecoder().decode(getView(ptr, len));

// The environment we export to WASM.
const importObject = {
    env: {
        // We export this function to WASM land.
        consoleLog: (ptr, len) => {
            const msg = decodeStr(ptr, len);
            console.log(`ZIG: ${msg}`);
        },
        version: (ptr, len) => {
            const msg = decodeStr(ptr, len);
            wasm_zig_version = `zig: ${msg}`;
            console.log(wasm_zig_version);
        }
    }
};

const call_funcs = wasmModule => {
    jsLog(wasmModule.instance.exports);

    ({ histogram, pi_digits, pi_digits_len, alloc, free, memory, zlog, zig_version } = wasmModule.instance.exports);
    wasm_histogram = histogram;
    wasm_pi_digits = new Uint8Array(memory.buffer, pi_digits(), pi_digits_len());
    wasm_alloc = alloc;
    wasm_free = free;
    wasm_memory = memory;

    zig_version();

    jsLog(`pi_digits_len=${pi_digits_len()}, pi_digits=${pi_digits()}`);

    console.log('JS: wasm_pi_digits: ', wasm_pi_digits);

    // Passing a string across the JS to WASM boundary.
    const [ptr, zlen, capacity] = encodeStr("Hello from Zig + JS + WASM 🦎⚡!");
    zlog(ptr, zlen);

    // We need to manually free the string's bytes in WASM memory.
    wasm_free(ptr, capacity);

    const len = 10;  // an element for each digit 0-9

    jsLog('histogram(1024, ...)');
    const rc = histogram(1024);
    const array = new Int32Array(memory.buffer, rc, 10);
    if (array) {
        console.log('JS: array: ', array);

        wasm_free(array.buffer);
    }
};

function browser_strategy(wasmFile) {
    const pre = document.getElementById('result');
    const msgs = [];
    jsLog = (orig => {
        m = `JS: ${orig}`;
        console.log(m);
        if (typeof (m) === 'string') {
            msgs.push(m);
            pre.textContent = msgs.join('\n')
        }
    });

    WebAssembly
        .instantiateStreaming(fetch(wasmFile), importObject)
        .then(call_funcs);
}

function node_strategy(wasmFile) {
    const fs = require('node:fs');
    const path = require('node:path');
    const wasmFileContent = fs.readFileSync(path.join(__dirname, wasmFile));

    WebAssembly
        .instantiate(wasmFileContent, importObject)
        .then(call_funcs);
}

const strategies = [
    browser_strategy,
    node_strategy
];

const strategy = typeof window !== 'undefined' ? 0 : 1;

strategies[strategy](WASMFILE);
