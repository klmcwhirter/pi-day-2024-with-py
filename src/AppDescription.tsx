import { AppStateEnum } from './App';

export const AppDescription = (props) => {
  const [state] = props.state;

  const classlistFor = (
    curr: string,
    section: string,
    isListItem: boolean = false,
  ) => {
    let key = '!text-lg font-semibold not-italic';
    if (isListItem) {
      key += ' underline';
    }
    return {
      [key]: curr == section,
    };
  };

  return (
    <div class='m-4 bg-stone-100 p-2 text-left text-lg italic text-emerald-600 shadow-xl shadow-stone-400'>
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

      <ul>
        <li class='mt-2'>
          <p>
            <span class='text-md ml-2 bg-stone-100 p-1 not-italic text-purple-700'>
              &pi;
            </span>
            <span
              class='rounded-md p-2'
              classList={classlistFor(state(), AppStateEnum.DIGITS, true)}
            >
              DIGITS
            </span>{' '}
            - shows a grid of squares whose background-color is mapped to a
            pallette of colors corresponding to the digits 0-9.
          </p>

          <p
            class='mt-2 text-sm text-blue-500'
            classList={classlistFor(state(), AppStateEnum.DIGITS)}
          >
            The generator of the digits of pi is written in python. It shapes
            the returned data by a constant COLS defined in the presentation
            layer. It is passed in from the Typescript call to the Python WASM
            component.
          </p>
          <p
            class='mt-2 text-sm text-blue-500'
            classList={classlistFor(state(), AppStateEnum.DIGITS)}
          >
            The presentation is written in Typescript and uses SolidJS.
          </p>
        </li>
        <li class='mt-2'>
          <p>
            <span class='text-md ml-2 bg-stone-100 p-1 not-italic text-purple-700'>
              &pi;
            </span>
            <span
              class='rounded-md p-2'
              classList={classlistFor(state(), AppStateEnum.HISTOGRAM, true)}
            >
              HISTOGRAM
            </span>{' '}
            - shows the number of times a digit appears in pi (well, at least
            the first 1024 digits)
          </p>

          <p
            class='mt-2 text-sm text-blue-500'
            classList={classlistFor(state(), AppStateEnum.HISTOGRAM)}
          >
            The code that produces the data for the histogram is written in
            python.
          </p>
          <p
            class='mt-2 text-sm text-blue-500'
            classList={classlistFor(state(), AppStateEnum.HISTOGRAM)}
          >
            The presentation is written in Typescript and uses SolidJS.
          </p>
          <p class='mb-0 mt-2 text-sm'>
            Don't forget to look at console.log for 'PYTHON'. Those are
            generated directly from the Python stdlib logging module.
          </p>
        </li>
      </ul>
    </div>
  );
};
