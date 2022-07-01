#!/usr/bin/env zsh

# HTML_FILE_PATH='.svelte-kit/output/prerendered'
HTML_FILE_PATH='./dist'

pnpm html-minifier-terser \
    --collapse-whitespace \
    --remove-comments \
    --file-ext='html' \
    --input-dir=$HTML_FILE_PATH \
    --output-dir=$HTML_FILE_PATH
