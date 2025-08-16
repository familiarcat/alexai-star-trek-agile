#!/bin/bash

# 🚀 **EXECUTE OPTIMIZATION**
# **Quick execution script for file structure optimization**

echo "🚀 Starting File Structure Optimization..."
echo "========================================"

# Make sure we're in the right directory
if [[ ! -f "package.json" ]] && [[ ! -d "src" ]]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Execute the master orchestrator
echo "🔄 Executing Master Optimization Orchestrator..."
./scripts/cleanup/master-optimization-orchestrator.sh

echo "✅ Optimization execution complete!"
echo "📋 Check the logs directory for detailed results"
