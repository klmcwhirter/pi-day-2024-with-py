import { Resource, createContext, createResource, useContext } from 'solid-js';

import { PiAdapter, loadWasm } from './pyodide.loader';
import { logJS } from './utils.js';

export class PiState {
  constructor(
    public piAdapter: Resource<PiAdapter>,
    public seeded: Resource<boolean>,
  ) { }
}

const PiStateContext = createContext<PiState>();

export const PiAdapterProvider = (props) => {
  const [piAdapter] = createResource(loadWasm, {
    initialValue: new PiAdapter(null),
  });

  const fetchSeeded = (adapter: PiAdapter): boolean => {
    logJS(`fetchSeeded(adapter)`, adapter);

    if (adapter) {
      const _task: number = requestIdleCallback(() => {
        logJS(`fetchSeeded(adapter) ... done`, adapter);
        mutateSeeded((_prev) => adapter.seeded);
      });
    } else {
      logJS(`fetchSeeded(adapter): already requested seeding ... skipping`, adapter);
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
