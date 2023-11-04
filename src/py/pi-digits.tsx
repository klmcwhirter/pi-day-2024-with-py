import { Component, For } from 'solid-js';
import { usePiState } from './pi.context';

// purple,violet,blue,lightblue,green,yellow,orange,red,crimson,black

const pallette = [
  'bg-purple-700 text-white',
  'bg-violet-300',
  'bg-blue-700 text-white',
  'bg-sky-200',
  'bg-green-600 text-white',
  'bg-[yellow]',
  'bg-orange-400',
  'bg-red-700 text-white',
  'bg-red-900 text-white', // crimson
  'bg-black text-white',
];

const PiDigitsView: Component = () => {
  const piState = usePiState();

  return (
    <div class='mx-auto table border-collapse'>
      <For each={piState.piAdapter().pi_digits()}>
        {(row) => (
          <div class='table-row'>
            <For each={row}>
              {(col) => (
                <td
                  class={`table-cell aspect-square h-auto w-6 border-collapse rounded-md text-center text-sm ${pallette[col]}`}
                >
                  {col}
                </td>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};

export default PiDigitsView;
