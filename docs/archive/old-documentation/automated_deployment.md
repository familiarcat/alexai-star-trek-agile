# 🚀 **Automated Vercel + Supabase Deployment Guide**

## 🎯 **Overview**

This guide provides a **fully automated deployment process** for your Star Trek TNG Agile Project Manager. The automation reads secrets from your `~/.zshrc` file and handles the entire CI/CD pipeline from setup to production deployment.

## 📋 **Prerequisites**

### **Required Tools**
- ✅ **Git**: Version control
- ✅ **curl**: HTTP requests
- ✅ **jq**: JSON parsing
- ✅ **Node.js**: For Vercel CLI
- ✅ **Python**: For the application

### **Required Accounts**
- ✅ **OpenAI**: For AI features
- ✅ **Supabase**: For database
- ✅ **Vercel**: For hosting
- ✅ **GitHub**: For repository

## 🔐 **Step 1: Set Up Secrets (One-Time Setup)**

### **Option A: Automated Setup (Recommended)**
```bash
# Run the automated secrets setup script
./setup_secrets.sh
```

This script will:
- ✅ Guide you through getting all required API keys
- ✅ Validate the format of each secret
- ✅ Automatically add them to your `~/.zshrc`
- ✅ Test that all secrets are properly configured
- ✅ Create backups of your existing `~/.zshrc`

### **Option B: Manual Setup**
If you prefer to set up secrets manually, add these to your `~/.zshrc`:

```bash
# OpenAI API Key for AI features
export OPENAI_API_KEY='sk-your-openai-api-key-here'

# Supabase Project URL
export SUPABASE_URL='https://your-project-id.supabase.co'

# Supabase anon public key
export SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

# Vercel deployment token
export VERCEL_TOKEN='your-vercel-token-here'
```

## 🚀 **Step 2: Automated Deployment**

### **Run the Complete Deployment**
```bash
# Execute the automated deployment script
./automated_deploy.sh
```

### **What the Script Does**

#### **1. Prerequisites Check**
- ✅ Verifies all required tools are installed
- ✅ Loads secrets from `~/.zshrc`
- ✅ Validates all environment variables

#### **2. Supabase Setup**
- ✅ Installs Supabase CLI (if needed)
- ✅ Logs into Supabase
- ✅ Creates new project (if possible via API)
- ✅ Sets up database tables with proper schema
- ✅ Configures Row Level Security policies

#### **3. Vercel Deployment**
- ✅ Installs Vercel CLI (if needed)
- ✅ Logs into Vercel using your token
- ✅ Creates `vercel.json` configuration
- ✅ Sets all environment variables
- ✅ Deploys to production
- ✅ Tests the deployment

#### **4. Local Environment**
- ✅ Creates `.env` file for local development
- ✅ Populates mock data
- ✅ Provides deployment URLs

## 📊 **Step 3: Verification & Testing**

### **Check Deployment Status**
```bash
# View deployment logs
vercel logs

# Check deployment status
vercel ls
```

### **Test Your Application**
1. **Production**: Visit your Vercel URL
2. **Local**: Run `./start_local.sh` and visit `http://localhost:8000`
3. **Database**: Check Supabase dashboard for data

## 🔄 **Step 4: Continuous Deployment**

### **Automatic Updates**
Once deployed, any push to your GitHub repository will automatically trigger a new deployment:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push
```

### **Manual Redeployment**
```bash
# Force a new deployment
./automated_deploy.sh
```

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **1. Missing Secrets**
```bash
# Check if secrets are loaded
echo $OPENAI_API_KEY
echo $SUPABASE_URL
echo $SUPABASE_KEY
echo $VERCEL_TOKEN
```

**Solution**: Run `./setup_secrets.sh` again or manually add to `~/.zshrc`

#### **2. Supabase Project Creation Fails**
The script will warn you if it can't create the project via API.

**Solution**: Create manually at [supabase.com](https://supabase.com) and update your `~/.zshrc`

#### **3. Vercel Deployment Fails**
Check the error messages in the script output.

**Solution**: 
- Verify your Vercel token is correct
- Check if you're logged into Vercel CLI
- Ensure your repository is connected to Vercel

#### **4. Database Tables Not Created**
The script will show you the SQL to run manually.

**Solution**: Copy the SQL and run it in your Supabase SQL Editor

### **Getting Help**

#### **Check Script Logs**
```bash
# Run with verbose output
bash -x ./automated_deploy.sh
```

#### **Verify Environment**
```bash
# Test secrets are loaded
source ~/.zshrc
./setup_secrets.sh --test
```

## 📈 **Monitoring & Management**

### **Vercel Dashboard**
- **URL**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Features**: Deployment logs, analytics, environment variables

### **Supabase Dashboard**
- **URL**: [supabase.com/dashboard](https://supabase.com/dashboard)
- **Features**: Database tables, authentication, real-time logs

### **GitHub Repository**
- **URL**: `https://github.com/familiarcat/alexai-star-trek-agile`
- **Features**: Code history, issues, pull requests

## 🔒 **Security Best Practices**

### **Secret Management**
- ✅ Secrets stored in `~/.zshrc` (local only)
- ✅ Never committed to git repository
- ✅ Backed up automatically by setup script
- ✅ Validated for correct format

### **Database Security**
- ✅ Row Level Security enabled
- ✅ Public read/write access for demo
- ✅ Production: Add user authentication

### **Environment Variables**
- ✅ Local: `.env` file (gitignored)
- ✅ Production: Vercel environment variables
- ✅ No secrets in code or documentation

## 🎉 **Success Indicators**

### **Complete Deployment**
- ✅ Production URL is accessible
- ✅ Local development works
- ✅ Database tables created
- ✅ Mock data populated
- ✅ All features functional

### **Your URLs**
- **Production**: `https://alexai-star-trek-agile.vercel.app`
- **Local**: `http://localhost:8000`
- **Supabase**: `https://supabase.com/dashboard`
- **GitHub**: `https://github.com/familiarcat/alexai-star-trek-agile`

## 🚀 **Next Steps**

### **Customization**
1. **Domain**: Add custom domain in Vercel dashboard
2. **Authentication**: Implement user login in Supabase
3. **Features**: Add more Star Trek themes and AI agents
4. **Scaling**: Upgrade to paid tiers as needed

### **Development Workflow**
1. **Local Development**: `./start_local.sh`
2. **Testing**: Create and test features locally
3. **Deployment**: `git push` (automatic) or `./automated_deploy.sh`
4. **Monitoring**: Check dashboards for issues

## 🖖 **Live Long and Prosper!**

Your Star Trek TNG Agile Project Manager is now:
- ✅ **Fully Automated**: One-command deployment
- ✅ **Production Ready**: Live on Vercel
- ✅ **Database Connected**: Supabase integration
- ✅ **Secure**: Proper secret management
- ✅ **Scalable**: Ready for growth

**The final frontier awaits! 🚀** 