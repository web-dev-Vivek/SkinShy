#!/bin/bash

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
