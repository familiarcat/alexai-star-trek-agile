#!/bin/bash
echo "🚀 Deploying AlexAI Agile Project Management System..."

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Initialize the Agile Project Manager
echo "🧠 Initializing Agile Project Manager..."
python agile_project_manager.py

# Start the web application
echo "🌐 Starting web application..."
echo "📊 Dashboard available at: http://localhost:5000"
echo "🤖 Multi-agent system: Picard, Troi, Spock, Data, Scott"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python app.py 