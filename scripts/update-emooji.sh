#!/bin/bash

set -e

if [ ! -d '.git' ]; then
    echo 'Script is not run at root of repository' 1>&2
    exit 1
fi

curl -L "https://api.github.com/emojis" >src/emoji.json

for url in $(cat src/emoji.json | jq .[]); do
    url=${url%\"}
    url=${url#\"}
    file=${url}
    file=${file%\?*}
    file=${file##*/}
    path="images/${file}"
    echo "$url -> $path"
    curl -L -s "${url}" >"$path"
done
