#!/bin/bash

# 🖖 AlexAI Star Trek Agile System - Full CI/CD Pipeline Trigger
# Simple wrapper to trigger the comprehensive CI/CD pipeline

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 AlexAI Star Trek Agile System - Full CI/CD Pipeline${NC}"
echo -e "${BLUE}======================================================${NC}"
echo ""

# Check if deployment target is provided
DEPLOYMENT_TARGET="${1:-all}"

echo "Deployment target: $DEPLOYMENT_TARGET"
echo ""

# Validate deployment target
case "$DEPLOYMENT_TARGET" in
    "all"|"legacy"|"modern"|"docker"|"vercel")
        echo "✅ Valid deployment target"
        ;;
    *)
        echo "❌ Invalid deployment target: $DEPLOYMENT_TARGET"
        echo "Valid options: all, legacy, modern, docker, vercel"
        exit 1
        ;;
esac

echo ""
echo "Starting full CI/CD pipeline..."

# Run the full CI/CD deployment script
./scripts/deploy/full-cicd-deploy.sh ci-cd "$DEPLOYMENT_TARGET"

echo ""
echo -e "${GREEN}✅ CI/CD pipeline triggered successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Monitor the pipeline at: https://github.com/your-username/alexai_katra_transfer_package_remote_v7/actions"
echo "2. Check deployment status with: ./scripts/deploy/full-cicd-deploy.sh status"
echo "3. View logs in the GitHub Actions tab"
echo ""
echo "Live long and prosper! 🖖" 