#!/usr/bin/env python3
"""
AlexAI Star Trek Agile System - Main Entry Point
Modern 2025 structure with consolidated deployment
"""

import os
import sys
from pathlib import Path

# Add app directory to Python path
app_path = Path(__file__).parent / "app"
sys.path.insert(0, str(app_path))

# Import the main application
from core.app import app

if __name__ == "__main__":
    # Set environment variables for development
    os.environ.setdefault('FLASK_ENV', 'development')
    os.environ.setdefault('FLASK_DEBUG', 'True')
    
    # Run the Flask application
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True
    )
