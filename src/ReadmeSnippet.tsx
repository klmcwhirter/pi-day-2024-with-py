import { ExpandableSection } from './components';

export const ReadmeSnippet = () => (
  <ExpandableSection
    class='hover:text-md m-4 rounded-lg bg-green-50 p-2 text-left text-sm text-blue-800 ring-1 ring-stone-500'
    default={true}
    fallback={<p>Expand Readme snippet ...</p>}
  >
    <p class='mt-2'>
      I do think this pattern has promise, but not just yet. It is a little too
      early. If you notice the version numbers of some of the tech involved are
      not at version 1.0 yet. And there is a lot of integrated tech involved!
      Many people have contributed to what you see here.
    </p>

    <p class='mt-1'>
      But once I tuned performance by including some code in another WASM component. Wow!
    </p>

    <p class='mt-1'>It may not seem earth shattering, but I am blown away.</p>

    <p class='mt-1'>The Python code in the WASM component can do:</p>
    <ul class='mt-1 p-1'>
      <li>
        <span class='mt-1 text-emerald-500'>&pi;</span> use Python skilled
        resources on the team where it make sense to do so
      </li>
      <li>
        <span class='mt-1 text-emerald-500'>&pi;</span> leverage the more
        expressive nature of Python vs JavaScript to get the job done in a more
        maintainable way
      </li>
      <li>
        <span class='mt-1 text-emerald-500'>&pi;</span> keep the very mature UI
        workflows using vite, webpack, etc. in place
      </li>
      <li>
        <span class='mt-1 text-emerald-500'>&pi;</span> expand (dare I say muddy
        the waters of) the conversation about a distributed presentation layer
        some more
      </li>
      <li>
        <span class='mt-1 text-emerald-500'>&pi;</span> nodejs, SSR, now rust -
        WASM is a natural addition to the distributed presentation discussion
        whether it be client or server side (as you will find readily available
        commentary)
      </li>
    </ul>

    <p class='mt-1'>
      WASM is great for CPU or I/O intensive operations. They execute at near native speeds.
      I have 3 implementations: assemblyscript (as), golang (tinygo) and zig. At the end of the day
      is is just Web Assembly - they perform similarly. Executing the histogram function in &lt; 1ms
      whereas pyodide takes multiple seconds per invocation. That is not Python's fault; just pyodide
      overhead.
    </p>
    <p class='mt-1'>
      Here I only pursue client side - because it was fun to do and I was
      curious.
    </p>

    <p class='mt-1'>
      After all, pi day is about celebrating PI (from a mathematical
      perspective) and, in my case, practicing the skills of my craft.
    </p>
  </ExpandableSection>
);
