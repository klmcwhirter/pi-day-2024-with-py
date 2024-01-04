'''Digits of PI algorithm'''

import logging
from typing import Generator

from .utils import pi_digits_writer_from_ext


def pi_digit_generator(num_digits: int) -> Generator[int, None, None]:
    '''
    This algorithm is based on an unproven conjecture but successfully produces at least the first 1 million digits.
    Read more about it here: https://www.gavalas.dev/blog/spigot-algorithms-for-pi-in-python/

    And here - Gosper's series: https://www.gavalas.dev/blog/spigot-algorithms-for-pi-in-python/#the-open-problem
    '''
    logging.info(f'pi_digit_generator(num_digits={num_digits})')

    q, r, t, i = 1, 180, 60, 2
    while num_digits > 0:
        u, y = 3*(3*i+1)*(3*i+2), (q*(27*i-12)+5*r)//(5*t)
        yield y
        q, r, t, i = 10*q*i*(2*i-1), 10*u*(q*(5*i-2)+r-y*t), t*u, i+1
        num_digits -= 1

# region

# def pi_digit_generator_orig(num_digits: int) -> Generator[int, None, None]:
#     '''Generate num_digits digits of Pi

#         Run the algorithm below using CPython, Cython, PyPy and Numba and compare
#         their performance. (This is implementing a spigot algorithm by A. Sale,
#         D. Saada, S. Rabinowitz, mentioned on

#         http://mail.python.org/pipermail/edu-sig/2012-December/010721.html).
#     '''
#     logging.info(f'pi_digit_generator(num_digits={num_digits})')

#     k, a, b, a1, b1 = 2, 4, 1, 12, 4
#     while num_digits > 0:
#         p, q, k = k * k, 2 * k + 1, k + 1
#         a, b, a1, b1 = a1, b1, p*a + q*a1, p*b + q*b1
#         d, d1 = a/b, a1/b1
#         while d == d1 and num_digits > 0:
#             yield int(d)
#             num_digits -= 1
#             a, a1 = 10*(a % b), 10*(a1 % b1)
#             d, d1 = a/b, a1/b1

# endregion


if __name__ == '__main__':
    import sys

    if len(sys.argv) < 2:
        print('Usage: python -m piadapter.pi_digits filename.ext\nwhere ext is one of go, py, zig')
        sys.exit(1)

    logging.info('Start generating 50_000 digits of pi ...')
    digits = [d for d in pi_digit_generator(50_000)]
    logging.info('Done generating 50_000 digits of pi')

    logging.info(f'Start writing to {sys.argv[1]}...')

    writer = pi_digits_writer_from_ext(sys.argv[1])

    with open(sys.argv[1], 'w') as f:
        writer(f, digits)

    logging.info(f'Done writing to {sys.argv[1]}.')
