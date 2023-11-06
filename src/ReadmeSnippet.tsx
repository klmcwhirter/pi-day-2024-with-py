import { ExpandableSection } from './components';

export const ReadmeSnippet = () => (
  // border-t-2 border-t-blue-500/20
  <ExpandableSection
    class='m-4 p-2 text-left text-sm text-blue-600'
    fallback={<p class='mt-4'>Expand Readme snippet ...</p>}
  >
    <p class='mt-4'>
      I do think this pattern has promise, but not just yet. It is a little too
      early. If you notice the version numbers of some of the tech involved are
      not at version 1.0 yet. And there is a lot of integrated tech involved!
      Many people have contributed to what you see here.
    </p>

    <p class='p-1'>It may not seem earth shattering, but I am blown away.</p>

    <p class='p-1'>The Python code in the WASM component can do:</p>
    <ul class='p-1'>
      <li>
        <span class='p-1 text-emerald-500'>&pi;</span> data crunching (data
        science libraries e.g., numpy, pandas, etc. come built into pyodide) -
        even though I am not using them on purpose
      </li>
      <li>
        <span class='p-1 text-emerald-500'>&pi;</span> make API calls
      </li>
      <li>
        <span class='p-1 text-emerald-500'>&pi;</span> use Python skilled
        resources on the team where it make sense to do so
      </li>
      <li>
        <span class='p-1 text-emerald-500'>&pi;</span> leverage the more
        expressive nature of Python vs JavaScript to get the job done in a more
        maintainable way
      </li>
      <li>
        <span class='p-1 text-emerald-500'>&pi;</span> keep the very mature UI
        workflows using vite, webpack, etc. in place
      </li>
      <li>
        <span class='p-1 text-emerald-500'>&pi;</span> expand the (dare I say
        muddy the waters) conversation about a distributed presentation layer
        some more
      </li>
      <li>
        <span class='p-1 text-emerald-500'>&pi;</span> nodejs, SSR, now rust -
        WASM is a natural addition to the distributed presentation discussion
        whether it be client or server side (as you will find readily available
        commentary)
      </li>
    </ul>

    <p class='p-1'>
      Here I only pursue client side - because it was fun to do and I was
      curious.
    </p>

    <p class='p-1'>
      After all, pi day is about celebrating PI vs TAU (from a mathematical
      perspective) and, in my case, practicing the skills of my craft.
    </p>
  </ExpandableSection>
);
