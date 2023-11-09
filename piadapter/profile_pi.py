'''
intended to be executed with perf

$ sudo perf record --freq max --call-graph fp .venv/bin/python3.12 -X perf piadapter/profile_pi.py
$ sudo perf report --hierarchy
'''
from pi_digits import pi_digit_generator

digits = [d for d in pi_digit_generator(10_000)]

# print(f'len(digits)={len(digits)}')

# print(digits)
