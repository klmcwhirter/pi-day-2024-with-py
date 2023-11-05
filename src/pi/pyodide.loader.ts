import { loadPyodide } from '/node_modules/pyodide/pyodide.mjs';

let pyodide;

const range = (n): number[] => [...Array(n).keys()];

const ROWS = 32;
const COLS = 32;
// Note that 32 * 32 = 1024
export const NUM_DIGITS = ROWS * COLS;

export class PiAdapter {
  constructor(public piaProxy) {
    this.piaProxy = piaProxy;
    if (!this.piaProxy) {
      this.piaProxy = {
        histogram: (num_digits: number) => {
          return [];
        },
        pi_digits: (num_digits: number) => [],
        version: (): string[] => ['Proxy is loading ...'],
      };
    }
  }

  destroy_proxy() {
    this.piaProxy.destroy();
  }

  histogram() {
    const rc = this.piaProxy.histogram(NUM_DIGITS);
    return rc;
  }

  pi_digits() {
    const rc = this.piaProxy.pi_digits(NUM_DIGITS, COLS);
    return rc;
  }

  version(): string[] {
    return [`pyodide.version: ${pyodide?.version}`, ...this.piaProxy.version()];
  }
}

const loadPiadapter = async (pyodide) => {
  let zipResponse = await fetch('piadapter.zip');
  let zipBinary = await zipResponse.arrayBuffer();
  pyodide.unpackArchive(zipBinary, 'zip');

  const piadapterPkg = pyodide.pyimport('piadapter');
  return piadapterPkg.pia;
};

export const loadPython = async (_load: boolean): Promise<PiAdapter> => {
  pyodide = await loadPyodide();
  pyodide.setStderr({ batched: console.log });
  pyodide.setStdout({ batched: console.log });
  console.log('from JS: back from loading pyodide', pyodide);

  const pia = await loadPiadapter(pyodide);
  console.log('from JS: back from loading piadapter', pia);

  const piAdapter = new PiAdapter(pia);

  console.log('from JS: version=', piAdapter.version());

  return piAdapter;
};
