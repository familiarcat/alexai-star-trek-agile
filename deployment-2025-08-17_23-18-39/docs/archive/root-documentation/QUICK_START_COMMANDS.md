# 🚀 Quick Start Commands for New Assistant

## **Project Status**
- **Technology**: Node.js Express (migrated from Python Flask)
- **Design**: Authentic LCARS (Star Trek: TNG) UI/UX
- **Database**: SQLite3
- **Deployment**: Vercel
- **Current Issue**: Remote deployment showing old template variables

## **Essential Commands**

### **1. Check Current State**
```bash
# Verify you're in the right directory
ls -la server.js package.json

# Check Git status
git status
git log -1 --oneline

# Check if local server is running
curl http://localhost:8000/api/health
```

### **2. Start Local Development**
```bash
# Kill any existing processes
pkill -f "node server.js" || true

# Start server
node server.js

# Or use the deployment script
./scripts/deploy/unified-deploy.sh local
```

### **3. Test API Endpoints**
```bash
# Health check
curl http://localhost:8000/api/health

# Dashboard stats
curl http://localhost:8000/api/dashboard/stats

# Projects list
curl http://localhost:8000/api/projects

# Create mock data
curl -X POST http://localhost:8000/api/database/mock
```

### **4. Fix Remote Deployment**
```bash
# Force Vercel redeployment
vercel --prod --force

# Check remote status
curl https://alexaikatratransferpackageremotev7-dhxsp88vi-pbradygeorgen.vercel.app/api/health
```

### **5. Open Environments**
```bash
# Local
open http://localhost:8000

# Remote
open https://alexaikatratransferpackageremotev7-dhxsp88vi-pbradygeorgen.vercel.app
```

## **Key Files to Understand**

### **Backend**
- `server.js` - Main Express server with API routes
- `src/core/AgileProjectManager.js` - Database operations
- `src/core/AlexAICore.js` - AI integration

### **Frontend**
- `public/index.html` - Dashboard (main page)
- `public/projects.html` - Projects list
- `public/assets/lcars.css` - LCARS design system
- `public/assets/data-translator.js` - Unified data layer

### **Configuration**
- `vercel.json` - Vercel deployment config
- `package.json` - Node.js dependencies
- `scripts/deploy/unified-deploy.sh` - Deployment script

## **Current Problem**
The remote environment is showing `{{ metrics.total_projects }}` template variables instead of real data. This means the Vercel deployment hasn't picked up the latest changes that include the unified data translation layer.

## **Solution**
Force a Vercel redeployment to ensure the latest JavaScript changes are deployed.

## **Success Criteria**
- Local and remote environments show identical data
- No template variables visible in either environment
- All API endpoints working on both environments
- LCARS design system properly applied 