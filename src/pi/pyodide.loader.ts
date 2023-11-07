import { loadPyodide, PyProxy } from '/node_modules/pyodide/pyodide.mjs';

let pyodide;

export class PiAdapter {
  constructor(public piaProxy: PyProxy) {
    // Provide default implementation while loading
    if (!this.piaProxy) {
      this.piaProxy = {
        histogram: (num_digits: number): number[] => {
          return [];
        },
        pi_digits: (num_digits: number, n: number): [number[]] => [[]],
        version: (): string[] => ['Python is loading ...'],
      };
    }
  }

  destroy_proxy() {
    this.piaProxy?.destroy();
  }

  histogram(num_digits: number): number[] {
    console.log(`JS: histogram(${num_digits})`);
    const rc = this.piaProxy?.histogram(num_digits) || [];
    return rc;
  }

  pi_digits(num_digits: number, n: number): number[] {
    console.log(`JS: pi_digits(${num_digits}, ${n})`);
    const rc = this.piaProxy?.pi_digits(num_digits, n) || [];
    return rc;
  }

  version(): string[] {
    console.log('JS: version()');
    const pyVersions = this.piaProxy?.version() || [];
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

  console.log('JS: version=', piAdapter.version());
  console.log(
    'JS: The server can be shutdown now. Everything is running here.',
  );

  // seed the cache
  for (const n of WELL_KNOWN_NUMS.toReversed()) {
    // optimize caching of digits via toReversed above
    piAdapter.histogram(n);
  }

  return piAdapter;
};

export const WELL_KNOWN_NUMS: number[] = [
  10, 100, 1000, 1024, 10000, 20000, 25000, 30000,
];
