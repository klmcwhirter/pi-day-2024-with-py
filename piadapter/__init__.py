'''main.py - pyodide component entry point'''

import logging
import os
import sys
from collections import defaultdict

from piadapter.pi_digits import pi_digit_generator
from piadapter.utils import batched

logging.basicConfig(level=logging.DEBUG, format='PYTHON: {asctime} - {module} - {funcName} - {levelname} - {message}', style='{')


class PiAdapter:
    def __init__(self) -> None:
        ...

    def __repr__(self) -> str:
        return 'PiAdapter()'

    def histogram(self, num_digits: int) -> list[int]:
        counter = defaultdict(int)
        for n in pi_digit_generator(num_digits):
            counter[n] += 1

        rc = [counter[k] for k in sorted(counter)]

        from pprint import pformat
        logging.info(f'PiAdapter.histogram({num_digits}: {pformat(rc)}')

        return rc

    def pi_digits(self, num_digits: int, n: int) -> list[list[int]]:
        '''Return num_digits of PI batched n at a time'''
        logging.info('PiAdapter.pi_digits(%d,%d)', num_digits, n)
        return [da for da in batched([int(digit) for digit in pi_digit_generator(num_digits)], n)]

    def version(self):
        un = os.uname()

        return [
            f'Python Version: {sys.version}',
            f'Host Version: {un.sysname} {un.machine} {un.release}'
        ]


pia = PiAdapter()
