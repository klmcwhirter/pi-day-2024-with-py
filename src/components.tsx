import { For, Match, Show, Switch, createSignal } from 'solid-js';
import { PiDigitsHistoView, PiDigitsView } from './pi/pi-digits';
import { AppStateEnum } from './App';
import { ReadmeSnippet } from './ReadmeSnippet';

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

export const ExpandableSection = (props) => {
  const classes = props.class;
  const expanded_default = props.default || false;
  const fallback = props.fallback;

  const [expanded, setExpanded] = createSignal(expanded_default);

  const toggleExpanded = (evt) => setExpanded((prev) => !prev);

  return (
    <section
      class={`${classes} hover:cursor-pointer hover:font-semibold hover:underline`}
      onclick={toggleExpanded}
    >
      <Show when={!expanded()}>{fallback}</Show>

      <Show when={expanded()}>{props.children}</Show>
    </section>
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

      <div class='w-18 float-right m-3 inline aspect-square h-auto align-middle'>
        <a
          href='https://github.com/klmcwhirter/pi-day-2024-with-py'
          class='hover:cursor-pointer'
          target='_blank'
        >
          <svg
            height='32'
            aria-hidden='true'
            viewBox='0 0 16 16'
            version='1.1'
            width='32'
            data-view-component='true'
            class='inline fill-green-300'
          >
            <path d='M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z'></path>
          </svg>
        </a>
      </div>
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
      <ul class='shadow-lg'>
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
      <ReadmeSnippet />
    </nav>
  );
};
