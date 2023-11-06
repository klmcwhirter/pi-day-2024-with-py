import { loadPyodide } from '/node_modules/pyodide/pyodide.mjs';

let pyodide;

const ROWS = 32;
const COLS = 32;
// Note that 32 * 32 = 1024
export const NUM_DIGITS = ROWS * COLS;

export class PiAdapter {
  constructor(public piaProxy) {
    this.piaProxy = piaProxy;

    // Provide default implementation while loading
    if (!this.piaProxy) {
      this.piaProxy = {
        histogram: (num_digits: number) => {
          return [];
        },
        pi_digits: (num_digits: number) => [],
        version: (): string[] => ['Python is loading ...'],
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

  return piAdapter;
};
