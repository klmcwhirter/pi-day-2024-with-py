import { Resource, createContext, createResource, useContext } from 'solid-js';

import { PiAdapter, loadPython } from './pyodide.loader';

export class PiState {
  constructor(public piAdapter: Resource<PiAdapter>) {}
}

const PiStateContext = createContext<PiState>();

export const PiAdapterProvider = (props) => {
  const [piAdapter, { mutate: mutatePiAdapter }] = createResource(loadPython, {
    initialValue: new PiAdapter(null),
  });
  const piState = new PiState(piAdapter);

  return (
    <PiStateContext.Provider value={piState}>
      {props.children}
    </PiStateContext.Provider>
  );
};

export const usePiState = () => useContext<PiState>(PiStateContext);
