#!/bin/sh

# Into the root directory of the project
cd "$(dirname "$0")/.." || exit

NEW_VERSION=$1

PATTERN="^[0-9]+\.[0-9]+\.[0-9]+$"

# Check the number is valid
if [[ ! $NEW_VERSION =~ $PATTERN ]]; then
	echo "Invalid version number: $NEW_VERSION. The version number should match the pattern: major.minor.patch (e.g. 1.0.0)"
	exit 1
fi

# Get the old version number from the package.json file
OLD_VERSION=$(sed -nE 's/.*"version": "(.*?)",/\1/p' package.json)

# Modify version number in the package.json file
sed -i "s/\(\"version\": \"\).*\(\",\)/\1$NEW_VERSION\2/" package.json

echo "Version number changed from ${OLD_VERSION} to ${NEW_VERSION} in package.json"
