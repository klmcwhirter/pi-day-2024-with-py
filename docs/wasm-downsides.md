# &pi; pi-day-2024-with-py

## Downsides of Python WASM in browser ...

##### Table of Contents

- Performance
- Build / Deploy
- Design Choices or Fitness of Purpose

---

### Downsides - Performance

Because there is only a single accessible thread in the browser, performance will suffer when using this pattern. You are much better off hosting an API in another process and accessing it asynchronously (via fetch, et al). Even cooperative cycle sharing techniques (via features like [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)) just provide a false sense of hope.

The reality is that any relatively long compute task (greater than 50ms according to the link above) will result in severely degraded perceived performance.

I tried several things to move the perception around. But many of them were just not safe. It was better to just have a loading screen with the buttons disabled and set out to improve the loading time.

Here is what I did to improve the loading time.

- #### Profile my code

CPython 3.12 has some really interesting integrations with the perf utility on Linux.
I used the following references to get prepared to use them.

- [CPython 3.12 profilers](https://docs.python.org/3.12/library/profile.html)
- [Profiling in Python: How to Find Performance Bottlenecks](https://realpython.com/python-profiling/)

_See [../piadapter/profile_pi.py](../piadapter/profile_pi.py)._

In short, what I found is that the complexity of the pi_digit_generator algorithm matters in terms of the number of operations performed.

And remember Python in pyodide runs ~50% slower than in my locally compiled 3.12 instance of CPython. So any improvement (or degradation for that matter) will be magnified.

- #### Select better algorithm and write tests

After searching for various algorithms out in the wild and comparing them against each other by writing tests, I settled on one that seems to be the fastest and is reliable. _Like everything else on the web, there are a lot of bad pi algorithms._

_See [../piadapter/pi_digits.py](../piadapter/pi_digits.py)._

I wrote tests to be sure the execution times were reasonable and the histograms were consistent with my original algorithm.

_See [../piadapter/test_pi_digits.py](../piadapter/test_pi_digits.py)._

- #### Improve memoization strategy

Because pi_digit_generator is expected to be idempotent given some upper bound N num_digits value, I found it valuable to cache the output from just the upper bound. Any lower value of num_digits will share the same first set of digits.

Also, histograms consist of a list of 10 integers. So carefully placed usage of the [functools.cache decorator](https://docs.python.org/3/library/functools.html#functools.cache) means I can greatly improve perceived performance for values of num_digits especially >=10_000.

_See [histogram in piadapter](../piadapter/__init__.py) ..._

```python
  @cache
  def histogram(self, num_digits: int) -> list[int]:
      ...
```

- maximize the perceived performance of the generator by reusing result from the largest num_digits value (30_000) - :white_check_mark:
- maximize the perceived performance of calculating the histograms by memoizing the results - :white_check_mark:

Then I just arrange for all the histograms to be calculated in descending order during that dreaded loading phase. But with better memoization it takes just ~10 secs instead of >70 secs!

- #### Wrote tool to generate the dictionary of digits
After that success I wrote a tool as part of the [../piadapter/pi_digits.py](../piadapter/pi_digits.py) module that will exercise the generator for 30_000 digits of pi and store the result in a file - [../piadapter/pi_30000.py](../piadapter/pi_30000.py).

I then use that to seed the cache in the PiAdpater init method. _See [PiAdapter init](../piadapter/__init__.py) ..._

That reduces start up time to just a couple of seconds.

### Downsides - Build / Deployment

I could not get pyodide to fully coexist with my vite build system. I suspect, primarily, because of all of the dependencies pyodide loads dynamically at runtime. I did see mentions of different groups of people working on that. But the main focus right now is nodejs and then HTML with vanilla JS. And I think that is smart. _Get the core working first._ I am sure that guiding principle is part of the reason why I was able to get this working in such short order.

Also, even though I am targeting the browser execution model, it seems to drag in nodejs modules for various things during the build process. _Huh?_

I spent a few hours looking for low hanging fruit but then decided to just use vite's built in dev server instead.

The time needed to solve the CI/CD problem set is just not worth it for this silly little experiment of mine.

Maybe in a year or two I will revisit it. Who knows. By then pyodide should be much more mature and stable.

And more importantly, maybe someone else will have solved it for me.

### Downsides - Design Choices or maybe I just misunderstood fitness of purpose ...

The most widely used (I am not sure it was the first) tool to produce WASM "executables" is the wonderful [emscripten](https://emscripten.org/) tool chain. It uses LLVM internally to target wasm / wasi architectures. In other words, it works just like the compilers / link editors we have been using for decades.

You give it your (example) C / C++ source code, any options and where you want the output to be placed. This gives you at least a .wasm file that can then be loaded into a browser - again, for example.

The Rust tool chain works the same way. You tell it to build, target the wasm architecture, give it your custom options and voila - a wasm file is produced.

Pyodide (and tools that wrap it like PyScript) don't work like that.

Pyodide *is* the WASM component. The Python artifacts are loaded and interpreted by Pyodide at runtime. Because of the dynamic nature of the Python language, and the complex ways its features might be used it just is not practical (yet) to produce a self-contained WASM executable that is small enough to run in a browser.

So Pyodide then, is a project to compile the CPython code base and many libraries using emscripten to produce a wasm to host the runtime.

You may notice that the version of Python exposed by Pyodide in this project is 3.11.3 - [screenshot](./pi-day-2024-footer.png). That is incredibly impressive at how current that is!

However, what cannot happen yet is running Python code through a compiler to produce a wasm file that can be integrated in a web app with other WASM components written in perhaps C/C++, Rust or golang. And, unfortunately, that is exactly what I set out to do.

With that said, I had a ton of fun learning about where things are at and how much passion and energy about Web Assembly is being applied across the board.

For example, see this video: [YouTube: WebAssembly Breakthroughs with Timo Stark - 11:34](https://youtu.be/4Ikk-KJo3y4). Imagine WASM / WASI being naturally supported by the OCI spec. Can you picture `docker run my-wasm-component` ? How about OS loaders?

Happy Pi Day! &pi;
