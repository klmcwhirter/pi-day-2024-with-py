import { Resource, createContext, createResource, useContext } from 'solid-js';

import { PiAdapter, WELL_KNOWN_NUMS, loadPython } from './pyodide.loader';

export class PiState {
  constructor(
    public piAdapter: Resource<PiAdapter>,
    public seeded: Resource<boolean>,
  ) {}
}

const PiStateContext = createContext<PiState>();

export const PiAdapterProvider = (props) => {
  const [piAdapter] = createResource(loadPython, {
    initialValue: new PiAdapter(null),
  });

  const fetchSeeded = (adapter: PiAdapter): boolean => {
    console.log(`JS: fetchSeeded(adapter)`, adapter);

    if (!adapter.seeded && !adapter.seeding) {
      const _task: number = requestIdleCallback(() => {
        adapter.histograms_seed_cache(
          // optimize caching of digits via reverse sort
          WELL_KNOWN_NUMS.toSorted((a: number, b: number) => b - a),
          true,
        );
        console.log(`JS: fetchSeeded(adapter) ... done`, adapter);
        mutateSeeded((prev) => adapter.seeded);
      });
    } else {
      console.log(
        `JS: fetchSeeded(adapter): already requested seeding ... skipping`,
        adapter,
      );
    }

    return adapter.seeded;
  };

  const [seeded, { mutate: mutateSeeded }] = createResource<boolean, PiAdapter>(
    piAdapter,
    fetchSeeded,
    {
      initialValue: false,
    },
  );
  const piState = new PiState(piAdapter, seeded);

  return (
    <PiStateContext.Provider value={piState}>
      {props.children}
    </PiStateContext.Provider>
  );
};

export const usePiState = () => useContext<PiState>(PiStateContext);
