import { Resource, createContext, createResource, useContext } from 'solid-js';

import { PiAdapter, loadPiAdapter } from './histo.loader';

export class PiState {
  constructor(
    public piAdapter: Resource<PiAdapter>,
  ) { }
}

const PiStateContext = createContext<PiState>();

export const PiAdapterProvider = (props) => {
  const [piAdapter] = createResource(loadPiAdapter, {
    initialValue: new PiAdapter(),
  });

  const piState = new PiState(piAdapter);

  return (
    <PiStateContext.Provider value={piState}>
      {props.children}
    </PiStateContext.Provider>
  );
};

export const usePiContext = () => useContext<PiState>(PiStateContext);
