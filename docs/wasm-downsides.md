# &pi; pi-day-2024-with-py

## Downsides of Python WASM in browser ...

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

Then I just arrange for all the histograms to be calculated in descending order during that dreaded loading phase. But it is now ~10 secs instead of >70 secs!

### Downsides - Build / Deployment

I could not get pyodide to fully coexist with my vite build system. I suspect, primarily, because of all of the dependencies pyodide loads dynamically at runtime. I did see mentions of different groups of people working on that. But the main focus right now is HTML with vanilla JS. And I think that is smart. _Get the core working first._ I am sure that guiding principle is part of the reason why I was able to get this working in such short order.

Also, even though I am targeting the browser execution model, it seems to drag in nodejs modules for various things during the build process. _Huh?_

I spent a few hours looking for low hanging fruit but then decided to just use vite's built in dev server instead.

The time needed to solve the CI/CD problem set is just not worth it for this silly little experiment of mine.

Maybe in a year or two I will revisit it. Who knows. By then pyodide should be much more mature and stable.

And more importantly, maybe someone else will have solved it for me.