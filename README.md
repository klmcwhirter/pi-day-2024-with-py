# &pi; pi-day-2024-with-py

##### Table of Contents

- [Overview](#overview)
- [Run it](#run-it)
- [Why pyodide?](#why-pyodide)
- [Downsides](#downsides)

---

<a name="#overview" />

## Overview

In spirit, this is just a reimplementation of [pi-day-2021-with-py](https://github.com/klmcwhirter/pi-day-2021-with-py). But it is, oh, so much more than that.

It uses [SolidJS](https://www.solidjs.com/) and [pyodide](https://pyodide.org/), and runs completely in the browser.

Pyodide provides Python (version 3.11.3 as I write this including most of stdlib and several data science libs) as a WASM component which runs in the browser. I use it via an adapter (or Proxy) because it contains the pi digit generator logic written in Python!

The UI interacts with the Python WASM component via Typescript.

The meat of that is in [pyodide.loader.ts](./src/pi/pyodide.loader.ts) and the [piadapter](./piadapter/__init__.py) Python module.

There are 3 main features represented by the screenshots below.

- 1024 Digits of Pi - [pi-day-2024-digits.png](pi-day-2024-digits.png) - this is a repeat of my [pi-day-2021-with-py](https://github.com/klmcwhirter/pi-day-2021-with-py) project where I did something similar with guizero
- A histogram of the occurrences of the base 10 digits in the first _selectable_ digits of pi - [pi-day-2024-histogram.png](pi-day-2024-histogram.png). The drop down contains values for 10 up to 30,000 digits of pi.
- [pi-day-2024-footer.png](pi-day-2024-footer.png) - hover over the footer to see version information from both the python and Javascript parts of the app.
- the loading screen that hides the initialization process is [pi-day-2024-loading.png](pi-day-2024-loading.png)

> Please note that this is an absolutely useless architecture pattern. Don't use it!
>
> But it was fun to build and shows something else that is possible with WASM.

I do think this pattern has promise, but not just yet. It is a little too early. If you notice the version numbers of some of the tech involved are not at version 1.0 yet. And there is a lot of integrated tech involved! Many people have contributed to what you see here.

It may not seem earth shattering, but I am blown away.

The Python code in the WASM component can do:

- data crunching (data science libraries e.g., numpy, pandas, etc. come built into pyodide) - even though I am not using them on purpose, and not much can be done really - see [Downsides](#downsides) below
- make API calls
- use Python skilled resources on the team more where it make sense to do so
- leverage the more expressive nature of Python vs JavaScript to get the job done in a more maintainable way
- keep the very mature UI workflows using vite, webpack, etc. in place
- expand (dare I say muddy the waters of) the conversation about a distributed presentation layer some more
- nodejs, SSR, now rust - WASM is a natural addition to the distributed presentation discussion whether it be client or server side (as you will find readily available commentary)
- integrating with other WASM components that will become available as things mature

Here I only pursue client side - because it was fun to do and I was curious.

After all, pi day is about celebrating PI vs TAU (from a mathematical perspective) and, in my case, practicing the skills of my craft.

<a name="#run-it" />

## Run it

The build and deployment process relies on Docker and docker-compose. But those are the only dependencies (aside from an internet connection).

Just run `docker-compose up` and open [http://localhost:9000/](http://localhost:9000/) in a browser.

Hit CTRl-C twice! in the terminal where `docker-compose up` was executed to exit.

Yes, I did say twice.

<a name="#why-pyodide" />

## Why pyodide?

I started looking at PyScript because it was getting so much press. But, as I found out, it was solving a different problem. They are focusing on
making it easier for data scientists - only familiar with Python - to get their analysis onto the web. As such it assumes that Python is king and
takes almost complete control of the loaded DOM.

_FYI, [iodide](https://github.com/iodide-project/iodide) is another interesting project, but sadly it is no longer under development._

And, it uses pyodide internally to accomplish its goals.

I did take a cursory look at a few other things like iodide (that also uses pyodide) and the WASM/WASI tooling being built into cpython itself.

Nothing I found was as ready to use as pyodide - search stopped there for now.

## Notes

- [References](References)

<a name="downsides" />

## Downsides ...

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

_See [./piadapter/profile_pi.py](./piadapter/profile_pi.py)._

In short, what I found is that the complexity of the pi_digit_generator algorithm matters in terms of the number of operations performed.

And remember Python in pyodide runs ~50% slower than in my locally compiled 3.12 instance of CPython. So any improvement (or degradation for that matter) will be magnified.

- #### Select better algorithm and write tests

After searching for various algorithms out in the wild and comparing them against each other by writing tests, I settled on one that seems to be the fastest and is reliable. _Like everything else on the web, there are a lot of bad pi algorithms._

_See [./piadapter/pi_digits.py](./piadapter/pi_digits.py)._

I wrote tests to be sure the execution times were reasonable and the histograms were consistent with my original algorithm.

_See [./piadapter/test_pi_digits.py](./piadapter/test_pi_digits.py)._

- #### Improve memoization strategy

Because pi_digit_generator is expected to be idempotent given some upper bound N num_digit value, I found it valuable to cache the output from just the upper bound. Any lower value of num_digits will share the same first set of digits.

Also, histograms consist of a list of 10 integers. So carefully placed usage of the [functools.cache decorator](https://docs.python.org/3/library/functools.html#functools.cache) means I can greatly improve perceived performance for values of num_digits especially >=10_000.

_See [histogram in piadapter](./piadapter/__init__.py) ..._

```python
  @cache
  def histogram(self, num_digits: int) -> list[int]:
      ...
```

- maximize the perceived performance of the generator by reusing result from the largest num_digits value (30_000) - :white_check_mark:
- maximize the perceived performance of calculating the histograms by memoizing the results - :white_check_mark:

Then I just arrange for all the histograms to be calculated in descending order during that dreaded loading phase. But it is now ~10 secs instead of >70 secs!

### Downsides - Build / Deployment

I could not get pyodide to fully coexist with my vite build system. I suspect, primarily, because of all of the dependencies pyodide loads dynamically at runtime. I did see mentions of different groups of people working on that. But the main focus right now is HTML with vanilla JS. And I think that is smart. _Get the core working first._ I am sure that guiding principle is part of the reason why I was able to get this working in such short order.

Also, even though I am targeting the browser execution model, it seems to drag in nodejs modules for various things during the build process. _Huh?_

I spent just a few hours looking for low hanging fruit but then decided to just use vite's built in dev server instead.

The time needed to solve the CI/CD problem set is just not worth it for this silly little experiment of mine.

Maybe in a year or two I will revisit it. Who knows. By then pyodide should be much more mature and stable.

And more importantly, maybe someone else will have solved it for me.
