#!/usr/bin/env bash

APP=${1%\/}
PROFILE=${2:---debug}

ROOT_DIR="$PWD"

SRC_DIR="$ROOT_DIR/src_for_wasm/$APP"
OUT_DIR="$ROOT_DIR/wasm/$APP"

cd "$SRC_DIR"
wasm-pack build "$PROFILE" --target web --out-name wasm --out-dir "$OUT_DIR/"
