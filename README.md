# &pi; pi-day-2024-with-py

##### Table of Contents

- [Overview](#overview)
- [Run it](#run-it)
- [Why pyodide?](#why-pyodide)
- [Downsides](./docs/wasm-downsides.md)
- [Summary](#summary)

---

## Overview

In spirit, this is just a reimplementation of [pi-day-2021-with-py](https://github.com/klmcwhirter/pi-day-2021-with-py). But it is, oh, so much more than that.

It uses [SolidJS](https://www.solidjs.com/) and [pyodide](https://pyodide.org/), and runs completely in the browser.

Pyodide provides Python (version 3.11.3 as I write this including most of stdlib and several data science libs) as a WASM component which runs in the browser. I use it via an adapter (or Proxy) because it contains the pi digit generator logic written in Python!

The UI interacts with the Python WASM component via Typescript.

The meat of that is in [pyodide.loader.ts](./src/pi/pyodide.loader.ts) and the [piadapter](./piadapter/__init__.py) Python module.

There are 3 main features represented by the screenshots below.

- 1024 Digits of Pi - [pi-day-2024-digits.png](./docs/pi-day-2024-digits.png) - this is a repeat of my [pi-day-2021-with-py](https://github.com/klmcwhirter/pi-day-2021-with-py) project where I did something similar with guizero
- A histogram of the occurrences of the base 10 digits in the first _selectable_ digits of pi - [pi-day-2024-histogram.png](./docs/pi-day-2024-histogram.png). The drop down contains values for 10 up to 30,000 digits of pi.
- [pi-day-2024-footer.png](./docs/pi-day-2024-footer.png) - hover over the footer to see version information from both the python and Javascript parts of the app.
- the loading screen that hides the initialization process is [pi-day-2024-loading.png](./docs/pi-day-2024-loading.png)

> Please note that this is an absolutely useless architecture pattern. Don't use it!
>
> But it was fun to build and shows something else that is possible with WASM.

## Run it

The build and deployment process relies on Docker and docker-compose. But those are the only dependencies (aside from an internet connection).

Just run `docker-compose up` and open [http://localhost:9000/](http://localhost:9000/) in a browser.

Hit CTRl-C twice! in the terminal where `docker-compose up` was executed to exit.

Yes, I did say twice.

If you are uing the nix package manager with flakes enabled, then simply doing the following will setup the environment and output a reminder of next steps.

`$ nix develop`


## Why pyodide?

I started looking at PyScript because it was getting so much press. But, as I found out, it was solving a different problem. They are focusing on
making it easier for data scientists - only familiar with Python - to get their analysis onto the web. As such it assumes that Python is king and
takes almost complete control of the loaded DOM.

_FYI, [iodide](https://github.com/iodide-project/iodide) is another interesting project, but sadly it is no longer under development._

And, both PyScript and iodide use pyodide internally to accomplish their goals.

I did take a cursory look at a few other things like iodide (that also uses pyodide) and the WASM/WASI tooling being built into cpython itself.

Nothing I found was as ready to use as pyodide - search stopped there for now.

## Summary

I do think this pattern has promise, but not just yet. It is a little too early. If you notice the version numbers of some of the tech involved are not at version 1.0 yet. And there is a lot of integrated tech involved! Many people across many projects have contributed to what you see here.

The result may not seem earth shattering on the surface, but I am blown away.

The Python code in the WASM component can do:

- data crunching (data science libraries e.g., numpy, pandas, etc. come built into pyodide) - even though I am not using them on purpose, and not much can be done really - see [Downsides](./docs/wasm-downsides.md)
- make API calls
- use Python skilled resources on the team more where it make sense to do so
- leverage the more expressive nature of Python vs JavaScript to get the job done in a more maintainable way
- keep the very mature UI workflows using vite, webpack, etc. in place
- expand (dare I say muddy the waters of) the conversation about a distributed presentation layer some more
- nodejs, SSR, now rust - WASM is a natural addition to the distributed presentation discussion whether it be client or server side (as you will find readily available commentary)
- integrating with other WASM components that will become available as things mature

Here I only pursue client side - because it was fun to do and I was curious.

After all, pi day is about celebrating PI vs TAU (from a mathematical perspective) and, in my case, practicing the skills of my craft.

## Notes

- [References](./docs/references.md)

