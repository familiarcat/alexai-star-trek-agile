#!/bin/bash

# Workflow JSON Validation Script
# Identifies and reports JSON syntax errors in workflow files

set -e

echo "🔍 Validating Workflow JSON Files..."
echo "======================================"

WORKFLOWS_DIR="workflows"
ERROR_COUNT=0
TOTAL_FILES=0
VALID_FILES=0

# Check if workflows directory exists
if [ ! -d "$WORKFLOWS_DIR" ]; then
    echo "❌ Workflows directory not found: $WORKFLOWS_DIR"
    exit 1
fi

# Find all JSON files in workflows directory
find "$WORKFLOWS_DIR" -name "*.json" -type f | while read -r file; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    filename=$(basename "$file")
    
    echo "📄 Validating: $filename"
    
    # Validate JSON syntax using jq
    if command -v jq >/dev/null 2>&1; then
        if jq empty "$file" >/dev/null 2>&1; then
            echo "  ✅ Valid JSON"
            VALID_FILES=$((VALID_FILES + 1))
        else
            echo "  ❌ Invalid JSON"
            ERROR_COUNT=$((ERROR_COUNT + 1))
            
            # Try to get more specific error information
            echo "  🔍 Error details:"
            jq empty "$file" 2>&1 | head -5 | sed 's/^/    /'
            
            # Show the problematic line if possible
            echo "  📍 Checking for syntax issues..."
            python3 -c "
import json
import sys

try:
    with open('$file', 'r') as f:
        content = f.read()
        json.loads(content)
    print('    Python JSON parser: Valid')
except json.JSONDecodeError as e:
    print(f'    Python JSON parser: {e}')
    print(f'    Line: {e.lineno}, Column: {e.colno}')
    print(f'    Position: {e.pos}')
    
    # Show context around the error
    lines = content.split('\n')
    if e.lineno <= len(lines):
        start = max(0, e.lineno - 2)
        end = min(len(lines), e.lineno + 2)
        print('    Context:')
        for i in range(start, end):
            marker = '>>> ' if i == e.lineno - 1 else '    '
            print(f'    {marker}{i+1:4d}: {lines[i]}')
except Exception as e:
    print(f'    Error reading file: {e}')
" 2>/dev/null || echo "    Could not analyze with Python"
        fi
    else
        # Fallback to Python if jq is not available
        if python3 -c "import json; json.load(open('$file'))" >/dev/null 2>&1; then
            echo "  ✅ Valid JSON (Python validation)"
            VALID_FILES=$((VALID_FILES + 1))
        else
            echo "  ❌ Invalid JSON (Python validation)"
            ERROR_COUNT=$((ERROR_COUNT + 1))
            
            # Get detailed error information
            echo "  🔍 Error details:"
            python3 -c "
import json
import sys

try:
    with open('$file', 'r') as f:
        content = f.read()
        json.loads(content)
except json.JSONDecodeError as e:
    print(f'    {e}')
    print(f'    Line: {e.lineno}, Column: {e.colno}')
    print(f'    Position: {e.pos}')
    
    # Show context around the error
    lines = content.split('\n')
    if e.lineno <= len(lines):
        start = max(0, e.lineno - 2)
        end = min(len(lines), e.lineno + 2)
        print('    Context:')
        for i in range(start, end):
            marker = '>>> ' if i == e.lineno - 1 else '    '
            print(f'    {marker}{i+1:4d}: {lines[i]}')
except Exception as e:
    print(f'    Error: {e}')
" 2>/dev/null || echo "    Could not analyze with Python"
        fi
    fi
    
    echo ""
done

echo "======================================"
echo "📊 Validation Summary:"
echo "  Total files: $TOTAL_FILES"
echo "  Valid files: $VALID_FILES"
echo "  Files with errors: $ERROR_COUNT"

if [ $ERROR_COUNT -eq 0 ]; then
    echo "🎉 All workflow files are valid!"
    exit 0
else
    echo "⚠️  Found $ERROR_COUNT file(s) with JSON syntax errors"
    echo "💡 Use the error details above to fix the issues"
    exit 1
fi
