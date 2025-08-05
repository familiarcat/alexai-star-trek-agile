# 🔐 **Vercel Credentials Setup Guide**

## 🎯 **Overview**
This guide helps you set up Vercel credentials in your `~/.zshrc` file for automated deployment scripts.

## 📋 **Prerequisites**
- ✅ Vercel account: [vercel.com](https://vercel.com)
- ✅ GitHub account connected to Vercel
- ✅ Terminal access to your local machine

## 🔑 **Step 1: Get Your Vercel Token**

### **Method A: Via Vercel Dashboard**
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. **Name**: `alexai-deployment-token`
4. **Scope**: Select **"Full Account"** or **"Project"** (if you want to limit to specific projects)
5. **Expiration**: Choose appropriate expiration (recommend 1 year for automation)
6. Click **"Create"**
7. **Copy the token** (starts with `vercel_`)

### **Method B: Via Vercel CLI**
```bash
# Login to Vercel CLI
vercel login

# Create a token
vercel tokens create alexai-deployment-token
```

## 🔧 **Step 2: Add Credentials to ~/.zshrc**

### **Option A: Manual Setup**
Add these lines to your `~/.zshrc` file:

```bash
# Vercel Deployment Credentials
export VERCEL_TOKEN="vercel_your_token_here"
export VERCEL_ORG_ID="your_org_id_here"
export VERCEL_PROJECT_ID="your_project_id_here"
```

### **Option B: Automated Setup**
Run our setup script:
```bash
./setup_secrets.sh
```

## 🔍 **Step 3: Get Organization and Project IDs**

### **Get Organization ID**
```bash
# List your organizations
vercel orgs ls

# Or get from dashboard: https://vercel.com/account
```

### **Get Project ID**
```bash
# List your projects
vercel projects ls

# Or get from project dashboard: https://vercel.com/dashboard
```

## 🧪 **Step 4: Test Your Credentials**

### **Test Token**
```bash
# Source your ~/.zshrc
source ~/.zshrc

# Test Vercel authentication
vercel whoami

# Test project access
vercel projects ls
```

### **Test Environment Variables**
```bash
# Check if variables are loaded
echo "VERCEL_TOKEN: ${VERCEL_TOKEN:0:10}..."
echo "VERCEL_ORG_ID: $VERCEL_ORG_ID"
echo "VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
```

## 🚀 **Step 5: Update Automated Deployment Script**

Once credentials are set, update the deployment script:

```bash
# The automated_deploy.sh script will now use:
# - VERCEL_TOKEN for authentication
# - VERCEL_ORG_ID for organization context
# - VERCEL_PROJECT_ID for project targeting
```

## 🔒 **Security Best Practices**

### **Token Security**
- ✅ **Never commit tokens to git**
- ✅ **Use environment variables**
- ✅ **Set appropriate expiration dates**
- ✅ **Limit token scope when possible**
- ✅ **Rotate tokens regularly**

### **File Permissions**
```bash
# Ensure ~/.zshrc is secure
chmod 600 ~/.zshrc
```

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **1. Token Not Working**
```bash
# Check token format
echo $VERCEL_TOKEN | head -c 20

# Should start with: vercel_
```

#### **2. Permission Denied**
```bash
# Check if you're logged in
vercel whoami

# Re-login if needed
vercel logout
vercel login
```

#### **3. Project Not Found**
```bash
# List all projects
vercel projects ls

# Check project ID
vercel projects ls | grep your-project-name
```

## 📊 **Verification Checklist**

- [ ] Vercel token created and copied
- [ ] Token added to `~/.zshrc`
- [ ] Organization ID identified
- [ ] Project ID identified
- [ ] Credentials tested successfully
- [ ] Automated deployment script updated
- [ ] Security measures implemented

## 🎉 **Success Indicators**

When properly configured, you should see:
```bash
$ vercel whoami
pbradygeorgen-4829

$ vercel projects ls
alexai_katra_transfer_package_remote_v7

$ echo $VERCEL_TOKEN
vercel_abc123...
```

## 🚀 **Next Steps**

Once credentials are configured:
1. **Run automated deployment**: `./automated_deploy.sh`
2. **Test production access**: Visit your Vercel URL
3. **Set up database**: Execute Supabase setup
4. **Populate data**: Run mock data script

**Live long and prosper! 🖖** 