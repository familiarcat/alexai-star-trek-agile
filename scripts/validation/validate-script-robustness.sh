#!/bin/bash

# 🔍 SCRIPT ROBUSTNESS VALIDATOR
# Chief Engineer Scott's Tool for Validating Script Quality

set -euo pipefail

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

validate_script() {
    local script_file="$1"
    local issues=0
    
    log_info "Validating: $(basename "$script_file")"
    
    # Check 1: Proper error handling
    if ! grep -q "set -e" "$script_file"; then
        log_warning "  Missing 'set -e' for error handling"
        ((issues++))
    fi
    
    # Check 2: Undefined variable handling
    if ! grep -q "set -u" "$script_file"; then
        log_warning "  Missing 'set -u' for undefined variable handling"
        ((issues++))
    fi
    
    # Check 3: Pipe failure handling
    if ! grep -q "set -o pipefail" "$script_file"; then
        log_warning "  Missing 'set -o pipefail' for pipe failure handling"
        ((issues++))
    fi
    
    # Check 4: Problematic nested command substitutions
    if grep -q '\$(echo "\$(.*)"' "$script_file"; then
        log_error "  Found problematic nested command substitution"
        ((issues++))
    fi
    
    # Check 5: Problematic eval usage
    if grep -q 'eval "\$(grep' "$script_file"; then
        log_error "  Found problematic eval pattern"
        ((issues++))
    fi
    
    # Check 6: Unquoted variables in echo
    if grep -q 'echo [^"]*\$[a-zA-Z_][a-zA-Z0-9_]*[^"]*$' "$script_file"; then
        log_warning "  Found unquoted variables in echo statements"
        ((issues++))
    fi
    
    # Check 7: Missing error traps
    if ! grep -q "trap.*ERR" "$script_file"; then
        log_warning "  Missing error trap for better error handling"
        ((issues++))
    fi
    
    if [[ $issues -eq 0 ]]; then
        log_success "  Script passed validation"
    else
        log_warning "  Script has $issues issue(s) to address"
    fi
    
    return $issues
}

# Main validation
main() {
    local scripts_dir="${1:-scripts}"
    local total_issues=0
    local total_scripts=0
    
    log_info "Starting script robustness validation..."
    
    while IFS= read -r -d '' script; do
        if [[ -f "$script" && -x "$script" ]]; then
            validate_script "$script"
            total_issues=$((total_issues + $?))
            ((total_scripts++))
        fi
    done < <(find "$scripts_dir" -name "*.sh" -type f -print0)
    
    echo ""
    log_info "Validation Summary:"
    echo "  Total scripts: $total_scripts"
    echo "  Total issues: $total_issues"
    
    if [[ $total_issues -eq 0 ]]; then
        log_success "All scripts passed validation!"
    else
        log_warning "Some scripts need attention"
    fi
}

main "$@"
