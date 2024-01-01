
const WASMFILE = 'pi-zig.wasm';

const current_time = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()},${d.getMilliseconds()}`;
};

const wrapped_js_output = (outputFunc) => {
    return (msg) => {
        outputFunc(`JS: ${current_time()} ${msg}`);
    };
};

export const logJS = wrapped_js_output(console.log);

export let wasm_histogram, wasm_pi_digits, wasm_zig_version;
let wasm_alloc, wasm_free, wasm_memory;

// Convenience function to prepare a typed byte array
// from a pointer and a length into WASM memory.
function getView(ptr, len) {
    return new Uint8Array(wasm_memory.buffer, ptr, len);
}

// Decode UTF-8 typed byte array in WASM memory into
// UTF-16 JS string.
const decodeStr = (ptr, len) => new TextDecoder().decode(getView(ptr, len));

// JS strings are UTF-16 and have to be encoded into an
// UTF-8 typed byte array in WASM memory.
const encodeStr = (str) => {
    const capacity = str.length * 2 + 5; // As per MDN
    const ptr = wasm_alloc(capacity);
    const { written } = new TextEncoder().encodeInto(str, getView(ptr, capacity));
    return [ptr, written, capacity];
}

// The environment we export to WASM.
const importObject = {
    env: {
        // We export this function to WASM land.
        consoleLog: (ptr, len) => {
            const msg = decodeStr(ptr, len);
            console.log(`ZIG: ${current_time()} ${msg}`);
        },
        version: (ptr, len) => {
            const msg = decodeStr(ptr, len);
            wasm_zig_version = `zig: ${msg}`;
            console.log(wasm_zig_version);
        }
    },
    wasi_snapshot_preview1: {
        fd_write: (wuserdata, werror, wtype, wfd_readwrite) => {
            console.error('ZIG: **PANIC** OutOfMemory - fd_write: ', wuserdata, werror, wtype, wfd_readwrite);
            return -1;
        }
    }
};

export const loadZigWasm = async () =>
    await WebAssembly
        .instantiateStreaming(fetch(WASMFILE), importObject)
        .then(wasmModule => {
            const { histogram, pi_digits, pi_digits_len, alloc, free, memory, zlog, zig_version } = wasmModule.instance.exports;
            wasm_histogram = histogram;
            wasm_pi_digits = new Uint8Array(memory.buffer, pi_digits(), pi_digits_len());
            wasm_alloc = alloc;
            wasm_free = free;
            wasm_memory = memory;

            zig_version();

            const [ptr, len, capacity] = encodeStr("Hello from Zig + JS + WASM 🦎⚡!");
            zlog(ptr, len);

            // We need to manually free the string's bytes in WASM memory.
            wasm_free(ptr, capacity);
        });

export const loadZigHistograms = async (numbers) => {
    logJS('Start calc-ing histograms...');

    const rc = [];
    for (let i = 0; i < numbers.length; i++) {
        const histo_ptr = wasm_histogram(numbers[i]);
        if (histo_ptr) {
            const histogram_i32 = new Int32Array(wasm_memory.buffer, histo_ptr, 10);
            wasm_free(histo_ptr);

            // copy to number[] - Int32Array does not interoperate well with the rest of the code 
            const histogram = [];
            for (let index = 0; index < histogram_i32.length; index++) {
                const element = histogram_i32.at(index);
                histogram.push(element);
            }
            wasm_free(histogram_i32);

            rc.push({ num_digits: numbers[i], histogram: histogram });
        }
    }

    logJS('Done calc-ing histograms.');

    return rc;
};
