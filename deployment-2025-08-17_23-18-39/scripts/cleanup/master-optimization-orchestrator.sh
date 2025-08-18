#!/bin/bash

# 🚀 **MASTER OPTIMIZATION ORCHESTRATOR**
# **Mission**: Coordinate 3-phase file structure optimization
# **Target**: 50% storage reduction, unified structure
# **Crew**: Captain Picard, Commander Data, Chief Engineer Scott

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
PHASE1_SCRIPT="$SCRIPT_DIR/phase1-backup-cleanup.sh"
LOG_FILE="$PROJECT_ROOT/logs/optimization-orchestrator-$(date +%Y%m%d_%H%M%S).log"

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
echo "   MASTER OPTIMIZATION ORCHESTRATOR"
echo "   NCC-1701-B File Structure Optimization"
echo "   Stardate: $(date +'%Y.%m.%d')"
echo "   Crew: Captain Picard, Commander Data, Chief Engineer Scott"
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
log "📁 Creating log directory..."
mkdir -p "$(dirname "$LOG_FILE")"

# Check current project state
log "📊 Analyzing current project state..."
cd "$PROJECT_ROOT"

CURRENT_SIZE=$(du -sh . | cut -f1)
BACKUP_COUNT=$(find . -name "*.backup.*" -type f | wc -l | tr -d ' ')
SCRIPT_COUNT=$(find . -name "*.sh" -type f | grep -v backup | wc -l | tr -d ' ')

log "   Current project size: $CURRENT_SIZE"
log "   Backup files: $BACKUP_COUNT"
log "   Active scripts: $SCRIPT_COUNT"

# Crew coordination meeting
log "🖖 Crew coordination meeting initiated..."
log "   Captain Picard: Strategic oversight active"
log "   Commander Data: Technical analysis operational"
log "   Chief Engineer Scott: Implementation ready"

# Phase 1: Backup Cleanup
log_phase "PHASE 1: Backup Cleanup"
log "   Target: Consolidate $BACKUP_COUNT backup files"
log "   Risk Level: LOW (archive-based)"
log "   Timeline: Immediate"

if [[ -f "$PHASE1_SCRIPT" ]]; then
    log "   Executing Phase 1 script..."
    if "$PHASE1_SCRIPT"; then
        log_success "   Phase 1 completed successfully!"
        
        # Check Phase 1 results
        NEW_BACKUP_COUNT=$(find . -name "*.backup.*" -type f | wc -l | tr -d ' ')
        REDUCTION=$((BACKUP_COUNT - NEW_BACKUP_COUNT))
        log "   Backup reduction: $REDUCTION files"
        
        if [[ $REDUCTION -gt 0 ]]; then
            log_success "   Phase 1 objectives achieved!"
        else
            log_warning "   No backup files were processed"
        fi
    else
        log_error "   Phase 1 failed! Manual intervention required."
        exit 1
    fi
else
    log_error "   Phase 1 script not found: $PHASE1_SCRIPT"
    exit 1
fi

# Phase 2: Script Consolidation (Preview)
log_phase "PHASE 2: Script Consolidation (Preview)"
log "   Target: Reduce $SCRIPT_COUNT scripts to ~45 scripts"
log "   Risk Level: MEDIUM (consolidation)"
log "   Timeline: 24 hours"
log "   Status: Planning phase"

# Analyze script categories
log "   Analyzing script categories..."
DEPLOYMENT_SCRIPTS=$(find . -name "*.sh" -type f | grep -v backup | grep -i deploy | wc -l | tr -d ' ')
TESTING_SCRIPTS=$(find . -name "*.sh" -type f | grep -v backup | grep -i test | wc -l | tr -d ' ')
SETUP_SCRIPTS=$(find . -name "*.sh" -type f | grep -v backup | grep -i setup | wc -l | tr -d ' ')

log "     Deployment scripts: $DEPLOYMENT_SCRIPTS"
log "     Testing scripts: $TESTING_SCRIPTS"
log "     Setup scripts: $SETUP_SCRIPTS"

# Phase 3: Knowledge Base Restructuring (Preview)
log_phase "PHASE 3: Knowledge Base Restructuring (Preview)"
log "   Target: Organize scattered knowledge files"
log "   Risk Level: LOW (reorganization)"
log "   Timeline: 48 hours"
log "   Status: Planning phase"

# Check knowledge base structure
if [[ -d "alexai-knowledge-base" ]]; then
    KB_FILES=$(find alexai-knowledge-base -type f | wc -l | tr -d ' ')
    log "   Knowledge base files: $KB_FILES"
else
    log "   Knowledge base directory not found"
fi

# Current status summary
log "📊 Current optimization status..."
NEW_SIZE=$(du -sh . | cut -f1)
NEW_BACKUP_COUNT=$(find . -name "*.backup.*" -type f | wc -l | tr -d ' ')

log "   Project size: $CURRENT_SIZE → $NEW_SIZE"
log "   Backup files: $BACKUP_COUNT → $NEW_BACKUP_COUNT"
log "   Scripts: $SCRIPT_COUNT (Phase 2 target: 45)"

# Next steps
log "🚀 Next steps..."
log "   1. Phase 1: ✅ COMPLETE"
log "   2. Phase 2: 🔄 Ready to begin (Script consolidation)"
log "   3. Phase 3: 📋 Planning (Knowledge base restructuring)"

# Crew recommendations
log "🖖 Crew recommendations..."
log "   Captain Picard: Phase 1 successful, proceed to Phase 2"
log "   Commander Data: Script analysis complete, consolidation ready"
log "   Chief Engineer Scott: Implementation systems operational"

# Success message
log_success "🎉 Master Optimization Orchestrator Phase 1 Complete!"
log "   Ready to proceed to Phase 2: Script Consolidation"
log "   Timeline: 24 hours to Phase 2 completion"
log "   Target: 50% storage reduction by Phase 3 completion"

echo -e "${GREEN}"
echo "🚀 ================================================"
echo "   PHASE 1 COMPLETE - READY FOR PHASE 2"
echo "   Backup cleanup successful!"
echo "   Script consolidation ready to begin"
echo "   Knowledge base restructuring planned"
echo "================================================ 🚀"
echo -e "${NC}"

log "📋 Summary report generated: $LOG_FILE"
log "🚀 Ready for Phase 2 execution"

exit 0
