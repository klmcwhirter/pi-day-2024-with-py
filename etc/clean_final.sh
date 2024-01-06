#!/bin/sh

# Clean up final image by deleting stuff not needed at runtime.

rm -fr .containerignore
rm -fr Containerfile*
rm -fr conftest.py
rm -fr create_venv
rm -fr pigen/
rm -fr prettier.config.cjs
rm -fr pyproject.toml
rm -fr requirements.*
