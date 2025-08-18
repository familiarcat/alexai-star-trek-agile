#!/bin/zsh

# 🧪 Shell Syntax Test
# Demonstrates problematic vs safe patterns

set -e

echo "🧪 SHELL SYNTAX TEST"
echo "==================="
echo ""

# Source safe utilities
source scripts/utils/safe-echo.sh

echo "📋 Testing safe patterns..."
echo ""

# ✅ SAFE PATTERNS:
print_header "SAFE PATTERN DEMO" "Using safe echo utilities"

print_status "success" "This is a safe success message"
print_status "warning" "This is a safe warning"
print_status "error" "This is a safe error (demo)"

print_section "SECTION DEMO" "🔧"

safe_execute "Testing date command" date

print_list "Available crew members" "Captain Picard" "Lieutenant Data" "Counselor Troi"

print_header "TEST COMPLETE" "All patterns executed safely"

echo "✅ Shell syntax test completed without cmdand/dquote errors!"
