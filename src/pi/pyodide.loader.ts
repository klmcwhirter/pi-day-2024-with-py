import { loadPyodide } from '/node_modules/pyodide/pyodide.mjs';
import type { PyProxy } from 'pyodide/ffi';

let pyodide;

export class PiAdapter {
  constructor(
    public piaProxy: PyProxy,
    public seeded: boolean = false,
    public seeding: boolean = false,
  ) {
    this.piaProxy = piaProxy;
    this.seeded = seeded;
    this.seeding = seeding;
  }

  destroy_proxy() {
    this.piaProxy?.destroy();
  }

  histograms_seed_cache(nums: number[], force = false): void {
    console.log(`JS: histograms_seed_cache([${nums}], force=${force})`);
    if (this.piaProxy == null) {
      console.log(
        `JS: histograms_seed_cache([${nums}], force=${force}) - no piaProxy yet ... skipping`,
      );
      return;
    }

    if (this.seeding && !force) {
      console.log(
        `JS: histograms_seed_cache([${nums}], force=${force}) - already seeding cache ... skipping`,
      );
      return;
    }

    this.seeded = false;
    console.log(
      `JS: histograms_seed_cache([${nums}], force=${force}) - not seeding cache ... continuing`,
    );

    this.piaProxy?.histograms_seed_cache(nums);

    console.log(
      `JS: histograms_seed_cache([${nums}], force=${force}) ... done`,
    );

    this.seeded = true;
    this.seeding = false;
  }

  histogram(num_digits: number): number[] {
    let rc = [];
    console.log(`JS: histogram(${num_digits})`);
    if (this.piaProxy == null) {
      console.log(
        `JS: histogram(${num_digits}) -  - no piaProxy yet ... skipping`,
      );
      return rc
    }

    if (!this.seeded || this.seeding) {
      console.log(
        `JS: histogram(${num_digits}) - cache not seeded or currently seeding - skipping`,
      );
    } else {
      rc = this.piaProxy?.histogram(num_digits) || [];
    }
    return rc;
  }

  pi_digits(num_digits: number, n: number): number[] {
    console.log(`JS: pi_digits(${num_digits}, ${n})`);
    const rc = this.piaProxy?.pi_digits(num_digits, n) || [];
    return rc;
  }

  version(): string[] {
    console.log('JS: version()');
    const pyVersions = this.piaProxy?.version() || ['Python is loading...'];
    return [`pyodide.version: ${pyodide?.version}`, ...pyVersions];
  }
}

const loadPiadapter = async (pyodide) => {
  // See package,json where piadapter.zip is created. That is used by Dockerfile.
  let zipResponse = await fetch('piadapter.zip');
  let zipBinary = await zipResponse.arrayBuffer();
  await pyodide.unpackArchive(zipBinary, 'zip');

  const piadapterPkg = pyodide.pyimport('piadapter');
  return piadapterPkg.pia;
};

export const loadPython = async (_load: boolean): Promise<PiAdapter> => {
  pyodide = await loadPyodide();
  pyodide.setStderr({ batched: console.log });
  pyodide.setStdout({ batched: console.log });
  console.log('JS: back from loading pyodide', pyodide);

  const pia = await loadPiadapter(pyodide);
  console.log('JS: back from loading piadapter', pia);

  const piAdapter = new PiAdapter(pia);

  console.log(
    'JS: The server can be shutdown now. Everything is running in the browser.',
  );

  return piAdapter;
};

export const WELL_KNOWN_NUMS: number[] = [
  10, 100, 1000, 1024, 10000, 20000, 25000, 30000,
];
