import * as pi_as from './pi-as.js';
import { batched, logJS } from './utils.js';


type HistogramProvider = (number) => number[];

export class PiAdapter {
    _pi_digits: number[] = [];
    _histograms: {} = null;
    _histogramProvider: HistogramProvider;
    _version = '';

    constructor(
        pi_digits: number[],
        version: string
    ) {
        this._pi_digits = pi_digits;
        this._version = version;
    }

    calcHistograms(numbers: number[], histogramProvider: HistogramProvider) {
        logJS('PiAdapter.calcHistograms: Start calc-ing histograms...');
        if (!this._histograms) {
            this._histograms = {};
            for (let i = 0; i < numbers.length; i++) {
                const histogram = histogramProvider(numbers[i]);
                if (histogram) {
                    this._histograms[numbers[i]] = histogram;
                }
            }
        }
        logJS('PiAdapter.calcHistograms: calc-ing histograms ... done');
    }

    histogram(num_digits: number): number[] {
        logJS(`PiAdapter.histogram(${num_digits})`);

        const rc = this._histograms[num_digits] || [];
        return rc;
    }

    pi_digits(num_digits: number, n: number): number[][] {
        logJS(`PiAdapter.pi_digits(${num_digits}, ${n})`);
        const rc: number[][] = [];

        const digits = this._pi_digits.slice(0, num_digits) || [];
        for (let da of batched(digits, n)) {
            rc.push(da);
        }

        logJS(`PiAdapter.pi_digits(${num_digits}, ${n}) ... done`);

        return rc;
    }

    version(): string[] {
        logJS('PiAdapter.version()');
        return [this._version];
    }
}

export const loadWasm = async (_load: boolean): Promise<PiAdapter> => {
    logJS('loadWasm: loading WASM ...');

    const histo_pi_digits = pi_as.pi_digits();
    const histo_histogram = pi_as.histogram;
    const histo_version = pi_as.version();

    const piAdapter = new PiAdapter(histo_pi_digits, histo_version);
    piAdapter.calcHistograms(WELL_KNOWN_NUMS.toReversed(), histo_histogram);

    // Passing a unicode string across the JS to WASM boundary.
    const str = "Hello from AssemblyScript + JS + WASM with unicode ⚡!";
    pi_as.aslog(str);

    logJS('loadWasm: loading WASM ... done');

    return piAdapter;
};

export const WELL_KNOWN_NUMS: number[] = [
    10, 100, 1000, 1024, 1536, 10000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
];
