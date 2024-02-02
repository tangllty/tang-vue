#!/bin/sh

source $(dirname "$0")/update-version.sh

# Push the changes to the remote repository
git add package.json

git commit -m "v${NEW_VERSION}"
git tag -a "v${NEW_VERSION}" -m "v${NEW_VERSION}"

git push
git push --tags
