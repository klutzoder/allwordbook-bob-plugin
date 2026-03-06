#!/bin/bash

version=${1#refs/tags/v}

# Build the TypeScript source
bun run build

# Create the bobplugin package from dist/src
cd dist/src && zip -r ../../allwordbook-bob-plugin-v$version.bobplugin . && cd ../..

sha256_wordbook=$(sha256sum allwordbook-bob-plugin-v$version.bobplugin | cut -d ' ' -f 1)
echo $sha256_wordbook

download_link="https://github.com/klutzoder/allwordbook-bob-plugin/releases/download/v$version/allwordbook-bob-plugin-v$version.bobplugin"

new_version="{\"version\": \"$version\", \"desc\": \"https://github.com/klutzoder/allwordbook-bob-plugin/releases/tag/v$version\", \"sha256\": \"$sha256_wordbook\", \"url\": \"$download_link\", \"minBobVersion\": \"1.12.0\"}"

json_file='appcast.json'
json_data=$(cat $json_file)

updated_json=$(echo $json_data | jq --argjson new_version "$new_version" '.versions += [$new_version]')

echo $updated_json | jq . >$json_file

# Move the bobplugin to dist folder
mv allwordbook-bob-plugin-v$version.bobplugin dist/
