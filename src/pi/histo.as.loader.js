import * as pi_as from './pi-as.js';
import { logAS, logJS } from './utils.js';

// hack until AssemblyScript allows customization with ESM bindings
// console.trace just happens to be bound and we don't need it for tracing

// See: https://www.assemblyscript.org/compiler.html#host-bindings
// > These assumptions cannot be intercepted or customized since,
// > to provide static ESM exports from the bindings file directly,
// > instantiation must start immediately when the bindings file is imported.
// > If customization is required, --bindings raw can be used instead.
console.trace = logAS;

export let histo_histogram, histo_pi_digits, histo_version;

export const loadOtherWasm = async () => {
    histo_histogram = pi_as.histogram;
    histo_pi_digits = pi_as.pi_digits();
    histo_version = pi_as.version();

    // Passing a unicode string across the JS to WASM boundary.
    const str = "Hello from AssemblyScript + JS + WASM with unicode ⚡!";
    pi_as.aslog(str);
};

export const loadHistograms = async (numbers) => {
    logJS('Start calc-ing histograms...');

    const rc = [];
    for (let i = 0; i < numbers.length; i++) {
        const histogram = histo_histogram(numbers[i]);
        if (histogram) {
            rc.push({ num_digits: numbers[i], histogram: histogram });
        }
    }

    logJS('Done calc-ing histograms.');

    return rc;
};
