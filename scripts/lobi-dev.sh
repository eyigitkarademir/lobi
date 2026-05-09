#!/bin/bash
# Lobi dev server — auto-recovering, runs on port 3010 (avoids Caki's 3003).
# Health-checks every 30s. If 500, kills and restarts.
PORT=3010
PID_FILE=".dev-server.pid"

cleanup() {
  echo "[lobi-dev] Shutting down..."
  kill $SERVER_PID 2>/dev/null
  wait $SERVER_PID 2>/dev/null
  rm -f "$PID_FILE"
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

if [ -f "$PID_FILE" ]; then
  OLD_PID=$(cat "$PID_FILE")
  if kill -0 "$OLD_PID" 2>/dev/null; then
    echo "[lobi-dev] Already running (PID $OLD_PID). Kill it first: kill $OLD_PID"
    exit 1
  fi
  rm -f "$PID_FILE"
fi
echo $$ > "$PID_FILE"

lsof -ti :$PORT | xargs kill -9 2>/dev/null
sleep 1

start_server() {
  rm -rf .next
  echo "[lobi-dev] Starting on port $PORT..."
  ./node_modules/.bin/next dev --port "$PORT" &
  SERVER_PID=$!
  sleep 5
}

start_server

while true; do
  sleep 30
  if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "[lobi-dev] Process died. Restarting..."
    start_server
    continue
  fi
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" 2>/dev/null)
  if [ "$HTTP_CODE" = "500" ]; then
    echo "[lobi-dev] Health check failed (500). Restarting..."
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
    start_server
  fi
done
