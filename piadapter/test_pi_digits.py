
import timeit

import pytest

from conftest import TimeoutException, time_limit
from piadapter import PiAdapter
from piadapter.pi_digits import pi_digit_generator

MAX_SECS = 10

__adapter = PiAdapter()


@pytest.fixture
def adapter() -> PiAdapter:
    return __adapter


def test_pi_digit_generator_first_10():
    expected = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
    rc = [d for d in pi_digit_generator(num_digits=10)]

    assert expected == rc


@pytest.mark.parametrize(
    ['n', 'expected'],
    [
        pytest.param(
            100000,  # times out
            [9999, 10137, 9908, 10026, 9971, 10026, 10028, 10025, 9978, 9902],
            marks=[pytest.mark.slow, pytest.mark.skip(reason=f'times out at MAX_SECS={MAX_SECS}')]),
        pytest.param(50000, [], marks=[
                     pytest.mark.slow, pytest.mark.skip(reason=f'times out at MAX_SECS={MAX_SECS}')]),
        pytest.param(25000, [2476, 2519, 2403, 2492, 2549, 2567, 2541, 2479, 2465, 2509], marks=[pytest.mark.slow]),
        pytest.param(20000, [1954, 1997, 1986, 1987, 2043, 2082, 2017, 1953, 1961, 2020], marks=[pytest.mark.slow]),
        pytest.param(10000, [968, 1026, 1021, 975, 1012, 1046, 1021, 970, 947, 1014], marks=[pytest.mark.slow]),
        [1024, [96, 117, 106, 105, 94, 101, 96, 97, 105, 107]],
        [1000, [93, 116, 103, 103, 93, 97, 94, 95, 101, 105]],
        [100, [8, 8, 12, 12, 10, 8, 9, 8, 12, 13]],
        [10, [0, 2, 1, 2, 1, 2, 1, 0, 0, 1]],
    ]
)
def test_histogram_n_digits(adapter: PiAdapter, n: int, expected: list[int]):
    try:
        with time_limit(MAX_SECS):
            rc = adapter.histogram(n)
    except TimeoutException as e:
        pytest.fail(f'adapter.histogram(num_digits={n}) timed out at MAX_SECS={MAX_SECS} seconds', pytrace=False)

    assert expected == rc


collected: dict[int, list[int]] = {}


def collect_histogram_for_n_digits(n: int):
    adapter = PiAdapter()
    rc = adapter.histogram(n)
    collected[n] = rc
    return rc


@pytest.mark.slow
def test_histogram_perf():
    '''Time the execution for succeeding larger orders of magnitude (10^n) and stop when larger than 10 secs'''
    print(f'\nRunning with MAX_SECS={MAX_SECS}')

    expected_secs = {
        10: 0.001,
        100: 0.003,
        1000: 0.125,
        1024: 0.128,
        10000: 1.737,
    }

    done = False
    n = 10
    while not done:
        stmt = f'collect_histogram_for_n_digits({n})'
        print(f'Executing {stmt}')

        secs = 0
        try:
            with time_limit(MAX_SECS):
                secs = timeit.timeit(stmt=stmt, number=1, globals=globals())
        except TimeoutException as e:
            print(f'n={n} timed out')
            break

        print(f'n={n} ran in {secs: .4F} secs, expected_secs={expected_secs[n]}')

        assert expected_secs[n] >= secs

        if n == 1000:
            n = 1024
        elif n == 1024:
            n = 10_000
        else:
            n = n * 10  # increase order of magnitude

    for n, histogram in collected.items():
        max_n = histogram.index(max(histogram))
        min_n = histogram.index(min(histogram))
        print(f'{n}: min={min_n}, max={max_n}, histogram={histogram}')
