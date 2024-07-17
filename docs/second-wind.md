# &pi; pi-day-2024-with-py

# Second Wind ...

Around June of 2024, long after pi day, I decided to check in to see what had changed in the Web Assembly ecosystem. Wow!

Some things were predictable.
* Progress on package repositories - e.g., [wasmer.io registry](https://wasmer.io/products/registry) and [warg](https://github.com/bytecodealliance/registry)
* ... and composition - e.g., [wac](https://github.com/bytecodealliance/wac) and [spin from fermyon moves to fully open planning](https://www.fermyon.com/blog/moving-to-a-fully-open-planning-process-for-the-spin-project)
* etc. - there were several previews we learned about late last year
...

## WASM I/O 2024

But, then we learned more at WASM I/O 2024:
* [WASI 0.2](https://github.com/WebAssembly/WASI/blob/main/preview2/README.md) was announced
* [Component Composition using warg](https://youtu.be/2_-10mRN30s) was demoed - WHOA!
* [Compiling Python to Native Wasm](https://youtu.be/_Gq273qvNMg) using [wasmer.io py2wasm](https://wasmer.io/posts/py2wasm-a-python-to-wasm-compiler) - a little easier to use than pyodide, but still produces large wasm files & requires Python 3.11 (not 3.12+)
* [Deconstructing WebAssembly Components](https://youtu.be/zqfF7Ssa2QI) demoes the diff between _core modules_ and composable modules with share-nothing vs share-everything architecture via an introduction to Component Model as well as introduction to type lowering and lifting
* [extism 1.0](https://youtu.be/ChZpveTipPU) - higher level framework that helps tie all the specs together to improve DX
* [Paint by Numbers: High Performance Drawing in Wasm](https://youtu.be/CkV-nWFXvbs) showed some improvements coming to wasi-webgpu
* This blew my mind! [WANIX: A WebAssembly Operating and Development Environment](https://youtu.be/cj8FvNM14T4) that introduced a project that is really stretching the boundaries of what can be done with the component model and WASI
* [The Smallest Thing That Could Possibly Work](https://youtu.be/24NDl27mZu4) - demoed using wasm to control a DJI drone!
* [Design Systems in Wasm: One year on the bumpy road to the component model](https://youtu.be/i9WYjoTPrHo) shows some of what is coming in the next 12 months
* and so much more ...

## CNCF - Cloud Native Wasm Day EU 2024
* [YouTube playlist](https://www.youtube.com/playlist?list=PLj6h78yzYM2MQteKoXxICTWiUdZYEw6RI)
* [Avoiding vendor lock in](https://youtu.be/vCwXSedT674)

## What Now?
With over 30 sessions published, what should I focus on next?

I am not really interested in ...
* server-side compute usage of wasm yet - perhaps next time
* registry usage - they need to mature
* composition - yet - the componmemt model spec is intriguing, but too green

I did do a quick experiment with `py2wasm` on [pi_digits.py](../piadapter/pi_digits.py) and will complete it with some rough perf measurement. Initial test shows 10_000 digits of pi generated in ~1.6 secs. pi_digits.wasm is about 26MB. Interesting. But more work is needed.

As more runners adopt WASI 0.2 (threads, network, etc.) support, I would like to build something more real world. We will see.

For example, wasmer has support for a lot of extensions, but I do not believe they are implementing WASI 0.2/0.3; but rather their own WASIX extension set.

Also, I want to spend some more time with [assemblyscript](https://github.com/AssemblyScript/assemblyscript).

### Runners I am Watching

Runner|Comments
------|--------
[wasmtime](https://github.com/bytecodealliance/wasmtime)|The Byte Code Alliance runner written in Rust; uses the Cranelift code generator
[wasmer](https://github.com/wasmerio/wasmer)|Written in Rust; no spec version mentioned but says implements WASIX, WASI and emscripten; supports the Single Pass, Cranelift and LLVM pluggable compilers
[wazero](https://github.com/tetratelabs/wazero)|This is the runner of choice for most of the golang community. The main branch indicates support for WASM Core V1 and V2 specs; WASI preview 1

### Code Generators or Compilers

The different runners use different terminology to describe how wasm generation occurs.

**Wasmtime** uses the term `code generator`. And suggests it is currently implemented using the [Cranelift code generator](https://github.com/bytecodealliance/wasmtime?tab=readme-ov-file#features).

**Wasmer** uses the terms `native backend` in some places; and `compiler` in others. Wasmer documents their [pluggable compilers](https://wasmerio.github.io/wasmer/crates/doc/wasmer/#overview-of-the-features) as follows.

> **Pluggable compilers** — A compiler is used by the engine to transform WebAssembly into executable code:
> 
>  - wasmer-compiler-**singlepass** provides a fast compilation-time but an unoptimized runtime speed,
>  - wasmer-compiler-**cranelift** provides the right balance between compilation-time and runtime performance, useful for development,
>  - wasmer-compiler-**llvm** provides a deeply optimized executable code with the fastest runtime speed, ideal for production.

**Wazero** supports a wasm interpreter as well as AOT compilation via its so-called _zero dependency_ [optimizing compiler](https://wazero.io/docs/how_the_optimizing_compiler_works/).


## References
* [WASM I/O 2024](https://www.youtube.com/playlist?list=PLP3xGl7Eb-4Nmj4CJ5WLQZx5UAYvhH920)

