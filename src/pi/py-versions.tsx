import { Component, For } from 'solid-js';
import { usePiState } from './pi.context';

const PyVersionsView: Component = () => {
  const piState = usePiState();

  return (
    <div>
      <For each={piState.piAdapter().version()}>
        {(s) => <span class='p-2'>{s}</span>}
      </For>
    </div>
  );
};

export default PyVersionsView;
