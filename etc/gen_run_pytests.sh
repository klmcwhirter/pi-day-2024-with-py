#!/bin/sh

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0

./create_venv
source .venv/bin/activate

# Generate the pi digits cache module
python -m piadapter.pi_digits piadapter/pi_30000.py
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
        cat pytest.out >pythontests.failed
        exit 0
    fi
    cat pytest.out >pythontests.passed
fi
