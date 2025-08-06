#!/bin/bash
echo "🚀 Starting AlexAI Agile Project Management System on port 8000..."

# Activate virtual environment
source .venv/bin/activate

# Start Flask app on port 8000
python -c "
from app import app, socketio
import os
print('🚀 AlexAI Agile Project Management System')
print('🤖 Multi-agent system: Picard, Troi, Spock, Data, Scott')
print('🌐 Web interface available at: http://localhost:8000')
print('📊 Dashboard: http://localhost:8000')
print('')
print('Press Ctrl+C to stop the server')
print('')
socketio.run(app, debug=True, host='0.0.0.0', port=8000)
" 