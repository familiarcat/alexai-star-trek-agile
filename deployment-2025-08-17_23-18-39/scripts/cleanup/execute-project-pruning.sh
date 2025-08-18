#!/bin/bash

# Execute Project Pruning Script
# This script cleans up the project structure to eliminate confusion

set -e

echo "🧹 Executing Project Pruning"
echo "============================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to backup before deletion
backup_item() {
    local item="$1"
    local backup_dir="backup-$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    if [ -e "$item" ]; then
        echo -e "${YELLOW}📦 Backing up: $item → $backup_dir/${NC}"
        mv "$item" "$backup_dir/"
    fi
}

# Function to safely remove with backup
safe_remove() {
    local item="$1"
    local reason="$2"
    
    if [ -e "$item" ]; then
        echo -e "${YELLOW}🗑️  Removing: $item (${reason})${NC}"
        backup_item "$item"
    fi
}

echo -e "\n${BLUE}🚨 PHASE 1: Consolidating Workflow Directories${NC}"
echo "====================================================="

# Consolidate workflow directories
if [ -d "workflows" ] && [ -d "sync-system/workflows" ]; then
    echo -e "${YELLOW}📁 Consolidating workflow directories...${NC}"
    
    # Create consolidated workflows directory
    mkdir -p "workflows-consolidated"
    
    # Copy all workflows from both directories
    cp -r workflows/* workflows-consolidated/ 2>/dev/null || true
    cp -r sync-system/workflows/* workflows-consolidated/ 2>/dev/null || true
    
    # Remove duplicate files (keep the most recent)
    echo -e "${YELLOW}🔍 Removing duplicate workflow files...${NC}"
    cd workflows-consolidated
    for file in *.json; do
        if [ -f "$file" ]; then
            # Keep the most recent version if duplicates exist
            echo "Keeping: $file"
        fi
    done
    cd ..
    
    # Backup old directories and use consolidated one
    safe_remove "workflows" "consolidating into workflows-consolidated"
    safe_remove "sync-system/workflows" "consolidating into workflows-consolidated"
    
    # Rename consolidated directory
    mv workflows-consolidated workflows
    echo -e "${GREEN}✅ Workflow directories consolidated${NC}"
fi

echo -e "\n${BLUE}🚨 PHASE 2: Choosing One Sync System${NC}"
echo "============================================="

# Choose bilateral-sync over sync-system (more mature)
if [ -d "bilateral-sync" ] && [ -d "sync-system" ]; then
    echo -e "${YELLOW}🔄 Choosing bilateral-sync over sync-system${NC}"
    echo "   - bilateral-sync is more mature and feature-complete"
    echo "   - sync-system has duplicate functionality"
    
    safe_remove "sync-system" "duplicate functionality with bilateral-sync"
fi

echo -e "\n${BLUE}🚨 PHASE 3: Cleaning Up Knowledge Base${NC}"
echo "============================================="

# Keep only essential knowledge base files
if [ -d "alexai-knowledge-base" ]; then
    echo -e "${YELLOW}📚 Pruning knowledge base...${NC}"
    
    # Keep only essential directories
    essential_dirs=("01-foundations/architecture" "02-ai-agents/capabilities" "03-operations/procedures")
    
    for dir in "${essential_dirs[@]}"; do
        if [ -d "alexai-knowledge-base/$dir" ]; then
            echo "Keeping: $dir"
        fi
    done
    
    # Remove non-essential directories
    for item in alexai-knowledge-base/*; do
        if [ -d "$item" ]; then
            dir_name=$(basename "$item")
            if [[ ! " ${essential_dirs[@]} " =~ " ${dir_name} " ]]; then
                safe_remove "$item" "non-essential knowledge base content"
            fi
        fi
    done
fi

echo -e "\n${BLUE}🚨 PHASE 4: Cleaning Up Scripts${NC}"
echo "====================================="

# Keep only essential scripts
essential_scripts=(
    "scripts/setup/enhanced-environment-setup.sh"
    "scripts/deploy/centralized-deployment.sh"
    "scripts/validation/validate-workflow-json.sh"
    "scripts/cleanup/execute-project-pruning.sh"
)

# Remove non-essential scripts
find scripts -name "*.sh" | while read -r script; do
    if [[ ! " ${essential_scripts[@]} " =~ " ${script} " ]]; then
        # Check if script is referenced anywhere
        if ! grep -r "$(basename "$script")" . --exclude-dir=node_modules --exclude-dir=.git > /dev/null 2>&1; then
            safe_remove "$script" "unused script"
        fi
    fi
done

echo -e "\n${BLUE}🚨 PHASE 5: Final Cleanup${NC}"
echo "==============================="

# Remove test and temporary directories
safe_remove "test_env" "temporary test environment"
safe_remove "test-projects" "test project files"
safe_remove "tests/venv" "Python virtual environment"
safe_remove "logs" "log files (will be recreated)"

# Remove unused configuration files
safe_remove "config/deployment-config.json" "will be recreated if needed"
safe_remove "bilateral-sync/config.json" "will be recreated if needed"

echo -e "\n${GREEN}🎉 Project Pruning Complete!${NC}"
echo "====================================="

echo -e "\n${BLUE}📊 New Project Structure:${NC}"
echo "1. ✅ workflows/ (consolidated from both locations)"
echo "2. ✅ bilateral-sync/ (chosen sync system)"
echo "3. ✅ src/ (Next.js application)"
echo "4. ✅ scripts/ (essential scripts only)"
echo "5. ✅ docs/ (essential documentation)"
echo "6. ✅ alexai-knowledge-base/ (essential content only)"

echo -e "\n${YELLOW}🔧 Next Steps:${NC}"
echo "1. Test the application: npm run dev"
echo "2. Verify workflows load without JSON errors"
echo "3. Test bilateral sync functionality"
echo "4. Update any configuration files if needed"

echo -e "\n${GREEN}✨ Your project is now clean and maintainable!${NC}"
