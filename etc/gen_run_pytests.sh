#!/bin/sh

touch step.out

if [ -z "$PI_DIGITS_FILE" ]
then
    echo "PI_DIGITS_FILE cannot be empty" | tee python-tests.failed
    exit 255
else
    d=$(dirname $PI_DIGITS_FILE)
    echo mkdir -p $d 2>&1 | tee -a step.out
    mkdir -p $d 2>&1 | tee -a step.out
fi

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0

if [ "$ENABLE_TESTS" != "0" ]
then
    ENABLE_TESTS=$ENABLE_TESTS ./create_venv
    source .venv/bin/activate
fi

# Generate the pi digits cache module(s)
echo python -m piadapter.pi_digits $PI_DIGITS_FILE 2>&1 | tee -a step.out
python -m piadapter.pi_digits $PI_DIGITS_FILE 2>&1 | tee -a step.out
rm -fr piadapter/__pycache__/ 2>&1 >/dev/null

# Generate the pyodide module zip file
rm -f piadapter.tgz
tar czvf piadapter.tgz piadapter/


echo "ENABLE_TESTS=$ENABLE_TESTS"  | tee -a step.out

if [ "$ENABLE_TESTS" = "1" ]
then
    set -o pipefail
    pytest 2>&1 | tee -a step.out
    rc=$?
    echo rc=${rc}

    if [ $rc -ne 0 ]
    then
        mv step.out python-tests.failed
        exit 0
    fi
    mv step.out python-tests.passed
else
    mv step.out python-tests.skipped
fi
