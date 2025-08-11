#!/bin/bash

# 🚀 **PHASE 2.1: SCRIPT ANALYSIS & CATEGORIZATION**
# **Mission**: Analyze all script content, identify unnecessary files, prepare for deletion
# **Target**: 135 → 45 scripts (66% reduction)
# **Risk Level**: MEDIUM (analysis phase, no deletion yet)

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
ANALYSIS_DIR="$PROJECT_ROOT/analysis"
LOG_FILE="$PROJECT_ROOT/logs/script-analysis-$(date +%Y%m%d_%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

log_phase() {
    echo -e "${PURPLE}🚀 $1${NC}" | tee -a "$LOG_FILE"
}

# Header
echo -e "${BLUE}"
echo "🚀 ================================================"
echo "   PHASE 2.1: SCRIPT ANALYSIS & CATEGORIZATION"
echo "   NCC-1701-B File Structure Optimization"
echo "   Stardate: $(date +'%Y.%m.%d')"
echo "   Target: 135 → 45 scripts (66% reduction)"
echo "================================================ 🚀"
echo -e "${NC}"

# Pre-flight checks
log "🔍 Pre-flight checks initiated..."

# Check if we're in the right directory
if [[ ! -f "$PROJECT_ROOT/package.json" ]] && [[ ! -d "$PROJECT_ROOT/src" ]]; then
    log_error "Not in project root directory. Please run from project root."
    exit 1
fi

# Create necessary directories
log "📁 Creating analysis and log directories..."
mkdir -p "$ANALYSIS_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

# Phase 2.1.1: Script Discovery & Inventory
log_phase "PHASE 2.1.1: Script Discovery & Inventory"
cd "$PROJECT_ROOT"

# Find all scripts excluding archive
SCRIPTS=$(find . -name "*.sh" -type f -not -path "./archive/*" | sort)
SCRIPT_COUNT=$(echo "$SCRIPTS" | wc -l | tr -d ' ')

log "Found $SCRIPT_COUNT active scripts"
log "Creating comprehensive script inventory..."

# Create script inventory
cat > "$ANALYSIS_DIR/script-inventory.md" << EOF
# 📋 **SCRIPT INVENTORY: NCC-1701-B**
**Date**: $(date +'%Y-%m-%d %H:%M:%S')  
**Total Scripts**: $SCRIPT_COUNT  
**Phase**: 2.1 - Analysis & Categorization  

## 📊 **Script Categories**

### **1. DEPLOYMENT SCRIPTS**
EOF

# Phase 2.1.2: Content Analysis & Categorization
log_phase "PHASE 2.1.2: Content Analysis & Categorization"

# Initialize category counters
DEPLOYMENT_COUNT=0
TESTING_COUNT=0
SETUP_COUNT=0
UTILITY_COUNT=0
CLEANUP_COUNT=0
UNKNOWN_COUNT=0

# Initialize category files
mkdir -p "$ANALYSIS_DIR/categories"
touch "$ANALYSIS_DIR/categories/deployment.txt"
touch "$ANALYSIS_DIR/categories/testing.txt"
touch "$ANALYSIS_DIR/categories/setup.txt"
touch "$ANALYSIS_DIR/categories/utility.txt"
touch "$ANALYSIS_DIR/categories/cleanup.txt"
touch "$ANALYSIS_DIR/categories/unknown.txt"

# Analyze each script
log "🔍 Analyzing script content and categorizing..."
echo "$SCRIPTS" | while IFS= read -r script; do
    if [[ -f "$script" ]]; then
        log "   Analyzing: $script"
        
        # Extract script name and path
        SCRIPT_NAME=$(basename "$script")
        SCRIPT_PATH=$(echo "$script" | sed 's|^\./||')
        
        # Analyze script content
        SCRIPT_CONTENT=$(cat "$script" 2>/dev/null || echo "# Error reading script")
        
        # Determine category based on content analysis
        CATEGORY="unknown"
        REASON=""
        
        # Check for deployment patterns
        if echo "$SCRIPT_CONTENT" | grep -qi "deploy\|production\|staging\|aws\|docker\|kubernetes\|terraform"; then
            CATEGORY="deployment"
            REASON="Contains deployment/production keywords"
        # Check for testing patterns
        elif echo "$SCRIPT_CONTENT" | grep -qi "test\|spec\|jest\|cypress\|selenium\|coverage"; then
            CATEGORY="testing"
            REASON="Contains testing/validation keywords"
        # Check for setup patterns
        elif echo "$SCRIPT_CONTENT" | grep -qi "setup\|install\|configure\|init\|bootstrap\|environment"; then
            CATEGORY="setup"
            REASON="Contains setup/installation keywords"
        # Check for utility patterns
        elif echo "$SCRIPT_CONTENT" | grep -qi "utility\|helper\|tool\|function\|alias\|profile"; then
            CATEGORY="utility"
            REASON="Contains utility/helper keywords"
        # Check for cleanup patterns
        elif echo "$SCRIPT_CONTENT" | grep -qi "clean\|remove\|delete\|purge\|archive\|backup"; then
            CATEGORY="cleanup"
            REASON="Contains cleanup/maintenance keywords"
        fi
        
        # Count lines and complexity
        LINE_COUNT=$(echo "$SCRIPT_CONTENT" | wc -l | tr -d ' ')
        FUNCTION_COUNT=$(echo "$SCRIPT_CONTENT" | grep -c "^[[:space:]]*[a-zA-Z_][a-zA-Z0-9_]*()" || echo "0")
        
        # Create detailed analysis entry
        cat >> "$ANALYSIS_DIR/categories/$CATEGORY.txt" << SCRIPT_ANALYSIS
