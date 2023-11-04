'''main.py - pyodide component entry point'''

import sys

from piadapter.pi_digits import pi_digit_generator

NUM_DIGITS = 1024


class PiAdapter:
    def __init__(self) -> None:
        ...

    def __repr__(self) -> str:
        return 'PiAdapter()'

    def pi_digits(self):
        return [int(d) for d in pi_digit_generator(NUM_DIGITS)]

    def version(self):
        return f'Python Version: {sys.version}'


pia = PiAdapter()
