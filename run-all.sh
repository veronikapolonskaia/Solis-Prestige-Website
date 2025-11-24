#!/usr/bin/env bash
set -euo pipefail

# Root of repo
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# Default ports (override via env)
ADMIN_PORT="${ADMIN_PORT:-3000}"
API_PORT="${API_PORT:-5000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

LOG_DIR="$ROOT_DIR/.logs"
mkdir -p "$LOG_DIR"

echo "Using ports -> admin-dashboard:$ADMIN_PORT, server:$API_PORT, travel-frontend:$FRONTEND_PORT"

ensure_node_runtime() {
  if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    return
  fi

  NODE_VERSION="${NODE_VERSION:-20.17.0}"
  ARCH="$(uname -m)"
  case "$ARCH" in
    x86_64) NODE_ARCH="x64" ;;
    aarch64 | arm64) NODE_ARCH="arm64" ;;
    *) echo "Unsupported architecture: $ARCH. Please install Node.js manually."; exit 1 ;;
  esac

  NODE_DIR="$ROOT_DIR/.node-runtime/node-v$NODE_VERSION"
  NODE_BIN="$NODE_DIR/bin/node"

  if [[ ! -x "$NODE_BIN" ]]; then
    echo "Node.js not found. Downloading Node v$NODE_VERSION ($NODE_ARCH)..."
    mkdir -p "$NODE_DIR"
    TARBALL="node-v$NODE_VERSION-linux-$NODE_ARCH.tar.xz"
    TMP_FILE="$(mktemp)"
    curl -fsSL "https://nodejs.org/dist/v$NODE_VERSION/$TARBALL" -o "$TMP_FILE"
    tar -xJf "$TMP_FILE" -C "$NODE_DIR" --strip-components=1
    rm -f "$TMP_FILE"
    echo "Node.js downloaded to $NODE_DIR."
  fi

  export PATH="$NODE_DIR/bin:$PATH"
}

ensure_node_runtime

kill_on_port() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    local pids
    pids=$(lsof -ti ":$port" || true)
    if [[ -n "${pids}" ]]; then
      echo "Killing processes on port $port: ${pids}"
      kill -9 ${pids} || true
      sleep 0.5
    fi
  fi
}

echo "Ensuring single instances (freeing ports if needed) ..."
kill_on_port "$ADMIN_PORT"
kill_on_port "$API_PORT"
kill_on_port "$FRONTEND_PORT"

# PIDs array for cleanup
PIDS=()

cleanup() {
  echo "\nStopping all services ..."
  for pid in "${PIDS[@]:-}"; do
    if ps -p "$pid" >/dev/null 2>&1; then
      kill "$pid" 2>/dev/null || true
    fi
  done
  wait || true
  echo "All services stopped."
}
trap cleanup EXIT INT TERM

run_migrations() {
  echo "Applying database migrations..."
  MIGRATION_SCRIPT="$ROOT_DIR/server/scripts/runMigrations.js"
  if [[ -f "$MIGRATION_SCRIPT" ]]; then
    node "$MIGRATION_SCRIPT" || {
      echo "⚠️  Migration script failed. Continuing without automatic migrations."
    }
  else
    echo "⚠️  Migration script not found at $MIGRATION_SCRIPT"
    echo "    Skipping automatic migrations. Please ensure migrations run separately."
  fi
}

start_server() {
  echo "Starting API server on :$API_PORT ..."
  (
    cd "$ROOT_DIR/server"
    PORT="$API_PORT" npm run dev
  ) >>"$LOG_DIR/server.log" 2>&1 &
  PIDS+=("$!")
  echo "server pid: $! (logs: $LOG_DIR/server.log)"
}

start_admin() {
  echo "Starting admin-dashboard on :$ADMIN_PORT ..."
  (
    cd "$ROOT_DIR/admin-dashboard"
    BROWSER=none PORT="$ADMIN_PORT" npm start
  ) >>"$LOG_DIR/admin-dashboard.log" 2>&1 &
  PIDS+=("$!")
  echo "admin-dashboard pid: $! (logs: $LOG_DIR/admin-dashboard.log)"
}

start_frontend() {
  echo "Starting travel-frontend (Vite) on :$FRONTEND_PORT ..."
  (
    cd "$ROOT_DIR/travel-frontend"
    npm run dev -- --host --port "$FRONTEND_PORT"
  ) >>"$LOG_DIR/travel-frontend.log" 2>&1 &
  PIDS+=("$!")
  echo "travel-frontend pid: $! (logs: $LOG_DIR/travel-frontend.log)"
}

run_migrations
start_server
start_admin
start_frontend

echo "\nAll services launched:"
echo "  API           -> http://localhost:$API_PORT"
echo "  Admin         -> http://localhost:$ADMIN_PORT"
echo "  Travel FE     -> http://localhost:$FRONTEND_PORT"
echo "\nTailing logs (Ctrl+C to stop services): $LOG_DIR/*.log\n"

# Tail logs in background; if tail exits, don't kill services automatically
tail -n +1 -f "$LOG_DIR"/*.log || true

# Wait for children if tail not used
wait || true


