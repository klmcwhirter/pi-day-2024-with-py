import { For, Match, Switch } from 'solid-js';
import { PiDigitsHistoView, PiDigitsView } from './pi/pi-digits';
import { AppStateEnum } from './App';

export const Bar = (props) => {
  const TOTAL_WIDTH = 32; // in rem

  const label = props.label;
  const value = props.value;

  const maxValue = props.maxValue;
  const minValue = props.minValue;

  const color = props.color;
  const shadow = props.shadow;

  const total = props.total;
  const pct = ((value / total) * 100.0).toFixed(2) + '%';

  const ratio = (value * 2) / total;
  const width = `${TOTAL_WIDTH * ratio}rem`;
  const rest = `${TOTAL_WIDTH - TOTAL_WIDTH * ratio}rem`;

  return (
    <div class={`mb-6 bg-stone-200 text-left shadow-lg ${shadow}`}>
      <span class='inline-block h-8 border border-r-stone-400 bg-stone-100 p-0.5 !pr-1 text-center text-lg font-medium'>
        {label}
      </span>
      <span
        class={`${color} inline-block h-8 p-0.5 text-left text-lg font-medium`}
        style={`width: ${width}`}
      >
        {pct}
      </span>
      <span
        class='inline-block h-8 bg-stone-200 p-0.5 text-right'
        classList={{
          'font-bold text-2xl text-green-500': value === maxValue,
          'font-bold text-2xl text-yellow-800': value === minValue,
        }}
        style={`width: ${rest}`}
      >
        {value}
      </span>
    </div>
  );
};

export const Footer = (props) => {
  return (
    <div class='mb-0 bg-blue-700 p-2 text-center text-xs text-green-300 hover:p-0.5 hover:text-lg hover:font-bold'>
      {props.children}
    </div>
  );
};

export const Header = (props) => {
  return (
    <div class='mt-0 bg-blue-700 p-2'>
      <img src='./pi.svg' class='mr-12 inline w-14' />

      <h1 class='inline fill-green-300 text-center align-middle text-4xl text-green-300'>
        Welcome to Pi Day 2024 with Python (and WASM) !
      </h1>
    </div>
  );
};

export const NavSwitcher = (props) => {
  const [state] = props.state;

  return (
    <div class='col-span-2 col-start-2 mx-auto h-[89vh]'>
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
    <nav class='m-4 rounded-lg bg-stone-200'>
      <ul>
        <For each={appStates}>
          {(s) => (
            <li class='p-2'>
              <a
                class='m-2 block p-2 text-lg text-blue-700
                hover:cursor-pointer hover:rounded-lg hover:bg-emerald-700 hover:font-bold hover:text-white'
                classList={{
                  'rounded-lg bg-emerald-500 font-bold text-white shadow-xl':
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
