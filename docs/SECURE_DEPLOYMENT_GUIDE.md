# 🔐 **Secure Deployment Guide - Resume Compliance Auditor**

## 🛡️ **Security First Approach**

This guide ensures your EC2 credentials and deployment process are completely secure and follow best practices.

## 🔑 **Credential Management Strategy**

### **✅ What We Do (Secure)**
- Store credentials in `~/.zshrc` (local environment variables)
- Never hardcode secrets in scripts
- Use proper file permissions (600) for private keys
- Create automatic backups before changes
- Validate all credentials before deployment

### **❌ What We Don't Do (Insecure)**
- Hardcode credentials in scripts
- Store secrets in version control
- Use weak file permissions
- Share private keys
- Commit sensitive files to git

## 🚀 **Secure Deployment Process**

### **Step 1: Set Up Secure Credentials**

```bash
# Run the secure credential setup script
./scripts/setup-ec2-credentials.sh
```

**This script will:**
- Prompt for your EC2 details securely
- Add environment variables to `~/.zshrc`
- Create automatic backups
- Validate your setup
- Set proper file permissions

### **Step 2: Deploy Securely**

```bash
# Deploy using environment variables (no hardcoded secrets)
./scripts/deploy-to-ec2.sh
```

## 🔐 **Environment Variables Setup**

### **Required Variables in ~/.zshrc**

```bash
# ========================================
# EC2 Credentials for Resume Compliance Auditor
# ========================================

export EC2_HOST="your-ec2-public-ip-or-domain"
export EC2_USER="ubuntu"
export EC2_KEY_PATH="~/.ssh/your-ec2-key.pem"
```

### **How to Set Manually (Alternative)**

If you prefer to set these manually:

```bash
# Add to your ~/.zshrc file
echo 'export EC2_HOST="your-ec2-ip"' >> ~/.zshrc
echo 'export EC2_USER="ubuntu"' >> ~/.zshrc
echo 'export EC2_KEY_PATH="~/.ssh/your-key.pem"' >> ~/.zshrc

# Reload your shell configuration
source ~/.zshrc
```

## 🔒 **Security Best Practices**

### **1. Private Key Security**

```bash
# Set proper permissions (owner read/write only)
chmod 600 ~/.ssh/your-ec2-key.pem

# Verify permissions
ls -la ~/.ssh/your-ec2-key.pem
# Should show: -rw------- (600)
```

### **2. Environment Variable Security**

```bash
# Check if variables are set (should show values)
echo "EC2_HOST: $EC2_HOST"
echo "EC2_USER: $EC2_USER"
echo "EC2_KEY_PATH: $EC2_KEY_PATH"

# Check if variables are empty (should show nothing)
echo "EC2_HOST: '${EC2_HOST:-NOT_SET}'"
```

### **3. File Permissions**

```bash
# Ensure ~/.zshrc has proper permissions
chmod 644 ~/.zshrc

# Ensure ~/.ssh directory has proper permissions
chmod 700 ~/.ssh
```

## 🧪 **Testing Your Secure Setup**

### **Test Credential Loading**

```bash
# Test if credentials are properly loaded
./scripts/deploy-to-ec2.sh --test-only
```

### **Test EC2 Connectivity**

```bash
# Test SSH connection (without deploying)
ssh -i "$EC2_KEY_PATH" "$EC2_USER@$EC2_HOST" "echo 'Connection successful'"
```

### **Validate Environment Variables**

```bash
# Check all required variables
if [ -z "$EC2_HOST" ] || [ -z "$EC2_KEY_PATH" ]; then
    echo "❌ Missing required environment variables"
    echo "Please run: ./scripts/setup-ec2-credentials.sh"
else
    echo "✅ All environment variables are set"
fi
```

## 🔍 **Troubleshooting Security Issues**

### **Common Security Problems**

#### **1. Permission Denied on Key File**
```bash
# Fix key file permissions
chmod 600 "$EC2_KEY_PATH"

# Verify the fix
ls -la "$EC2_KEY_PATH"
```

#### **2. Environment Variables Not Loading**
```bash
# Reload shell configuration
source ~/.zshrc

# Or restart your terminal
# Then verify variables are set
echo "EC2_HOST: $EC2_HOST"
```

