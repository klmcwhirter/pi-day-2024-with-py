import { For, Match, Switch } from 'solid-js';
import { PiDigitsHistoView, PiDigitsView } from './pi/pi-digits';
import { AppStateEnum } from './App';

export const AppDescription = (props) => {
  const [state] = props.state;

  return (
    <div class='m-6 bg-amber-50 p-2 text-left text-lg italic text-emerald-600 shadow-xl shadow-neutral-400'>
      <p class='p-2'>
        This year I set out to do something really unusual. I picked an
        architectural pattern first and looked for requirements that could use
        it.
      </p>

      <p class='p-2'>This is usually a very bad idea.</p>

      <p class='p-2'>
        But, my ultimate goal was to explore ways in which web apps could be
        built with a Python (Pyodide) WASM component providing the "business
        logic".
      </p>

      <p class='p-2'>With that in mind, I have built the following:</p>

      <ul class='list-disc p-2'>
        <li class='m-2 p-2'>
          <span
            class='rounded-md p-2 font-semibold not-italic'
            classList={{
              'bg-emerald-500 text-amber-100': state() == AppStateEnum.DIGITS,
            }}
          >
            digits of Pi
          </span>{' '}
          - shows a grid of squares whose background-color is mapped to a
          pallette of colors corresponding to the digits 0-9.
        </li>
        <li class='m-2 p-2'>
          <span
            class='rounded-md p-2 font-semibold not-italic'
            classList={{
              'bg-emerald-500 text-amber-100':
                state() == AppStateEnum.HISTOGRAM,
            }}
          >
            histogram
          </span>{' '}
          - shows the number of times a digit appears in pi (well, at least the
          first 1024 digits)
        </li>
      </ul>
    </div>
  );
};

const TOTAL_WIDTH = 32; // in rem

export const Bar = (props) => {
  const label = props.label;
  const value = props.value;
  const total = props.total;
  const pct = ((value / total) * 100.0).toFixed(2) + '%';

  const color = props.color;
  const shadow = props.shadow;
  const ratio = parseFloat(((value * 2) / total).toFixed(2));

  const width = `${TOTAL_WIDTH * ratio}rem`;
  const rest = `${TOTAL_WIDTH - TOTAL_WIDTH * ratio}rem`;

  return (
    <div class={`mb-4 text-left shadow-lg ${shadow}`}>
      <span class='h-8 p-0.5 pr-1 text-center text-lg font-medium'>
        {label}
      </span>
      <span
        class={`${color} inline-block h-8 p-0.5 text-left text-lg font-medium`}
        style={`width: ${width}`}
      >
        {pct}
      </span>
      <span
        class='inline-block h-8 bg-neutral-200 p-0.5 text-right text-lg font-medium'
        style={`width: ${rest}`}
      >
        {value}
      </span>
    </div>
  );
};

export const Footer = (props) => {
  return (
    <div class='mb-0 bg-blue-700 p-2 text-green-300'>{props.children}</div>
  );
};

export const Header = (props) => {
  return (
    <h1 class='mt-0 bg-blue-700 p-2 text-center text-4xl text-green-300'>
      Welcome to Pi Day 2024 with Python (and WASM)!
    </h1>
  );
};

export const NavSwitcher = (props) => {
  const [state] = props.state;

  return (
    <div class='col-span-2 col-start-2 mx-auto h-[90vh]'>
      <Switch>
        <Match when={state() === AppStateEnum.DIGITS}>
          <PiDigitsView />
        </Match>
        <Match when={state() === AppStateEnum.HISTOGRAM}>
          <PiDigitsHistoView />
        </Match>
      </Switch>
    </div>
  );
};

export const NavView = (props) => {
  const [state, setState] = props.state;
  const appStates = [AppStateEnum.DIGITS, AppStateEnum.HISTOGRAM];

  return (
    <nav class='m-4 bg-amber-50'>
      <ul>
        <For each={appStates}>
          {(s) => (
            <li class='p-2'>
              <a
                class='m-2 block p-2 text-lg text-blue-700
                hover:rounded-lg hover:bg-emerald-700 hover:font-bold hover:text-white'
                classList={{
                  'rounded-lg bg-emerald-500 font-semibold text-white':
                    state() === s,
                }}
                onclick={() => setState(s)}
              >
                {s}
              </a>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
};
