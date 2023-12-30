#!/bin/sh

# Clean up final image by deleting stuff not needed at runtime.

rm -fr .containerignore
rm -fr .gitignore
rm -fr Containerfile*
rm -fr conftest.py
rm -fr create_venv
rm -fr package-lock.json
rm -fr pi-zig/
rm -fr piadapter/
rm -fr prettier.config.cjs
rm -fr pyproject.toml
rm -fr requirements.*