#### **3. Key File Not Found**
```bash
# Check if key file exists
ls -la "$EC2_KEY_PATH"

# If path is wrong, update in ~/.zshrc
nano ~/.zshrc
# Find and fix the EC2_KEY_PATH line
```

### **Debug Commands**

```bash
# Check what's in your ~/.zshrc
grep -n "EC2_" ~/.zshrc

# Check environment variables
env | grep EC2

# Test SSH connection
ssh -i "$EC2_KEY_PATH" -o ConnectTimeout=10 "$EC2_USER@$EC2_HOST" "echo 'Test successful'"
```

## 🚨 **Security Warnings**

### **Never Do These Things**

1. **❌ Commit ~/.zshrc to git**
   ```bash
   # Add to .gitignore
   echo ".zshrc" >> .gitignore
   ```

2. **❌ Share private keys**
   - Keep your `.pem` files private
   - Never email or upload private keys
   - Use different keys for different environments

3. **❌ Use weak passwords**
   - Use strong, unique passwords for EC2 instances
   - Consider using AWS IAM roles instead of passwords

4. **❌ Expose credentials in logs**
   - Scripts never log sensitive information
   - Check logs before sharing

### **Always Do These Things**

1. **✅ Use environment variables**
   - Never hardcode secrets
   - Use the provided setup scripts

2. **✅ Set proper file permissions**
   - Private keys: 600 (owner read/write)
   - SSH directory: 700 (owner read/write/execute)
   - ~/.zshrc: 644 (owner read/write, others read)

3. **✅ Create backups**
   - Automatic backups are created
   - Store backups securely

4. **✅ Validate before deploying**
   - Scripts validate all credentials
   - Test connectivity before deployment

## 🔄 **Updating Credentials**

### **Change EC2 Host or Key**

```bash
# Run the setup script again
./scripts/setup-ec2-credentials.sh

# It will detect existing credentials and offer to update them
```

### **Manual Update**

```bash
# Edit ~/.zshrc
nano ~/.zshrc

# Find and update the EC2_* lines
# Then reload
source ~/.zshrc
```

## 📋 **Deployment Checklist**

### **Before Deployment**

- [ ] **Credentials set in ~/.zshrc**
- [ ] **Private key file exists and has 600 permissions**
- [ ] **EC2 instance is running and accessible**
- [ ] **Security group allows SSH (port 22)**
- [ ] **Environment variables are loaded (`source ~/.zshrc`)**

### **After Deployment**

- [ ] **Resume Auditor is accessible at `http://your-ec2-ip/resume-auditor.html`**
- [ ] **n8n workflow is imported and activated**
- [ ] **Test with sample resume upload**
- [ ] **Verify no CORS errors**
- [ ] **Check nginx logs for any issues**

## 🎯 **Quick Security Commands**

### **One-Liner Security Check**

```bash
# Comprehensive security validation
echo "🔐 Security Check:" && \
echo "EC2_HOST: ${EC2_HOST:-'NOT_SET'}" && \
echo "EC2_KEY_PATH: ${EC2_KEY_PATH:-'NOT_SET'}" && \
echo "Key exists: $([ -f "$EC2_KEY_PATH" ] && echo 'YES' || echo 'NO')" && \
echo "Key permissions: $(ls -la "$EC2_KEY_PATH" 2>/dev/null | awk '{print $1}' || echo 'CANNOT_READ')" && \
echo "SSH test: $(ssh -i "$EC2_KEY_PATH" -o ConnectTimeout=5 "$EC2_USER@$EC2_HOST" "echo 'OK'" 2>/dev/null || echo 'FAILED')"
```

### **Security Status**

```bash
# Check security status
./scripts/deploy-to-ec2.sh --security-check
```

## 🎉 **You're Secure!**

With this setup, your Resume Compliance Auditor deployment is:

- 🔐 **Credential-secure** - No hardcoded secrets
- 🛡️ **Permission-secure** - Proper file permissions
- 🔒 **Environment-secure** - Local variable storage
- 📋 **Validation-secure** - Automatic security checks
- 🚀 **Deployment-secure** - Secure deployment process

**Deploy with confidence knowing your credentials are completely secure! 🖖**
