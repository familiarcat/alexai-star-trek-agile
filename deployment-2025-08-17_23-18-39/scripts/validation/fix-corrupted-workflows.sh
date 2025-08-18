#!/bin/bash

# Fix Corrupted Workflow Files Script
# This script identifies and fixes corrupted workflow JSON files

set -e

echo "🔧 Fixing Corrupted Workflow Files"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a file is valid JSON
check_json() {
    local file="$1"
    if python3 -m json.tool "$file" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to backup a file
backup_file() {
    local file="$1"
    local backup="${file}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$file" "$backup"
    echo -e "${YELLOW}📦 Backed up: $backup${NC}"
}

# Function to try to fix a corrupted JSON file
fix_json_file() {
    local file="$1"
    local temp_file="${file}.temp"
    
    echo -e "${YELLOW}🔧 Attempting to fix: $(basename "$file")${NC}"
    
    # Try to read the file and identify the issue
    if ! python3 -m json.tool "$file" 2>&1 | head -10; then
        echo -e "${RED}❌ JSON validation failed${NC}"
    fi
    
    # Try to fix common JSON issues
    # Remove trailing commas
    sed 's/,\([[:space:]]*[}\]])/\1/g' "$file" > "$temp_file"
    
    # Remove BOM if present
    sed '1s/^\xEF\xBB\xBF//' "$temp_file" > "${temp_file}.2"
    mv "${temp_file}.2" "$temp_file"
    
    # Try to validate the fixed version
    if check_json "$temp_file"; then
        echo -e "${GREEN}✅ Fixed successfully!${NC}"
        backup_file "$file"
        mv "$temp_file" "$file"
        return 0
    else
        echo -e "${RED}❌ Could not fix automatically${NC}"
        rm -f "$temp_file"
        return 1
    fi
}

# Check both workflow directories
WORKFLOW_DIRS=("sync-system/workflows" "workflows")
TOTAL_FILES=0
CORRUPTED_FILES=0
FIXED_FILES=0

for dir in "${WORKFLOW_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        echo -e "${YELLOW}⚠️  Directory not found: $dir${NC}"
        continue
    fi
    
    echo -e "\n🔍 Checking directory: $dir"
    echo "----------------------------------------"
    
    # Find all JSON files
    find "$dir" -name "*.json" -type f | while read -r file; do
        TOTAL_FILES=$((TOTAL_FILES + 1))
        echo -n "Checking: $(basename "$file") ... "
        
        if check_json "$file"; then
            echo -e "${GREEN}✅ Valid${NC}"
        else
            echo -e "${RED}❌ Corrupted${NC}"
            CORRUPTED_FILES=$((CORRUPTED_FILES + 1))
            
            # Try to fix the file
            if fix_json_file "$file"; then
                FIXED_FILES=$((FIXED_FILES + 1))
            fi
        fi
    done
done

echo -e "\n📊 Summary"
echo "=========="
echo -e "Total files checked: ${TOTAL_FILES}"
echo -e "Corrupted files found: ${CORRUPTED_FILES}"
echo -e "Files fixed: ${FIXED_FILES}"
echo -e "Files still corrupted: $((CORRUPTED_FILES - FIXED_FILES))"

if [ $CORRUPTED_FILES -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All workflow files are valid!${NC}"
elif [ $FIXED_FILES -eq $CORRUPTED_FILES ]; then
    echo -e "\n${GREEN}🎉 All corrupted files were fixed!${NC}"
else
    echo -e "\n${RED}⚠️  Some files could not be fixed automatically${NC}"
    echo "Check the backup files and fix manually if needed."
fi

echo -e "\n✨ Workflow validation complete!"