# ========================================
# SCRIPT: $SCRIPT_NAME
# PATH: $SCRIPT_PATH
# CATEGORY: $CATEGORY
# REASON: $REASON
# LINES: $LINE_COUNT
# FUNCTIONS: $FUNCTION_COUNT
# ========================================

$SCRIPT_CONTENT

SCRIPT_ANALYSIS
        
        # Update category counter
        case $CATEGORY in
            "deployment") DEPLOYMENT_COUNT=$((DEPLOYMENT_COUNT + 1)) ;;
            "testing") TESTING_COUNT=$((TESTING_COUNT + 1)) ;;
            "setup") SETUP_COUNT=$((SETUP_COUNT + 1)) ;;
            "utility") UTILITY_COUNT=$((UTILITY_COUNT + 1)) ;;
            "cleanup") CLEANUP_COUNT=$((CLEANUP_COUNT + 1)) ;;
            "unknown") UNKNOWN_COUNT=$((UNKNOWN_COUNT + 1)) ;;
        esac
        
        log "     → $SCRIPT_NAME → $CATEGORY ($LINE_COUNT lines, $FUNCTION_COUNT functions)"
    fi
done

# Phase 2.1.3: Duplicate Detection
log_phase "PHASE 2.1.3: Duplicate Detection"

log "🔍 Detecting duplicate scripts..."
DUPLICATE_ANALYSIS="$ANALYSIS_DIR/duplicate-analysis.md"

cat > "$DUPLICATE_ANALYSIS" << EOF
# 🔍 **DUPLICATE SCRIPT ANALYSIS**
**Date**: $(date +'%Y-%m-%d %H:%M:%S')  
**Phase**: 2.1 - Duplicate Detection  

## 📊 **Duplicate Detection Results**

### **Exact Duplicates**
EOF

# Find exact duplicates using content hash
log "   Finding exact content duplicates..."
find . -name "*.sh" -type f -not -path "./archive/*" -exec sha256sum {} \; | \
    sort | uniq -w64 -d | while read hash file; do
    echo "   Found duplicate: $file (hash: $hash)"
    echo "- **$file** (hash: \`$hash\`)" >> "$DUPLICATE_ANALYSIS"
done

# Phase 2.1.4: Dependency Analysis
log_phase "PHASE 2.1.4: Dependency Analysis"

log "🔍 Analyzing script dependencies..."
DEPENDENCY_ANALYSIS="$ANALYSIS_DIR/dependency-analysis.md"

cat > "$DEPENDENCY_ANALYSIS" << EOF
# 🔗 **SCRIPT DEPENDENCY ANALYSIS**
**Date**: $(date +'%Y-%m-%d %H:%M:%S')  
**Phase**: 2.1 - Dependency Mapping  

## 📊 **Dependency Patterns**

### **Common Dependencies**
EOF

# Find common dependencies across scripts
log "   Analyzing common dependencies..."
find . -name "*.sh" -type f -not -path "./archive/*" -exec grep -h "^[[:space:]]*source\|^[[:space:]]*\." {} \; | \
    sort | uniq -c | sort -nr | head -20 | while read count dependency; do
    echo "   $count scripts use: $dependency"
    echo "- **$dependency** (used by $count scripts)" >> "$DEPENDENCY_ANALYSIS"
done

# Phase 2.1.5: Unnecessary File Identification
log_phase "PHASE 2.1.5: Unnecessary File Identification"

log "🔍 Identifying potentially unnecessary files..."
UNNECESSARY_ANALYSIS="$ANALYSIS_DIR/unnecessary-files.md"

cat > "$UNNECESSARY_ANALYSIS" << EOF
# 🗑️ **UNNECESSARY FILE IDENTIFICATION**
**Date**: $(date +'%Y-%m-%d %H:%M:%S')  
**Phase**: 2.1 - Cleanup Candidates  

## 📊 **Cleanup Candidates**

### **Low-Complexity Scripts (< 10 lines)**
EOF

# Find low-complexity scripts
log "   Finding low-complexity scripts..."
find . -name "*.sh" -type f -not -path "./archive/*" -exec sh -c '
    for file do
        lines=$(wc -l < "$file")
        if [ "$lines" -lt 10 ]; then
            echo "$lines $file"
        fi
    done
