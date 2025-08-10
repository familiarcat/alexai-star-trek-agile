#!/bin/bash

# 🚀 Quick Start Script for Ship Computer Testing
# Run this to start testing the Ship Computer with all multimodal agents

set -e

echo "🚀 STARTING SHIP COMPUTER TESTING"
echo "================================="
echo ""

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: Please run this script from the project root"
    exit 1
fi

# Start the Next.js development server
echo "🌐 Starting Next.js development server..."
echo "   This will start the Ship Computer UI at http://localhost:3000"
echo ""

# Start the server in the background
npm run dev &
DEV_PID=$!

echo "✅ Development server started (PID: $DEV_PID)"
echo ""

# Wait a moment for the server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running at http://localhost:3000"
    echo ""
    echo "🎯 Ship Computer UI is ready for testing!"
    echo ""
    echo "📋 Available test endpoints:"
    echo "   • Main UI: http://localhost:3000"
    echo "   • Workflow Management: http://localhost:3000/workflow-management"
    echo "   • Observation Lounge: http://localhost:3000/observation-lounge"
    echo ""
    echo "🧪 Run tests with:"
    echo "   • ./scripts/test/test-ship-computer-multimodal.sh"
    echo "   • ./scripts/test/test-enhanced-ship-agency.sh"
    echo ""
    echo "🔄 To stop the server, run: kill $DEV_PID"
    echo ""
    echo "🖖 Live long and prosper! The Ship Computer awaits your commands!"
    echo ""
    
    # Keep the script running
    wait $DEV_PID
else
    echo "❌ Server failed to start"
    kill $DEV_PID 2>/dev/null || true
    exit 1
fi
