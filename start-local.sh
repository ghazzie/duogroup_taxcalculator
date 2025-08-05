#!/bin/bash

# Local development startup script
echo "Starting DuoTax Calculator locally..."

# Check if node_modules exists in backend
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check if node_modules exists in frontend
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Start backend in background
echo "Starting backend on port 5001..."
cd backend && PORT=5001 npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend on port 3015..."
cd frontend && npm run dev

# When frontend exits, kill backend
kill $BACKEND_PID 2>/dev/null

echo "Stopped all services."