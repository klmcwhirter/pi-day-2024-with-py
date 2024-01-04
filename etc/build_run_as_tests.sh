#!/bin/sh

AS_BUILD=as-build
AS_TESTS=as-tests

rm -f ${AS_BUILD}.out ${AS_TESTS}.out step.out

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

    clean_up 255 ${AS_BUILD}
    echo "asbuild failed" >${AS_TESTS}.skipped
    exit 255
fi

npm install
rm -fr ./build

echo npm run asbuild:release 2>&1 | tee -a step.out
npm run asbuild:release 2>&1 | tee -a step.out
rc=$?
echo build rc=${rc}
if [ $rc -ne 0 ];then
    clean_up $rc ${AS_BUILD}
    echo "asbuild failed" >${AS_TESTS}.skipped
    exit ${rc}
else
    clean_up $rc ${AS_BUILD}
fi

echo "ENABLE_TESTS=$ENABLE_TESTS" | tee -a step.out
if [ "$ENABLE_TESTS" = "1" ]
then
    echo npm test 2>&1 | tee -a step.out
    npm test 2>&1 | tee -a step.out
    rc=$?
    echo test rc=${rc}
    clean_up $rc ${AS_TESTS}
    exit ${rc}
else
    mv step.out ${AS_TESTS}.skipped
fi
