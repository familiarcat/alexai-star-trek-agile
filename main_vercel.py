#!/usr/bin/env python3
"""
AlexAI Star Trek Agile System - Vercel Entry Point
Simplified version for Vercel deployment without SocketIO
"""

import os
import sys
from pathlib import Path

# Add app directory to Python path
app_path = Path(__file__).parent / "app"
sys.path.insert(0, str(app_path))

# Import the Vercel-compatible application
from core.app_vercel import app

# For Vercel deployment
if __name__ == "__main__":
    app.run() 