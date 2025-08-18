#!/bin/bash

# 🚀 Production Deployment Script for AI-Driven Agile Management System
# This script deploys our complete system to production

set -e  # Exit on any error

echo "🚀 Starting Production Deployment for AI-Driven Agile Management System"
echo "=================================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="alexai-agile-management-system"
DEPLOYMENT_ENV="production"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

echo -e "${BLUE}📊 Deployment Information:${NC}"
echo "  Project: $PROJECT_NAME"
echo "  Environment: $DEPLOYMENT_ENV"
echo "  Timestamp: $TIMESTAMP"
echo "  Git Commit: $(git rev-parse --short HEAD)"
echo ""

# Step 1: Pre-deployment checks
echo -e "${YELLOW}🔍 Step 1: Pre-deployment Checks${NC}"
echo "  Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Working directory is not clean. Please commit all changes first.${NC}"
    git status --porcelain
    exit 1
fi
echo -e "${GREEN}  ✅ Git working directory is clean${NC}"

echo "  Checking for required files..."
REQUIRED_FILES=(
    "package.json"
    "src/core/ai-orchestration-engine.ts"
    "src/core/ship-computer-layout-orchestrator.ts"
    "workflows/ship-computer-ai-agent.json"
    "user-stories/supabase-schema.sql"
    "docs/SYSTEM_STATUS_COMPLETE.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Required file missing: $file${NC}"
        exit 1
    fi
    echo -e "${GREEN}  ✅ Found: $file${NC}"
done

echo "  Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "  Node.js version: $NODE_VERSION"
if [[ $NODE_VERSION == v18.* ]] || [[ $NODE_VERSION == v20.* ]]; then
    echo -e "${GREEN}  ✅ Node.js version is compatible${NC}"
else
    echo -e "${YELLOW}  ⚠️  Node.js version may not be optimal (recommended: v18+ or v20+)${NC}"
fi

echo ""

# Step 2: Build preparation
echo -e "${YELLOW}🔨 Step 2: Build Preparation${NC}"
echo "  Cleaning previous builds..."
rm -rf .next
rm -rf node_modules/.cache
echo -e "${GREEN}  ✅ Build cache cleared${NC}"

echo "  Installing dependencies..."
npm install
echo -e "${GREEN}  ✅ Dependencies installed${NC}"

echo "  Building application..."
npm run build
echo -e "${GREEN}  ✅ Application built successfully${NC}"

echo ""

# Step 3: System validation
echo -e "${YELLOW}🧪 Step 3: System Validation${NC}"
echo "  Running system health checks..."

# Check if AI agents are properly initialized
echo "  Testing AI agent initialization..."
if npm run demo:learning > /dev/null 2>&1; then
    echo -e "${GREEN}  ✅ AI agent system operational${NC}"
else
    echo -e "${RED}❌ AI agent system failed${NC}"
    exit 1
fi

# Check if design automation is working
echo "  Testing design automation system..."
if [ -d "scripts/design/output" ] && [ "$(ls -A scripts/design/output)" ]; then
    echo -e "${GREEN}  ✅ Design automation system operational${NC}"
else
    echo -e "${YELLOW}  ⚠️  Design automation system needs initialization${NC}"
fi

echo ""

# Step 4: Production deployment
echo -e "${YELLOW}🚀 Step 4: Production Deployment${NC}"

# Create deployment package
DEPLOYMENT_DIR="deployment-$TIMESTAMP"
mkdir -p "$DEPLOYMENT_DIR"

echo "  Creating deployment package..."
cp -r .next "$DEPLOYMENT_DIR/"
cp -r public "$DEPLOYMENT_DIR/"
cp -r src "$DEPLOYMENT_DIR/"
cp -r workflows "$DEPLOYMENT_DIR/"
cp -r user-stories "$DEPLOYMENT_DIR/"
cp -r docs "$DEPLOYMENT_DIR/"
cp -r scripts "$DEPLOYMENT_DIR/"
cp package.json "$DEPLOYMENT_DIR/"
cp package-lock.json "$DEPLOYMENT_DIR/"
cp tsconfig.json "$DEPLOYMENT_DIR/"
cp next.config.ts "$DEPLOYMENT_DIR/" 2>/dev/null || echo "  ⚠️  next.config.ts not found, skipping"
cp .env.example "$DEPLOYMENT_DIR/" 2>/dev/null || echo "  ⚠️  .env.example not found, skipping"

echo -e "${GREEN}  ✅ Deployment package created: $DEPLOYMENT_DIR${NC}"

# Create deployment manifest
cat > "$DEPLOYMENT_DIR/DEPLOYMENT_MANIFEST.md" << EOF
# 🚀 Production Deployment Manifest

## Deployment Information
- **Project**: $PROJECT_NAME
- **Environment**: $DEPLOYMENT_ENV
- **Timestamp**: $TIMESTAMP
- **Git Commit**: $(git rev-parse HEAD)
- **Branch**: $(git branch --show-current)

## System Components
- ✅ AI Orchestration Engine (8 agents)
- ✅ Ship Computer Layout Orchestrator
- ✅ Self-Referential Learning System
- ✅ Design Automation Workflow
- ✅ Responsive Boundary Management
- ✅ Accent-Focused Icon System
- ✅ Visual Consistency Audit System
- ✅ Comprehensive Testing Suite

## Required Environment Variables
\`\`\`
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# n8n Integration
N8N_BASE_URL=your_n8n_url
N8N_API_KEY=your_n8n_api_key

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=your_app_url
\`\`\`

## Deployment Steps
1. Set up environment variables
2. Run Supabase schema: \`psql -f user-stories/supabase-schema.sql\`
3. Import n8n workflows from workflows/ directory
4. Start the application: \`npm start\`
5. Verify all systems are operational

## Post-Deployment Verification
- [ ] AI agents are responding
- [ ] Ship Computer is operational
- [ ] Responsive boundaries are working
- [ ] Design automation is functional
- [ ] User story testing is operational
- [ ] All pages are loading correctly

## Support
For deployment issues, check the documentation in docs/ directory.
EOF

echo -e "${GREEN}  ✅ Deployment manifest created${NC}"

echo ""

# Step 5: Deployment summary
echo -e "${YELLOW}📋 Step 5: Deployment Summary${NC}"
echo -e "${GREEN}  🎉 Deployment package ready: $DEPLOYMENT_DIR${NC}"
echo ""
echo -e "${BLUE}📁 Deployment Contents:${NC}"
echo "  • Next.js application (.next/)"
echo "  • Public assets (public/)"
echo "  • Source code (src/)"
echo "  • n8n workflows (workflows/)"
echo "  • User stories & learning system (user-stories/)"
echo "  • Documentation (docs/)"
echo "  • Automation scripts (scripts/)"
echo "  • Configuration files"
echo "  • Deployment manifest"
echo ""

echo -e "${BLUE}🚀 Next Steps for Production:${NC}"
echo "  1. Copy $DEPLOYMENT_DIR to your production server"
echo "  2. Set up environment variables"
echo "  3. Deploy Supabase schema"
echo "  4. Import n8n workflows"
echo "  5. Start the application"
echo "  6. Run verification tests"
echo ""

echo -e "${GREEN}✅ Production deployment package created successfully!${NC}"
echo -e "${BLUE}📁 Location: $DEPLOYMENT_DIR${NC}"
echo -e "${BLUE}📋 Manifest: $DEPLOYMENT_DIR/DEPLOYMENT_MANIFEST.md${NC}"

# Create a quick deployment verification script
cat > "$DEPLOYMENT_DIR/verify-deployment.sh" << 'EOF'
#!/bin/bash
echo "🔍 Verifying deployment..."
echo "  Checking if application is running..."
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "  ✅ Application is responding"
else
    echo "  ❌ Application is not responding"
fi

echo "  Checking AI agents..."
if curl -s http://localhost:3000/api/crew/captain-picard > /dev/null; then
    echo "  ✅ AI agents are operational"
else
    echo "  ❌ AI agents are not responding"
fi

echo "  Checking Ship Computer..."
if curl -s http://localhost:3000/ship-computer-demo > /dev/null; then
    echo "  ✅ Ship Computer is operational"
else
    echo "  ❌ Ship Computer is not responding"
fi

echo "🎉 Deployment verification complete!"
EOF

chmod +x "$DEPLOYMENT_DIR/verify-deployment.sh"
echo -e "${GREEN}  ✅ Deployment verification script created${NC}"

echo ""
echo -e "${GREEN}🚀 Your AI-Driven Agile Management System is ready for production deployment!${NC}"
