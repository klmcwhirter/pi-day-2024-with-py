# &pi; pi-day-2024-with-py

## Rabbit Holes Travelled ...

### zig

[zig](https://ziglang.org/) includes native support for wasm32 in its tool chain.

And the performance has been amazing. Where Python was taking ~20 secs to generate histograms for 10,100,1000,1024,10000,20000,25000 and 30000 digits of pi - the zig cross-compiled wasm32 code is capable of performing the same thing plus for 35000, 40000, 45000 and 50000 in less than 1 ms. Yep 1ms! Wow. The histograms are still generated at runtime. Via a separate WASM call per value of N digits of pi.

> zig also has a slice type in the language. So I just couldn't help myself referring to it as a slice_of_pi in the code. Tee hee hee. _See the histogram function in [pi-zig/src/histo.zig](./pi-zig/src/histo.zig)._

Note I changed the Python cache seed generation logic to produce pi_digits_seed.zig instead of pi_30000.py. _See the bottom of [piadapter/pi_digits.py](./piadapter/pi_digits.py)._

> Note I did some digging while profiling the Python code and saw that some of the individual coefficient values for the Gosper's series algorithm I settled on
> exceeds 4000 integer digits! WHOA. Python is the right choice for the language to perform that task.

The zig module exposes pi_digits via its WASM interface and that is called and passed into the Python based PiAdapter class during startup (via pyodide).

Did I mention with zig the startup time went from ~20 secs to ~2.5 secs. Most of what is left is the pyodide startup time.

The pyodide wasm file is 9**MB**! _That is fair if you think about it. It contains the almost complete Python 3.11 runtime plus
the [various libraries they have ported](https://pyodide.org/en/stable/usage/packages-in-pyodide.html) like attrs, numpy, pandas, etc.

Whereas the pi-zig.wasm file is ~52**KB**.
![pi-zig.wasm size](./pi-zig-wasm-size.png)

That is why zig seemed appealing.

However, zig is currently at 0.11.0. It is quite a young language. The tool chain is rather good. Which led to my quick success in getting something working quickly.

But there are many design warts in the language. I came to believe that it has more exceptions than English. How is that possible?

For example, a slice operation using some indexing values that just happen to be known at compile time results in not a slice, but a pointer to an array which cannot be used in the place of a slice.

The syntax looks exactly the same though. Uggh.

Getting started is easy. But as soon as you get past the tutorial stage the learning curve steepens exponentially. You'll find yourself relying on memorizing syntax patterns rather than being able to simply rely on intuition.

So I cannot recommend this language (yet) for anything serious. But please do keep an eye on it as things progress...

### golang
Using the official golang tool chain results in a HUGE wasm file and runtime interop. This is due to how tightly coupled things seem to be in the std library, glibc, etc. - even when targeting wasm.

The standard advice is to use tinygo instead - see https://github.com/golang/go/wiki/WebAssembly#reducing-the-size-of-wasm-files.

For this project's purposes the port to tinygo involved minimal changes. And resulted in a wasm file that was ~56 KB.

![pi-tinygo.wasm size](./pi-tinygo-wasm-size.png)

But the go language seems like a strange fit for a web application. And so on to the next option ...

### assemblyscript
With AssemblyScript I was also able to get my simple wasm component working in an afternoon. And the results were almost identical to my experience with zig and tinygo.

The performance characteristics were similar - only slightly different due to slight compilation optimization differences, and the size of the resulting wasm file was similar.

![pi-as.wasm size](./pi-as-wasm-size.png)


### pytest customization
While experimenting with profiling the Python code and algorithm used to calculate digits of pi, I discovered some neat extension points built in to the pytest testing framework for Python.

Some of my profiling test suites ran for many minutes. While I wanted them to remain available to be run on an ad hoc basis, I did not want them to slow down the CI/CD pipeline.

Enter pytest [Initialization Hooks](https://docs.pytest.org/en/stable/reference/reference.html#initialization-hooks).

In [conftest.py](../conftest.py) I wrote implementation of some of those hooks to register a `--run-slow` command line option for pytest and apply a skip filter to certain tests if they contain a `slow` mark. _See [piadapter/test_pi_digits.py](../piadapter/test_pi_digits.py)_

```python
pytest.param(50000, [5033, 5054, 4867, 4948, 5011, 5052, 5018, 4977, 5030, 5010], marks=[pytest.mark.slow]),
```

It even shows up when executing `pytest --help`.

```
usage: pytest [options] [file_or_dir] [file_or_dir] [...]
...
Custom options:
  --run-slow            run slow tests
...
```


### nixos and nix
[NixOS](https://nixos.org/) is a linux distro that is centered around the nix package manager. Its stated purpose is to provide:
Declarative Builds and Deployments.

I created a VM containing NixOS 23.11 and spent some time getting to know its unusual functional DSL for configuring a system. While it is intriguing for certain use cases, I do not see myself using it on a regular basis.

The nix package manager is interesting though. And there is work ongoing to allow using nix with a distro's repositories instead of nixpkgs.


### VS Code / Dev Containers and Docker
- [Get Started with Dev Containers in VS Code ](https://youtu.be/b1RavPr_878)
- [Customize Dev Containers in VS Code with Dockerfiles and Docker Compose](https://youtu.be/p9L7YFqHGk4)

Work has been done to allow for so called Dev Containers in VS Code. See the links above to learn more.

The gist of it is to define a set of configuration that allows the dev environment for a particular git repo to be recreated upon cloning the repo. This configuration is committed into the repo with the other repo artifacts.

> Note I said dev environment - not the production artifact.

Although I did not take the time to set it up in this repo, I do see how Dev Containers could be useful for sharing the repeatable configuring of a dev environment across a team of developers.

Very nice.
