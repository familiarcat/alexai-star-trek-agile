#!/bin/zsh

# 🛡️ Shell Script Validator
# Validates shell scripts against AlexAI standards

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🛡️ ALEXAI SHELL SCRIPT VALIDATOR"
echo "================================"
echo ""

# Function to validate a single script
validate_script() {
    local script_file="$1"
    local errors=0
    
    echo "🔍 Validating: $script_file"
    echo "----------------------------"
    
    # Check 1: Echo chains with &&
    if grep -n "echo.*&&.*echo" "$script_file" > /dev/null; then
        echo "❌ Found echo chains with && (causes cmdand errors)"
        grep -n "echo.*&&.*echo" "$script_file" | head -3
        ((errors++))
    else
        echo "✅ No problematic echo chains found"
    fi
    
    # Check 2: Complex command substitution in echo
    if grep -n "echo.*\$(.*)" "$script_file" | grep "&&" > /dev/null; then
        echo "❌ Found complex command substitution in echo chains"
        grep -n "echo.*\$(.*)" "$script_file" | grep "&&" | head -3
        ((errors++))
    else
        echo "✅ No complex command substitution in echo chains"
    fi
    
    # Check 3: Unclosed quotes (basic check)
    if ! zsh -n "$script_file" 2>/dev/null; then
        echo "❌ Syntax errors detected (may include quote issues)"
        zsh -n "$script_file" 2>&1 | head -3
        ((errors++))
    else
        echo "✅ Basic syntax validation passed"
    fi
    
    # Check 4: Missing set -e
    if ! grep -q "set -e" "$script_file"; then
        echo "⚠️ Missing 'set -e' for error handling"
        ((errors++))
    else
        echo "✅ Error handling enabled"
    fi
    
    echo "Total issues: $errors"
    echo ""
    
    return $errors
}

# Function to fix common issues
fix_script() {
    local script_file="$1"
    local backup_file="${script_file}.backup"
    
    echo "🔧 Fixing: $script_file"
    echo "---------------------"
    
    # Create backup
    cp "$script_file" "$backup_file"
    
    # Fix 1: Simple echo chain replacements
    # This is a basic fix - complex cases need manual review
    sed -i '' 's/echo "\([^"]*\)" && echo "\([^"]*\)"/echo "\1"; echo "\2"/g' "$script_file"
    
    echo "✅ Basic fixes applied (backup: $backup_file)"
    echo ""
}

# Main validation
main() {
    local fix_mode=false
    local total_errors=0
    
    if [[ "$1" == "--fix" ]]; then
        fix_mode=true
        echo "🔧 Fix mode enabled"
        echo ""
    fi
    
    # Find all shell scripts
    echo "📋 Finding shell scripts..."
    local scripts=()
    while IFS= read -r -d '' script; do
        scripts+=("$script")
    done < <(find "$PROJECT_ROOT" -name "*.sh" -type f -print0)
    
    echo "Found ${#scripts[@]} shell scripts"
    echo ""
    
    # Validate each script
    for script in "${scripts[@]}"; do
        # Skip this validator script itself
        if [[ "$script" == "$0" ]]; then
            continue
        fi
        
        if $fix_mode; then
            fix_script "$script"
        fi
        
        if validate_script "$script"; then
            echo "✅ $script - PASSED"
        else
            echo "❌ $script - FAILED"
            ((total_errors++))
        fi
        
        echo "----------------------------------------"
        echo ""
    done
    
    # Summary
    echo "🏆 VALIDATION SUMMARY"
    echo "===================="
    echo "Total scripts: ${#scripts[@]}"
    echo "Scripts with issues: $total_errors"
    echo "Success rate: $(( (${#scripts[@]} - total_errors) * 100 / ${#scripts[@]} ))%"
    echo ""
    
    if [[ $total_errors -eq 0 ]]; then
        echo "✅ All scripts passed validation!"
    else
        echo "❌ $total_errors scripts need attention"
        echo ""
        echo "🔧 RECOMMENDED ACTIONS:"
        echo "1. Review scripts marked as FAILED"
        echo "2. Apply AlexAI Shell Script Standards"
        echo "3. Re-run validation after fixes"
        echo "4. Use --fix flag for automatic basic fixes"
    fi
    
    return $total_errors
}

main "$@"
