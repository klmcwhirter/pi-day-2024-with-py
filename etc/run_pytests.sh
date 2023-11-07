#!/bin/sh

if [ "$ENABLE_TESTS" = "1" ]
then
    echo "ENABLE_TESTS=$ENABLE_TESTS" >pythontests.passed
    ./create_venv
    source .venv/bin/activate
    pytest 2>&1 | tee pytest.out
    rc=$?
    [ $rc -ne 0 ] && exit 99
    cat pytest.out >>pythontests.passed
    rm pytest.out
else
    echo "ENABLE_TESTS=$ENABLE_TESTS" >pythontests.passed
fi
