#!/bin/sh

# copy correct loader in place
if [ -z "$WASM_LANG" ]
then
    echo "WASM_LANG cannot be empty!"
    exit 255
fi

echo cp src/pi/histo.${WASM_LANG}.loader.js src/pi/histo.loader.js
cp src/pi/histo.${WASM_LANG}.loader.js src/pi/histo.loader.js

# Clean up final image by deleting stuff not needed at runtime.

rm -fr .containerignore
rm -fr .dockerignore
rm -fr Containerfile*
rm -fr conftest.py
rm -fr create_venv
rm -fr pi-as/
rm -fr pi-tinygo/
rm -fr pi-zig/
rm -fr piadapter/
rm -fr prettier.config.cjs
rm -fr pyproject.toml
rm -fr requirements.*
