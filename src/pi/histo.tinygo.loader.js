import { current_time, logJS } from "./utils";

const WASMFILE = 'pi-tinygo.wasm';

export let histo_histogram, histo_pi_digits, histo_version;
let histo_alloc, histo_free, histo_memory;

// Convenience function to prepare a typed byte array
// from a pointer and a length into WASM memory.
function getView(ptr, len) {
    return new Uint8Array(histo_memory.buffer, ptr, len);
}

// Decode UTF-8 typed byte array in WASM memory into
// UTF-16 JS string.
const decodeStr = (ptr, len) => new TextDecoder().decode(getView(ptr, len));

// JS strings are UTF-16 and have to be encoded into an
// UTF-8 typed byte array in WASM memory.
const encodeStr = (str) => {
    const capacity = str.length * 2 + 5; // As per MDN
    const ptr = histo_alloc(capacity);
    const { written } = new TextEncoder().encodeInto(str, getView(ptr, capacity));
    return [ptr, written, capacity];
}

// The environment we export to WASM.
const importObject = {
    env: {
        // We export this function to WASM land.
        consoleLog: (ptr, len) => {
            const msg = decodeStr(ptr, len);
            console.log(`TINYGO: ${current_time()} ${msg}`);
        },
        version: (ptr, len) => {
            const msg = decodeStr(ptr, len);
            histo_version = `tinygo: ${msg}`;
            console.log(histo_version);
        }
    },
    wasi_snapshot_preview1: {
        fd_write: (wuserdata, werror, wtype, wfd_readwrite) => {
            console.error('TINYGO: **PANIC** OutOfMemory - fd_write: ', wuserdata, werror, wtype, wfd_readwrite);
            return -1;
        }
    }
};

export const loadOtherWasm = async () =>
    await WebAssembly
        .instantiateStreaming(fetch(WASMFILE), importObject)
        .then(wasmModule => {
            const { histogram, pi_digits, pi_digits_len, alloc, free, memory, /* golog, tinygo_version*/ } = wasmModule.instance.exports;
            histo_histogram = histogram;
            const local_pi_digits = new Uint8Array(memory.buffer, pi_digits(), pi_digits_len());
            histo_pi_digits = [];
            for (let index = 0; index < local_pi_digits.length; index++) {
                histo_pi_digits.push(local_pi_digits[index]);
            }
            histo_alloc = alloc;
            histo_free = free;
            histo_memory = memory;
            histo_version = 'tinygo: 0.30.0';

            // tinygo_version();

            // Passing a unicode string across the JS to WASM boundary.
            // const [ptr, len, capacity] = encodeStr("Hello from TinyGO + JS + WASM ⚡!");
            // golog(ptr, len);

            // We need to manually free the string's bytes in WASM memory.
            // wasm_free(ptr, capacity);
        });

export const loadHistograms = async (numbers) => {
    logJS('Start calc-ing histograms...');

    const rc = [];
    for (let i = 0; i < numbers.length; i++) {
        const histo = histo_histogram(numbers[i]);
        if (histo) {
            const histogram_i32 = new Int32Array(histo_memory.buffer, histo, 10);

            // copy to number[] - Int32Array does not interoperate well with the rest of the code 
            const histogram = [];
            for (let index = 0; index < histogram_i32.length; index++) {
                const element = histogram_i32.at(index);
                histogram.push(element);
            }
            histo_free(histogram_i32.buffer);

            rc.push({ num_digits: numbers[i], histogram: histogram });
        }
    }

    logJS('Done calc-ing histograms.');

    return rc;
};
