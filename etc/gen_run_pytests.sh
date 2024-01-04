#!/bin/sh


if [ -z "$PI_DIGITS_FILE" ]
then
    echo "PI_DIGITS_FILE cannot be empty" | tee python-tests.failed
    exit 255
fi

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0

if [ "$ENABLE_TESTS" != "0" ]
then
    ENABLE_TESTS=$ENABLE_TESTS ./create_venv
    source .venv/bin/activate
fi

# Generate the pi digits cache module(s)
echo python -m piadapter.pi_digits $PI_DIGITS_FILE
python -m piadapter.pi_digits $PI_DIGITS_FILE
rm -fr piadapter/__pycache__/ 2>&1 >/dev/null

# Generate the pyodide module zip file
rm -f piadapter.zip
zip -r piadapter.zip piadapter/

echo "ENABLE_TESTS=$ENABLE_TESTS" >pytest.out

if [ "$ENABLE_TESTS" = "1" ]
then
    rm -f pytest.out
    set -o pipefail
    pytest 2>&1 | tee -a pytest.out
    rc=$?
    echo rc=${rc}

    if [ $rc -ne 0 ]
    then
        mv pytest.out python-tests.failed
        exit 0
    fi
    mv pytest.out python-tests.passed
else
    mv pytest.out python-tests.skipped
fi
