#!/bin/sh

# Into the root directory of the project
cd "$(dirname "$0")/.."

zip -r dist.zip dist/
