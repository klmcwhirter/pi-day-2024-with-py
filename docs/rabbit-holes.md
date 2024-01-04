# &pi; pi-day-2024-with-py

## Rabbit Holes Travelled ...

### zig
After trying emscripten with C I was disappointed at the complexity involved to get something running.

With [zig](https://ziglang.org/) I was able to get a simple WASM component working in an afternoon. Wow!

And the performance has been amazing. Where Python was taking ~10 secs to generate histograms for 10,100,1000,1024,10000,20000,25000 and 30000 digits of pi - the zig cross-compiled wasm32 code is capable of performing the same thing plus 35000, 40000, 45000 and 50000 in less than 1 ms. Yep 1ms! Wow. The histograms are still generated at runtime. Via a separate WASM call per value of N digits of pi.

> zig also has a slice type in the language. So I just couldn't help myself referring to it as a slice_of_pi in the code. Tee hee hee. _See the histogram function in [pi-zig/src/histo.zig](./pi-zig/src/histo.zig)._

Note I changed the Python cache seed generation logic to produce pi_digits_seed.zig instead of pi_30000.py. _See the bottom of [piadapter/pi_digits.py](./piadapter/pi_digits.py)._

> Note I did some digging and saw that some of the individual coefficient values for the Gosper's series algorithm I settled on
> exceeds 4000 integer digits! WHOA. Python is the right choice for the language to perform that task.

The zig module exposes pi_digits via its WASM interface and that is called and passed into the Python based PiAdapter class during startup (via pyodide).

Did I mention with zig the startup time went from ~20 secs to ~2.5 secs. Most of what is left is the pyodide startup time.

The pyodide wasm file is 9**MB**! _That is fair if you think about it. It contains the almost complete Python 3.11 runtime plus
the [various libraries they have ported](https://pyodide.org/en/stable/usage/packages-in-pyodide.html) like attrs, numpy, pandas, etc.

Whereas the pi-zig.wasm file is ~52**KB**.
![pi-zig.wasm size](./pi-zig-wasm-size.png)

That is why zig seemed apealing.

However, zig is currently at 0.11.0. It is quite a young language. The tool chain is rather good. Which led to my quick success in getting something working quickly.

But there are many design warts in the language. I came to believe that it has more exceptions than English. How is that possible?

For example, a slice operation using some indexing values that just happen to be known at compile time results in not a slice, but a pointer to an array which cannot be used in the place of a slice.

The syntax looks exactly the same though. Uggh.

Getting started is easy. But as soon as you get past the tutorial stage the learning curve steepens exponentially. You'll find yourself relying on memorizing syntax patterns rather than being able to simply rely on intuition.

So I cannot recommend this language (yet) for anything serious.

### golang
![pi-tinygo.wasm size](./pi-tinygo-wasm-size.png)


### assemblyscript
![pi-as.wasm size](./pi-as-wasm-size.png)


### pytest customization

