import { Component, For } from 'solid-js';
import { usePiState } from './pi.context';
import { Bar } from '../components';
import { NUM_DIGITS } from './pyodide.loader';

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

const shadow_pallette = [
  'shadow-purple-700/30',
  'shadow-violet-300',
  'shadow-blue-700/30',
  'shadow-sky-200',
  'shadow-green-600/30',
  'shadow-[yellow]/30',
  'shadow-orange-400/30',
  'shadow-red-700/30',
  'shadow-red-900/30', // crimson
  'shadow-black/30',
];

export const PiDigitsView: Component = (props) => {
  const piState = usePiState();

  return (
    <div class='table h-full border-collapse bg-stone-100 align-middle'>
      <For each={piState.piAdapter().pi_digits()}>
        {(row) => (
          <div class='table-row'>
            <For each={row}>
              {(col) => (
                <span
                  class={`m-1 table-cell aspect-square h-auto w-5 rounded-md border text-center align-middle text-sm ${pallette[col]}`}
                >
                  {col}
                </span>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};

export const PiDigitsHistoView: Component = (props) => {
  const piState = usePiState();

  const values = piState
    .piAdapter()
    .histogram()
    .map((v) => v);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  return (
    <div>
      <div class='mb-6 mt-4 rounded-lg bg-stone-200 p-4 text-center text-blue-800 shadow-lg'>
        <p class='text-2xl font-semibold'>
          Number of times each digit appears in Pi
        </p>
        <p class='text-lg text-blue-500'>first 1024 digits</p>
      </div>

      <div class='mt-2 p-2'>
        <For each={values}>
          {(e, i) => (
            <Bar
              label={i()}
              color={pallette[i()]}
              shadow={shadow_pallette[i()]}
              value={e}
              maxValue={maxValue}
              minValue={minValue}
              total={NUM_DIGITS}
            />
          )}
        </For>
      </div>
    </div>
  );
};
