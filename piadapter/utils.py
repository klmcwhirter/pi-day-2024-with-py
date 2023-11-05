from typing import Iterable


def batched(iterable: Iterable, n: int = 1):
    l = len(iterable)
    for ndx in range(0, l, n):
        yield iterable[ndx:min(ndx + n, l)]
