import { pi_digits_seed } from './pi_digits_seed';

import { batched, logJS } from './utils.js';


export class PiAdapter {
    _pi_digits: number[] = pi_digits_seed;
    _histograms: {} = null;
    _version = '';

    constructor(
    ) {
    }


    calcHistogram(n: number): number[] {
        logJS(`PiAdapter.histogram(${n})`);
        const slice_of_pi: number[] = pi_digits_seed.slice(0, n);
        const slice_of_pi_len = slice_of_pi.length;

        const rc: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i: number = 0; i < slice_of_pi_len; i++) {
            rc[slice_of_pi[i]]++;
        }

        return rc;
    }

    calcHistograms(numbers: number[]) {
        logJS('PiAdapter.calcHistograms: Start calc-ing histograms...');

        if (!this._histograms) {
            this._histograms = {};
            for (let i = 0; i < numbers.length; i++) {
                const histogram = this.calcHistogram(numbers[i]);
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

export const loadPiAdapter = async (_load: boolean): Promise<PiAdapter> => {
    logJS('loadPiAdapter: loading ...');

    const piAdapter = new PiAdapter();
    piAdapter.calcHistograms(WELL_KNOWN_NUMS.toReversed());

    logJS('loadPiAdapter: loading ... done');

    return piAdapter;
};

export const WELL_KNOWN_NUMS: number[] = [
    10, 100, 1000, 1024, 1536, 10000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
];
