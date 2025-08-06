#!/bin/bash

# Function to find an available port
find_available_port() {
    local port=8000
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do
        echo "Port $port is in use, trying next port..."
        port=$((port + 1))
    done
    echo $port
}

# Find available port
PORT=$(find_available_port)
echo "🚀 Starting AlexAI Agile Project Management System on port $PORT..."

# Activate virtual environment
source .venv/bin/activate

# Start Flask app on available port
python -c "
from app import app, socketio
import os
print('🚀 AlexAI Agile Project Management System')
print('🤖 Multi-agent system: Picard, Troi, Spock, Data, Scott')
print('🌐 Web interface available at: http://localhost:$PORT')
print('📊 Dashboard: http://localhost:$PORT')
print('')
print('Press Ctrl+C to stop the server')
print('')
socketio.run(app, debug=True, host='0.0.0.0', port=$PORT)
" 