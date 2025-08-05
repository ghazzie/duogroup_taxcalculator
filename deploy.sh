#!/bin/bash

# Build and Deploy Script for Tax Depreciation Calculator

echo "🚀 Starting deployment process..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Build and run with Docker Compose
echo "📦 Building Docker containers..."
docker-compose down
docker-compose build

echo "🔧 Starting services..."
docker-compose up -d

# Check if services are running
sleep 5
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running at http://localhost:5000"
else
    echo "❌ Backend failed to start"
    docker-compose logs backend
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running at http://localhost:3000"
else
    echo "❌ Frontend failed to start"
    docker-compose logs frontend
fi

echo "🎉 Deployment complete!"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
