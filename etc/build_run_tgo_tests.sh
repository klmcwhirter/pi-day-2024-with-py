#!/bin/bash

TGO_BUILD=tinygo-build
TGO_TESTS=tinygo-tests

rm -f ${TGO_BUILD}.out ${TGO_TESTS}.out step.out

echo "tinygo tests not implemented yet" >${TGO_TESTS}.skipped

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0

function clean_up
{
    rc=$1
    filename=$2

    if [ $rc -ne 0 ]
    then
        mv step.out ${filename}.failed
    else
        mv step.out ${filename}.passed
    fi
}

set -o pipefail

if [ -z "$PI_DIGITS_FILE" -o ! -f "$PI_DIGITS_FILE" ]
then
    echo "PI_DIGITS_FILE cannot be empty and file must exist" | tee -a step.out

    clean_up 255 ${TGO_BUILD}
    echo "tinygo build failed" >${TGO_TESTS}.skipped
    exit 255
fi

cat $PI_DIGITS_FILE >>./histo.go
rm -f $PI_DIGITS_FILE

echo tinygo build -target wasm --no-debug -opt=z -scheduler none -o pi-tinygo.wasm ./histo.go
tinygo build -target wasm --no-debug -opt=z -scheduler none -o pi-tinygo.wasm ./histo.go 2>&1 | tee -a step.out
rc=$?
echo build rc=${rc}
if [ $rc -ne 0 ];then
    clean_up $rc ${TGO_BUILD}
    echo "tinygo build failed" >${TGO_TESTS}.skipped
    exit 0
else
    clean_up $rc ${TGO_BUILD}
fi
