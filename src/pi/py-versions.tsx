import { Component, For } from 'solid-js';
import { usePiContext } from './pi.context';

const PyVersionsView: Component = () => {
  const piContext = usePiContext();

  return (
    <div>
      <For each={piContext.piAdapter()?.version()}>
        {(s) => <span class='p-2'>{s}</span>}
      </For>
    </div>
  );
};

export default PyVersionsView;
