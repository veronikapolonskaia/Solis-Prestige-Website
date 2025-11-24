#!/usr/bin/env bash
set -euo pipefail

# Ensure we always execute from repo root
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# Delegate to the existing launcher
exec "$ROOT_DIR/run-all.sh"

