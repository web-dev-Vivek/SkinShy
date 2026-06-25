#!/bin/bash

# ──────────────────────────────────────────────────────────────
# Cleanup: kill background servers when script exits for any
# reason — Ctrl+C (SIGINT), kill (SIGTERM), or normal EXIT.
# BACKEND_PID / FRONTEND_PID are set further down after `npm start &`
# ──────────────────────────────────────────────────────────────
cleanup() {
  echo ""
  echo "⛔ Stopping Skinshy Servers..."
  kill "$BACKEND_PID"  2>/dev/null
  kill "$FRONTEND_PID" 2>/dev/null
  # Give processes up to 3 seconds to exit cleanly, then force-kill
  sleep 1
  kill -0 "$BACKEND_PID"  2>/dev/null && kill -9 "$BACKEND_PID"  2>/dev/null
  kill -0 "$FRONTEND_PID" 2>/dev/null && kill -9 "$FRONTEND_PID" 2>/dev/null
  echo "✅ All servers stopped. Ports 3000 & 5000 are now free."
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

echo "================================================"
echo "SKINSHY - APPLICATION STARTUP"
echo "================================================"
echo ""
echo "Prerequisites:"
echo "✓ MongoDB running on port 27017"
echo "✓ Node.js and npm installed"
echo ""

# Check if MongoDB is running
if ! mongosh --version &> /dev/null; then
    echo "⚠️  MongoDB might not be installed. Consider running: mongod"
fi

echo "Starting Backend (Port 5000)..."
cd Backend
npm start &
BACKEND_PID=$!

echo ""
echo "Waiting for backend to start..."
sleep 3

echo ""
echo "Starting Frontend (Port 3000)..."
cd ../Frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "================================================"
echo "✅ STARTUP COMPLETE"
echo "================================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Logs:"
echo "  Backend PID:  $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop: Press Ctrl+C"
echo ""

wait
