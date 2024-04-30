
const N = 45;
const WASMFILE = 'pi-tinygo.wasm';

const jsLog = (msg) => {
    console.log('JS: %s', msg);
}

// Functions imported from WASM.
let wasm_alloc, wasm_free, wasm_memory;

let wasm_pi_digits, wasm_histogram, wasm_tgo_version;

// Convenience function to prepare a typed byte array
// from a pointer and a length into WASM memory.
const getView = (ptr, len) => new Uint8Array(wasm_memory.buffer, ptr, len);

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
const decodeStr = (ptr, len) => new TextDecoder('utf-8').decode(getView(ptr, len));

// The environment we export to WASM.
const importObject = {
    env: {
        // We export this function to WASM land.
        'main.consoleLog': (ptr, len) => {
            const msg = decodeStr(ptr, len);
            console.log(`TINYGO: ${msg}`);
        },
    },
    wasi_snapshot_preview1: {
        fd_write: (wuserdata, werror, wtype, wfd_readwrite) => {
            console.error('TINYGO: **PANIC** OutOfMemory - fd_write: ', wuserdata, werror, wtype, wfd_readwrite);
            return -1;
        }
    }
};

const call_funcs = wasmModule => {
    jsLog(wasmModule.instance.exports);

    const { histogram, pi_digits, pi_digits_len, alloc, free, memory, tgo_version, tgo_version_len /*zlog*/ } = wasmModule.instance.exports;
    wasm_histogram = histogram;

    local_pi_digits = new Uint8Array(memory.buffer, pi_digits(), pi_digits_len());
    wasm_pi_digits = [];
    for (let index = 0; index < local_pi_digits.length; index++) {
        wasm_pi_digits.push(local_pi_digits[index]);
    }

    wasm_alloc = alloc;
    wasm_free = free;
    wasm_memory = memory;
    // wasm_tgo_version = new Uint8Array(wasm_memory.buffer, tgo_version(), tgo_version_len());

    // jsLog(`tinygo: ${wasm_tgo_version}, len: ${tgo_version_len()}`);

    jsLog(`pi_digits_len=${pi_digits_len()}, pi_digits=${pi_digits()}`);

    console.log('JS: wasm_pi_digits: ', wasm_pi_digits);

    // Passing a string across the JS to WASM boundary.
    // const [ptr, zlen, capacity] = encodeStr("Hello from Zig + JS + WASM 🦎⚡!");
    // zlog(ptr, zlen);

    // We need to manually free the string's bytes in WASM memory.
    // wasm_free(ptr, capacity);

    const len = 10;  // an element for each digit 0-9

    jsLog('histogram(10, ...)');
    const rc = wasm_histogram(10);
    if (rc) {
        const array = new Int32Array(memory.buffer, rc, 10);
        if (array) {
            console.log('JS: array: ', array);

            wasm_free(array.buffer);
        }
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
