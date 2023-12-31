import { loadPyodide } from '/node_modules/pyodide/pyodide.mjs';
import type { PyProxy } from 'pyodide/ffi';

import { loadHistograms, loadOtherWasm, histo_pi_digits, histo_version } from './histo.loader.js';
import { logJS } from './utils.js';

let pyodide;


class HistogramInterop {
  num_digits
  histogram
}

export class PiAdapter {
  seeded: boolean;
  constructor(
    public piaProxy: PyProxy,
  ) {
    this.piaProxy = piaProxy;
    this.seeded = false;
  }

  destroy_proxy() {
    this.piaProxy?.destroy();
  }

  seed_pi_digits(pi_digits: Int32Array) {
    this.piaProxy?.seed_pi_digits(pi_digits);
  }

  histograms_seed_cache(histograms: HistogramInterop[], force = false): void {
    logJS(`histograms_seed_cache([...], force=${force})`);
    if (this.piaProxy == null) {
      logJS(`histograms_seed_cache([...], force=${force}) - no piaProxy yet ... skipping`);
      return;
    }

    this.seeded = false;
    logJS(`histograms_seed_cache([...], force=${force}) ... continuing`);

    this.piaProxy?.histograms_seed_cache(histograms);

    logJS(`histograms_seed_cache([...], force=${force}) ... done`);

    this.seeded = true;
  }

  histogram(num_digits: number): number[] {
    let rc = [];
    logJS(`histogram(${num_digits})`);
    if (this.piaProxy == null) {
      logJS(`histogram(${num_digits}) -  - no piaProxy yet ... skipping`);
      return rc
    }

    if (!this.seeded) {
      logJS(`histogram(${num_digits}) - cache not seeded or currently seeding - skipping`);
    } else {
      rc = this.piaProxy?.histogram(num_digits) || [];
    }
    return rc;
  }

  pi_digits(num_digits: number, n: number): number[] {
    logJS(`pi_digits(${num_digits}, ${n})`);
    const rc = this.piaProxy?.pi_digits(num_digits, n) || [];
    return rc;
  }

  version(): string[] {
    logJS('version()');
    const pyVersions = this.piaProxy?.version() || ['Python is loading...'];
    return [histo_version, `pyodide.version: ${pyodide?.version}`, ...pyVersions];
  }
}

const loadPiadapter = async (pyodide) => {
  // See etc/gen_run_pytests.sh where piadapter.tgz is created. It is called from Containerfile.
  let tgzResponse = await fetch('piadapter.tgz');
  let tgzBinary = await tgzResponse.arrayBuffer();
  await pyodide.unpackArchive(tgzBinary, 'gztar');

  const piadapterPkg = pyodide.pyimport('piadapter');
  return piadapterPkg.pia;
};

export const loadWasm = async (_load: boolean): Promise<PiAdapter> => {
  logJS('loading pyodide');
  pyodide = await loadPyodide();
  pyodide.setStderr({ batched: console.log });
  pyodide.setStdout({ batched: console.log });
  logJS('back from loading pyodide', pyodide);

  logJS('loading piadapter');
  const pia = await loadPiadapter(pyodide);
  logJS('back from loading piadapter', pia);

  logJS('loading other WASM ...');
  await loadOtherWasm();
  logJS('loading other WASM ... done');

  logJS('The server can be shutdown now. Everything is running in the browser.');

  const piAdapter = new PiAdapter(pia);
  piAdapter.seed_pi_digits(histo_pi_digits);

  logJS('loading histograms');

  const histograms: HistogramInterop[] = await loadHistograms(WELL_KNOWN_NUMS);

  logJS('back from loading histograms');

  piAdapter.histograms_seed_cache(histograms);

  logJS('histogram cache seeded');

  return piAdapter;
};

export const WELL_KNOWN_NUMS: number[] = [
  10, 100, 1000, 1024, 1536, 10000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
];