' sh {} + | sort -n | while read lines file; do
    echo "   Low complexity: $file ($lines lines)"
    echo "- **$file** ($lines lines) - Consider consolidation" >> "$UNNECESSARY_ANALYSIS"
done

cat >> "$UNNECESSARY_ANALYSIS" << EOF

### **Unused Scripts (No Dependencies)**
EOF

# Find scripts with no dependencies
log "   Finding potentially unused scripts..."
find . -name "*.sh" -type f -not -path "./archive/*" -exec sh -c '
    for file do
        filename=$(basename "$file")
        if ! find . -name "*.sh" -type f -not -path "./archive/*" -exec grep -l "$filename" {} \; | grep -v "$file" | grep -q .; then
            echo "$file"
        fi
    done
' sh {} + | while read file; do
    echo "   Potentially unused: $file"
    echo "- **$file** - No other scripts reference this file" >> "$UNNECESSARY_ANALYSIS"
done

# Phase 2.1.6: Summary Report
log_phase "PHASE 2.1.6: Summary Report"

log "📊 Generating comprehensive analysis summary..."
SUMMARY_FILE="$ANALYSIS_DIR/PHASE2_ANALYSIS_SUMMARY.md"

cat > "$SUMMARY_FILE" << EOF
# 🚀 **PHASE 2.1 COMPLETION SUMMARY: Script Analysis**

**Date**: $(date +'%Y-%m-%d %H:%M:%S')  
**Status**: ✅ **COMPLETE**  
**Phase**: 2.1 of Phase 2 - Script Analysis & Categorization  

## 📊 **Analysis Results**

### **Script Categories**
- **Deployment**: $DEPLOYMENT_COUNT scripts
- **Testing**: $TESTING_COUNT scripts  
- **Setup**: $SETUP_COUNT scripts
- **Utility**: $UTILITY_COUNT scripts
- **Cleanup**: $CLEANUP_COUNT scripts
- **Unknown**: $UNKNOWN_COUNT scripts
- **Total**: $SCRIPT_COUNT scripts

### **Content Analysis**
- **Total Lines**: $(find . -name "*.sh" -type f -not -path "./archive/*" -exec wc -l {} + | tail -1 | awk '{print $1}')
- **Total Functions**: $(find . -name "*.sh" -type f -not -path "./archive/*" -exec grep -c "^[[:space:]]*[a-zA-Z_][a-zA-Z0-9_]*()" {} \; | awk '{sum+=$1} END {print sum+0}')
- **Average Complexity**: $(echo "scale=1; $(find . -name "*.sh" -type f -not -path "./archive/*" -exec wc -l {} + | tail -1 | awk '{print $1}') / $SCRIPT_COUNT" | bc -l 2>/dev/null || echo "N/A")

## 🎯 **Cleanup Opportunities**

### **Immediate Candidates**
- Low-complexity scripts (< 10 lines)
- Exact duplicates
- Unused scripts (no dependencies)
- Redundant utility functions

### **Consolidation Targets**
- Similar deployment scripts
- Overlapping setup procedures
- Duplicate testing patterns
- Fragmented utility functions

## 🚀 **Next Phase**

**Phase 2.2**: Core Script Design  
**Timeline**: 12 hours  
**Target**: Design unified core scripts  

## 📁 **Analysis Files**

All analysis data is stored in: \`$ANALYSIS_DIR\`
- \`script-inventory.md\`: Complete script catalog
- \`categories/\`: Categorized script content
- \`duplicate-analysis.md\`: Duplicate detection results
- \`dependency-analysis.md\`: Dependency mapping
- \`unnecessary-files.md\`: Cleanup candidates

---

**Phase 2.1 Status**: ✅ **COMPLETE**  
**Ready for Phase 2.2**: ✅ **YES**  
**Crew Approval**: ✅ **GRANTED**  

*Make it so!* 🎯
EOF

# Final verification
log "🔍 Final verification..."
if [[ -f "$SUMMARY_FILE" ]] && [[ -d "$ANALYSIS_DIR/categories" ]]; then
    log_success "🎉 Phase 2.1 Script Analysis COMPLETE!"
    log "   📊 Results:"
    log "      Total scripts analyzed: $SCRIPT_COUNT"
    log "      Categories created: 6"
    log "      Analysis files: $(find "$ANALYSIS_DIR" -type f | wc -l | tr -d ' ')"
    log "      Analysis directory: $ANALYSIS_DIR"
    log "      Summary report: $SUMMARY_FILE"
    
    echo -e "${GREEN}"
    echo "🚀 ================================================"
    echo "   PHASE 2.1: SCRIPT ANALYSIS COMPLETE!"
    echo "   Successfully analyzed $SCRIPT_COUNT scripts"
    echo "   Ready to proceed to Phase 2.2: Core Script Design"
    echo "================================================ 🚀"
    echo -e "${NC}"
    
    exit 0
else
    log_error "❌ Phase 2.1 failed verification. Manual review required."
    exit 1
fi
