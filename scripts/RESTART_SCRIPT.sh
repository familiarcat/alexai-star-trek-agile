#!/bin/bash

# 🚀 AlexAI Star Trek Agile System - Restart Script
# Modern Next.js 15 Application
# Run this script after restarting your computer

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="alexai_katra_transfer_package_remote_v7"
NEXTJS_DIR="alexai-nextjs-modern"
NEXTJS_PORT=3000
OLD_PORT=8000

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -ti:$1 >/dev/null 2>&1
}

# Function to kill processes on a port
kill_port() {
    if port_in_use $1; then
        log "Killing processes on port $1..."
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

echo "🚀 AlexAI Star Trek Agile System - Modern Next.js 15 Restart Script"
echo "=================================================================="

# Check if we're in the right directory
if [ ! -d "$NEXTJS_DIR" ]; then
    error "Next.js 15 directory not found. Please run this script from the project root."
fi

# Navigate to project directory
cd "$NEXTJS_DIR"

# Check Node.js installation
if ! command_exists node; then
    error "Node.js is not installed. Please install Node.js 18+ first."
fi

# Check npm installation
if ! command_exists npm; then
    error "npm is not installed. Please install npm first."
fi

# Display Node.js and npm versions
log "Node.js version: $(node --version)"
log "npm version: $(npm --version)"

# Kill any existing processes on ports
log "Cleaning up existing processes..."
kill_port $NEXTJS_PORT
kill_port $OLD_PORT

# Install dependencies
log "Installing dependencies..."
npm install

# Check if build is needed
if [ ! -d ".next" ]; then
    log "Building Next.js application..."
    npm run build
else
    log "Build directory exists, skipping build..."
fi

# Start the development server
log "Starting Next.js 15 development server..."
log "URL: http://localhost:$NEXTJS_PORT"
log "Press Ctrl+C to stop the server"

# Start the server
npm run dev 