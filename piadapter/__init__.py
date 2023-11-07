'''piadapter - pyodide Python component target from web app'''

import logging
import os
import sys
from functools import cache, partial

from piadapter.pi_digits import pi_digit_generator
from piadapter.utils import batched

logging.basicConfig(level=logging.DEBUG, format='PYTHON: {asctime} - {module} - {funcName} - {levelname} - {message}', style='{')


class PiAdapter:
    def __init__(self) -> None:
        self._cached_pi: list[int] = []

    def __repr__(self) -> str:
        return 'PiAdapter()'

    def _cache_pi_digits(self, num_digits: int):
        if len(self._cached_pi) < num_digits:
            self._cached_pi = [d for d in pi_digit_generator(num_digits)]

    @cache
    def histogram(self, num_digits: int) -> list[int]:
        def compare(v1: int, v2: int):
            return v1 == v2

        self._cache_pi_digits(num_digits)

        counter = {}

        digits = [n for n in self._cached_pi[:num_digits]]

        for d in range(10):
            compare_d = partial(compare, v2=d)
            counter[d] = len([v for v in filter(compare_d, digits)])

        rc = [counter[k] for k in range(10)]

        from pprint import pformat
        logging.info(f'PiAdapter.histogram({num_digits}): {pformat(rc)}')

        return rc

    def pi_digits(self, num_digits: int, n: int) -> list[list[int]]:
        '''Return num_digits of PI batched n at a time'''
        logging.info(f'PiAdapter.pi_digits({num_digits}, {n})')
        self._cache_pi_digits(num_digits)

        return [da for da in batched([int(digit) for digit in self._cached_pi[:num_digits]], n)]

    def version(self):
        un = os.uname()

        return [
            f'Python Version: {sys.version}',
            f'Host Version: {un.sysname} {un.machine} {un.release}'
        ]


pia = PiAdapter()
