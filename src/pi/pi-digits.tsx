import {
  Component,
  For,
  createResource,
  createSignal,
} from 'solid-js';
import { Bar } from '../components';
import { usePiState } from './pi.context';
import { HistogramItemValues, HistogramValues } from './pi-digits.model';
import { WELL_KNOWN_NUMS } from './pyodide.loader';

const ROWS = 32;
const COLS = 48;
// Note that 32 * 48 = 1536
const NUM_DIGITS = ROWS * COLS;

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
      <For each={piState.piAdapter().pi_digits(NUM_DIGITS, COLS)}>
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

export const PiDigitsHistogram: Component = (props) => {
  const piState = usePiState();

  const fetchHistogram = async (n: number): Promise<HistogramValues> => {
    const numbers: number[] = piState.piAdapter().histogram(n);
    const items: HistogramItemValues[] = numbers.map(
      (v: number, i: number): HistogramItemValues =>
        new HistogramItemValues(i, v, pallette[i], shadow_pallette[i]),
    );
    const rc = new HistogramValues(n, items);
    return Promise.resolve(rc);
  };

  const [selected, setSelected] = createSignal(NUM_DIGITS);
  const [values] = createResource<HistogramValues, number>(
    selected,
    fetchHistogram,
  );

  return (
    <div>
      <div class='mb-6 mt-4 rounded-lg bg-stone-200 p-4 text-center text-blue-800 shadow-lg'>
        <p class='text-2xl font-semibold'>
          Number of times each digit appears in Pi
        </p>
        <p class='text-lg text-blue-500'>
          <span class='mr-2'>first</span>
          <select
            class='rounded-lg pl-2 pr-1 text-blue-800 ring-2 ring-stone-100 hover:font-semibold hover:ring-stone-500'
            value={values()?.num_digits}
            onInput={(e) => setSelected(+e.currentTarget.value)}
          >
            <For each={WELL_KNOWN_NUMS}>
              {(n) => <option value={n}>{n}</option>}
            </For>
          </select>
          <span class='ml-2'>digits</span>
        </p>
      </div>

      <div class='mt-2 p-2'>
        <For each={values()?.items}>
          {(e) => <Bar item={e} values={values} />}
        </For>
      </div>
    </div>
  );
};
