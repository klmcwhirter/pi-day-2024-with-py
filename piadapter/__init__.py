'''piadapter - pyodide Python component target from web app'''

import logging
import os
import sys
from dataclasses import dataclass

from piadapter.pi_digits import pi_digit_generator
from piadapter.utils import batched


@dataclass
class HistogramInterop:
    num_digits: int
    histogram: list[int]


logging.basicConfig(level=logging.DEBUG, format='PYTHON: {asctime} - {module} - {funcName} - {levelname} - {message}', style='{')


class PiAdapter:
    def __init__(self) -> None:
        self._cached_pi: list[int] = []

    def __repr__(self) -> str:
        return 'PiAdapter()'

    def _cache_pi_digits(self, num_digits: int):
        if len(self._cached_pi) < num_digits:
            self._cached_pi = [d for d in pi_digit_generator(num_digits)]

    def seed_pi_digits(self, pi_30000: list[int]):
        self._cached_pi = pi_30000

    def histograms_seed_cache(self, histograms: list[HistogramInterop]):
        logging.info('PiAdapter.histograms_seed_cache(...)')

        # seed the cache
        self.histograms = {hi.num_digits: hi.histogram for hi in histograms}

        from pprint import pformat
        logging.info(f'PiAdapter.histograms_seed_cache: histograms={pformat(self.histograms, width=132, sort_dicts=False)}')

    def histogram(self, num_digits: int) -> list[int]:
        rc: list[int] = self.histograms[num_digits] if num_digits in self.histograms else []
        return rc

    def pi_digits(self, num_digits: int, n: int) -> list[list[int]]:
        '''Return num_digits of PI batched n at a time'''
        logging.info(f'PiAdapter.pi_digits({num_digits}, {n})')
        self._cache_pi_digits(num_digits)

        # leverage the fact that pi_digit_generator is idempotent for some max num_digits value
        # the first num_digits of pi will be the same for any num_digits value up to and including num_digits
        return [da for da in batched([int(digit) for digit in self._cached_pi[:num_digits]], n)]

    def version(self):
        un = os.uname()

        return [
            f'Python Version: {sys.version}',
            f'Host Version: {un.sysname} {un.machine} {un.release}'
        ]


pia = PiAdapter()
