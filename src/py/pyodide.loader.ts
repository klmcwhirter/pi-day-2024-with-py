import { loadPyodide } from '/node_modules/pyodide/pyodide.mjs';

let pyodide;

const range = (n): number[] => [...Array(n).keys()];

// Note that 32 * 32 = 1024
const ROWS = 32;
const COLS = 32;

export class PiAdapter {
  constructor(public piaProxy) {
    this.piaProxy = piaProxy;
    if (!this.piaProxy) {
      this.piaProxy = {
        pi_digits: () => [],
        version: () => 'Proxy is loading ...',
      };
    }
  }

  destroy_proxy() {
    this.piaProxy.destroy();
  }

  pi_digits() {
    const digits = this.piaProxy.pi_digits();
    const rc = [];
    for (const r of range(ROWS)) {
      const row = [];
      for (const c of range(COLS)) {
        row.push(digits[r * COLS + c]);
      }
      rc.push(row);
    }
    return rc;
  }

  version(): string[] {
    return [`pyodide.version: ${pyodide?.version}`, this.piaProxy.version()];
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
  console.log('from JS: back from loading pyodide', pyodide);

  const pia = await loadPiadapter(pyodide);
  console.log('from JS: back from loading piadapter', pia);

  const piAdapter = new PiAdapter(pia);

  console.log('from JS: version=', piAdapter.version());

  return piAdapter;
};
