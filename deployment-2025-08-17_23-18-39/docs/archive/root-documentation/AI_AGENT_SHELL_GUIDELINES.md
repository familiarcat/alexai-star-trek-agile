# 🤖 AI Agent Shell Script Guidelines
## Preventing cmdand/dquote Errors

### 🚨 **ROOT CAUSE ANALYSIS**

**The persistent `cmdand` and `dquote>` errors are caused by:**

1. **Complex echo chains with `&&` operators** 
2. **Nested quotes in command sequences**
3. **Shell parser confusion with multi-line concatenation**

### 🛡️ **MANDATORY AI AGENT RULES**

#### **Rule 1: NEVER Use Echo Chains with &&**
```bash
# ❌ FORBIDDEN - Causes cmdand errors:
echo "🔍 ANALYZING" && echo "============" && echo "Details: $(date)"

# ✅ REQUIRED - Use separate statements:
echo "🔍 ANALYZING"
echo "============"
echo "Details: $(date)"
```

#### **Rule 2: Use Safe Echo Utilities**
```bash
# ✅ ALWAYS source and use safe utilities:
source scripts/utils/safe-echo.sh

print_header "ANALYSIS" "System status check"
print_status "success" "Operation completed"
print_section "RESULTS" "📊"
```

#### **Rule 3: Store Command Results First**
```bash
# ❌ FORBIDDEN - Complex substitution in chains:
echo "Status: $(curl -s url)" && echo "Time: $(date)"

# ✅ REQUIRED - Store results in variables:
status_result=$(curl -s url)
current_time=$(date)
echo "Status: $status_result"
echo "Time: $current_time"
```

#### **Rule 4: Use Functions for Repeated Logic**
```bash
# ✅ REQUIRED - Create reusable functions:
show_status() {
    local operation="$1"
    local result="$2"
    
    print_status "info" "$operation"
    print_status "success" "$result"
}
```

### 📋 **AI AGENT CHECKLIST**

Before generating any shell script, AI agents MUST verify:

- [ ] **No echo chains with `&&`**
- [ ] **All commands stored in variables before echo**
- [ ] **Safe echo utilities used for headers/status**
- [ ] **Functions used for repeated patterns**
- [ ] **Proper quote escaping**
- [ ] **zsh compatibility tested**

### 🔧 **SAFE PATTERN TEMPLATES**

#### **Header Pattern:**
```bash
print_header "OPERATION NAME" "Optional subtitle"
```

#### **Status Updates:**
```bash
print_status "success" "Operation successful"
print_status "warning" "Check this issue"
print_status "error" "Operation failed"
```

#### **Command Execution:**
```bash
safe_execute "Building project" npm run build
safe_execute "Running tests" npm test
```

#### **Multi-step Operations:**
```bash
operation_name() {
    print_section "STEP 1: PREPARATION"
    
    print_status "working" "Preparing environment..."
    result=$(prepare_environment)
    print_status "success" "Environment ready: $result"
    
    print_status "working" "Processing data..."
    data_result=$(process_data)
    print_status "success" "Data processed: $data_result"
    
    print_status "success" "Operation completed"
}
```

### 🚨 **FORBIDDEN PATTERNS**

#### **These patterns CAUSE cmdand/dquote errors:**
```bash
# ❌ Never use these:
echo "A" && echo "B" && echo "C"
echo "Result: $(command)" && echo "Done"
echo 'Mixed $(quotes)' && echo "More text"
```

#### **Complex command concatenation:**
```bash
# ❌ Never use complex chains:
curl -s url && echo "Response: $(cat response)" && echo "Done"
```

### ✅ **SAFE ALTERNATIVES**

#### **For headers and status:**
```bash
# ✅ Use safe utilities:
print_header "TITLE"
print_status "success" "Message"
print_section "SECTION"
```

#### **For command results:**
```bash
# ✅ Store first, then display:
response=$(curl -s url)
print_status "info" "Response: $response"
```

### 🔍 **VALIDATION COMMANDS**

Before deployment, AI agents should suggest:
```bash
# Validate syntax
zsh -n script.sh

# Run validator
./scripts/validation/validate-shell-scripts.sh

# Test execution
./test-shell-syntax.sh
```

### 📝 **SCRIPT TEMPLATE**

```bash
#!/bin/zsh

# [Script Description]
# [Purpose and functionality]

set -e  # MANDATORY: Exit on error

# Source safe utilities
source scripts/utils/safe-echo.sh

# Function definitions
main_operation() {
    print_header "OPERATION NAME" "Description"
    
    # Store command results
    local result=$(some_command)
    
    # Safe status reporting
    print_status "success" "Result: $result"
    
    print_status "success" "Operation completed"
}

# Main execution
main() {
    print_header "SCRIPT NAME" "$(date)"
    
    main_operation
    
    print_status "success" "All operations completed"
}

main "$@"
```

### 🎯 **ENFORCEMENT**

All AI agents generating shell scripts MUST:
1. Follow these guidelines
2. Use safe-echo utilities
3. Validate syntax before output
4. Test in zsh environment
5. Include error handling

**Violation of these rules causes system instability and user frustration.**

### 📊 **SUCCESS METRICS**

- ✅ Zero `cmdand` errors
- ✅ Zero `dquote>` prompts
- ✅ All scripts pass validation
- ✅ Consistent user experience
- ✅ Reliable script execution

**Last Updated:** $(date)  
**Status:** MANDATORY COMPLIANCE  
**Enforcement:** ACTIVE
