# 🛡️ AlexAI Shell Script Standards
## Prevention of cmdand/dquote Errors

### 🚨 **CRITICAL ISSUES IDENTIFIED:**

#### **Root Cause: Complex Echo Commands with &&**
The persistent `cmdand` and `dquote>` errors are caused by:
1. **Long echo chains with `&&`** - Breaking shell parsing
2. **Nested quotes in complex commands** - Causing unclosed quote states
3. **Multi-line command concatenation** - Shell interpreter confusion

### ✅ **SHELL SCRIPT STANDARDS**

#### **1. Echo Command Rules**
```bash
# ❌ AVOID: Long echo chains with &&
echo "🔍 ANALYZING" && echo "============" && echo "Details here"

# ✅ PREFERRED: Separate echo statements
echo "🔍 ANALYZING"
echo "============"
echo "Details here"

# ✅ ALTERNATIVE: Heredoc for multi-line
cat << 'EOF'
🔍 ANALYZING
============
Details here
EOF
```

#### **2. Quote Management**
```bash
# ❌ AVOID: Complex nested quotes
echo "Message with \"quotes\" and 'single quotes'"

# ✅ PREFERRED: Use heredoc for complex content
cat << 'EOF'
Message with "quotes" and 'single quotes'
EOF

# ✅ ALTERNATIVE: Escape properly
echo "Message with \"quotes\" and 'single quotes'"
```

#### **3. Command Substitution**
```bash
# ❌ AVOID: Complex substitution in echo chains
echo "Date: $(date)" && echo "Status: $(curl -s url)"

# ✅ PREFERRED: Store in variables first
current_date=$(date)
status=$(curl -s url)
echo "Date: $current_date"
echo "Status: $status"
```

#### **4. Function Structure**
```bash
# ✅ STANDARD FUNCTION TEMPLATE
function_name() {
    echo "📋 FUNCTION: function_name"
    echo "========================="
    echo ""
    
    # Function logic here
    local var1="value"
    local var2="another_value"
    
    echo "✅ Function completed"
    echo ""
}
```

#### **5. Error Handling**
```bash
# ✅ PROPER ERROR HANDLING
set -e  # Exit on error
set -u  # Exit on undefined variable

# For functions that might fail
if ! some_command; then
    echo "❌ Command failed"
    return 1
fi
```

### 🔧 **IMMEDIATE FIXES NEEDED**

#### **Fix Pattern 1: Echo Chains**
```bash
# Replace this pattern:
echo "A" && echo "B" && echo "C"

# With this:
{
    echo "A"
    echo "B" 
    echo "C"
}
```

#### **Fix Pattern 2: Complex Headers**
```bash
# Replace this pattern:
echo "🚀 TITLE" && echo "========" && echo "Details: $(date)"

# With this:
print_header() {
    local title="$1"
    local details="$2"
    echo "🚀 $title"
    echo "==============================="
    echo "$details"
    echo ""
}
```

### 🤖 **AI AGENT REVIEW REQUIREMENTS**

Our AI agents need to:
1. **Never generate echo chains with `&&`**
2. **Use heredoc for multi-line content**
3. **Store command results in variables first**
4. **Use functions for repeated patterns**
5. **Test all generated scripts in zsh**

### 📝 **SCRIPT VALIDATION CHECKLIST**

Before deploying any `.sh` script:
- [ ] No echo chains with `&&`
- [ ] All quotes properly closed
- [ ] Complex content uses heredoc
- [ ] Variables used for command substitution
- [ ] Functions used for repeated logic
- [ ] Tested in zsh environment
- [ ] Error handling implemented

### 🔍 **COMMON ERROR PATTERNS TO AVOID**

```bash
# ❌ THESE CAUSE cmdand/dquote ERRORS:
echo "A" && echo "B" && echo "C" && echo "$(date)"
echo "Text with $(complex_command)" && echo "More text"
echo 'Single quotes with $(substitution)' && echo "Mixed quotes"

# ✅ SAFE ALTERNATIVES:
{
    echo "A"
    echo "B"
    echo "C"
    echo "$(date)"
}

current_time=$(date)
result=$(complex_command)
echo "Text with $result"
echo "More text"
echo "Current time: $current_time"
```

### 🎯 **ENFORCEMENT**

All future shell scripts must:
1. Follow these standards
2. Be validated before commit
3. Include proper error handling
4. Use functions for clarity
5. Avoid complex echo chains

**Last Updated:** $(date)  
**Status:** ACTIVE ENFORCEMENT
