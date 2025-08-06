#!/usr/bin/env python3
"""
AlexAI Star Trek Agile System - Main Entry Point
Reorganized for junior developer accessibility
"""

import sys
import os
from pathlib import Path

# Add src directory to Python path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

# Import the main application
from src.core.app import app

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