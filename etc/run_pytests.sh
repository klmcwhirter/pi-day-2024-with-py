#!/bin/sh

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0
echo "ENABLE_TESTS=$ENABLE_TESTS" >pythontests.passed

if [ "$ENABLE_TESTS" = "1" ]
then
    ./create_venv
    source .venv/bin/activate
    rm -f pytest.out
    pytest 2>&1 | tee -a pytest.out
    rc=$?
    [ $rc -ne 0 ] && exit 99
    cat pytest.out >>pythontests.passed
fi
