#!/bin/bash

# Project Pruning Analysis Script
# This script analyzes the project structure and identifies what can be pruned

set -e

echo "🔍 Project Structure Analysis for Pruning"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}📊 Current Project Structure Analysis${NC}"
echo "=============================================="

# Count files by type
echo -e "\n${YELLOW}File Counts by Type:${NC}"
find . -type f | grep -E '\.(tsx?|js|json|md|sh|py)$' | sed 's/.*\.//' | sort | uniq -c | sort -nr

# Identify duplicate workflow directories
echo -e "\n${YELLOW}Duplicate/Conflicting Directories:${NC}"
if [ -d "workflows" ] && [ -d "sync-system/workflows" ]; then
    echo -e "${RED}❌ CONFLICT: Two workflow directories found${NC}"
    echo "   - workflows/ (used by bilateral sync)"
    echo "   - sync-system/workflows/ (used by Next.js API)"
    echo "   This is causing the JSON parsing confusion!"
fi

# Check for unused large files
echo -e "\n${YELLOW}Large Files (>100KB) that might be unused:${NC}"
find . -type f -size +100k -not -path "./node_modules/*" -not -path "./.git/*" | head -10

# Check for duplicate functionality
echo -e "\n${YELLOW}Potential Duplicate Functionality:${NC}"
if [ -d "bilateral-sync" ] && [ -d "sync-system" ]; then
    echo -e "${RED}❌ CONFLICT: Two sync systems${NC}"
    echo "   - bilateral-sync/ (Node.js based)"
    echo "   - sync-system/ (Next.js API based)"
fi

# Check for unused scripts
echo -e "\n${YELLOW}Script Analysis:${NC}"
echo "Total shell scripts: $(find scripts -name "*.sh" 2>/dev/null | wc -l)"
echo "Total Node.js scripts: $(find . -name "*.js" -not -path "./node_modules/*" | wc -l)"

# Check for unused documentation
echo -e "\n${YELLOW}Documentation Analysis:${NC}"
echo "Total markdown files: $(find . -name "*.md" | wc -l)"
echo "Knowledge base files: $(find alexai-knowledge-base -name "*.md" 2>/dev/null | wc -l)"

echo -e "\n${BLUE}🎯 Pruning Recommendations${NC}"
echo "================================"

echo -e "\n${RED}🚨 IMMEDIATE ACTIONS NEEDED:${NC}"
echo "1. Consolidate workflow directories into ONE location"
echo "2. Choose ONE sync system (bilateral-sync OR sync-system)"
echo "3. Remove duplicate workflow files"
echo "4. Clean up unused knowledge base files"

echo -e "\n${YELLOW}📁 Directory Consolidation Plan:${NC}"
echo "1. Keep: src/ (Next.js app)"
echo "2. Keep: scripts/ (essential deployment scripts)"
echo "3. Keep: docs/ (essential documentation)"
echo "4. Merge: workflows/ + sync-system/workflows/ → workflows/"
echo "5. Choose: bilateral-sync OR sync-system (not both)"
echo "6. Prune: alexai-knowledge-base/ (keep only essential files)"

echo -e "\n${GREEN}✨ Expected Benefits:${NC}"
echo "- Eliminate JSON parsing confusion"
echo "- Reduce file system complexity"
echo "- Faster build times"
echo "- Easier maintenance"
echo "- Clearer architecture"

echo -e "\n${BLUE}🔧 Next Steps:${NC}"
echo "1. Run this analysis to confirm findings"
echo "2. Execute pruning script to clean up structure"
echo "3. Test core functionality"
echo "4. Document new simplified structure"

echo -e "\n✨ Analysis complete! Run the pruning script next."
