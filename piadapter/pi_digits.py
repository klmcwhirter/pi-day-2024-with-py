'''Digits of PI algorithm

Run the algorithm below using CPython, Cython, PyPy and Numba and compare 
their performance. (This is implementing a spigot algorithm by A. Sale, 
D. Saada, S. Rabinowitz, mentioned on

http://mail.python.org/pipermail/edu-sig/2012-December/010721.html).
'''

from typing import Generator


def pi_digit_generator(num_digits: int) -> Generator[int, None, None]:
    '''Generate num_digits digits of Pi'''
    k, a, b, a1, b1 = 2, 4, 1, 12, 4
    while num_digits > 0:
        p, q, k = k * k, 2 * k + 1, k + 1
        a, b, a1, b1 = a1, b1, p*a + q*a1, p*b + q*b1
        d, d1 = a/b, a1/b1
        while d == d1 and num_digits > 0:
            yield int(d)
            num_digits -= 1
            a, a1 = 10*(a % b), 10*(a1 % b1)
            d, d1 = a/b, a1/b1
