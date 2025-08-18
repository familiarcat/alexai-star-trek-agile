#!/bin/zsh

# 🛡️ Safe Echo Utilities
# Prevents cmdand/dquote errors in shell scripts

# Function: Safe header printing
print_header() {
    local title="$1"
    local subtitle="${2:-}"
    
    echo "🚀 $title"
    echo "==============================="
    if [[ -n "$subtitle" ]]; then
        echo "$subtitle"
    fi
    echo ""
}

# Function: Safe section printing
print_section() {
    local title="$1"
    local emoji="${2:-📋}"
    
    echo "$emoji $title"
    echo "$(printf '=%.0s' {1..${#title}})"
    echo ""
}

# Function: Safe status messages
print_status() {
    local msg_type="$1"
    local message="$2"
    
    case "$msg_type" in
        "success"|"ok"|"✅")
            echo "✅ $message"
            ;;
        "error"|"fail"|"❌")
            echo "❌ $message"
            ;;
        "warning"|"warn"|"⚠️")
            echo "⚠️ $message"
            ;;
        "info"|"ℹ️")
            echo "ℹ️ $message"
            ;;
        "working"|"⏳")
            echo "⏳ $message"
            ;;
        *)
            echo "$msg_type $message"
            ;;
    esac
}

# Function: Safe command execution with status
safe_execute() {
    local description="$1"
    shift
    local command=("$@")
    
    print_status "⏳" "$description..."
    
    if "${command[@]}"; then
        print_status "✅" "$description completed"
        return 0
    else
        print_status "❌" "$description failed"
        return 1
    fi
}

# Function: Safe multi-line output
print_multiline() {
    local content="$1"
    
    # Use printf to safely handle multi-line content
    printf "%s\n" "$content"
}

# Function: Safe list printing
print_list() {
    local title="$1"
    shift
    local items=("$@")
    
    echo "$title:"
    for item in "${items[@]}"; do
        echo "  • $item"
    done
    echo ""
}

# Export functions for use in other scripts
export -f print_header
export -f print_section
export -f print_status
export -f safe_execute
export -f print_multiline
export -f print_list
