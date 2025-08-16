# 🚀 Full CI/CD Pipeline Setup Guide

## Overview

The AlexAI Star Trek Agile System now features a comprehensive CI/CD pipeline that handles multiple deployment targets and environments. This guide covers everything you need to know about setting up and using the full CI/CD pipeline.

## 🎯 Deployment Targets

The pipeline supports multiple deployment targets:

- **Legacy**: Original JavaScript version with Express.js
- **Modern**: Next.js 15 version with TypeScript
- **Docker**: Containerized deployment
- **Vercel**: Serverless deployment platform
- **All**: Deploy all versions simultaneously

## 📋 Prerequisites

### Required Tools

1. **GitHub CLI** (`gh`)
   ```bash
   # macOS
   brew install gh
   
   # Ubuntu/Debian
   sudo apt install gh
   
   # Windows
   winget install GitHub.cli
   ```

2. **Node.js** (v20+)
   ```bash
   # Using nvm
   nvm install 20
   nvm use 20
   ```

3. **Docker** (for Docker deployments)
   ```bash
   # macOS
   brew install --cask docker
   
   # Ubuntu
   sudo apt install docker.io
   ```

4. **Vercel CLI** (for Vercel deployments)
   ```bash
   npm install -g vercel
   ```

### Required Secrets

Set up the following GitHub repository secrets:

```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_PROJECT_ID_MODERN=your_modern_vercel_project_id

# Docker Hub Configuration
DOCKERHUB_USERNAME=your_dockerhub_username
DOCKERHUB_TOKEN=your_dockerhub_token

# Optional: Slack/Discord webhooks for notifications
SLACK_WEBHOOK_URL=your_slack_webhook_url
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

## 🚀 Quick Start

### 1. Trigger Full CI/CD Pipeline

```bash
# Deploy all versions
./deploy-full-cicd.sh all

# Deploy only modern Next.js version
./deploy-full-cicd.sh modern

# Deploy only legacy JavaScript version
./deploy-full-cicd.sh legacy

# Deploy only Docker image
./deploy-full-cicd.sh docker
```

### 2. Manual Deployment Options

```bash
# Local development server
./scripts/deploy/full-cicd-deploy.sh local

# Vercel deployment
./scripts/deploy/full-cicd-deploy.sh vercel

# Docker deployment
./scripts/deploy/full-cicd-deploy.sh docker

# Check deployment status
./scripts/deploy/full-cicd-deploy.sh status
```

## 🔧 Pipeline Configuration

### GitHub Actions Workflow

The main workflow file is located at `.github/workflows/full-cicd-pipeline.yml` and includes:

#### Jobs Overview

1. **Setup**: Determines deployment targets and conditions
2. **Legacy Lint & Test**: Code quality checks for JavaScript version
3. **Legacy Build**: Builds the legacy application
4. **Modern Lint & Test**: Code quality checks for Next.js version
5. **Modern Build**: Builds the Next.js application
6. **Docker Build**: Creates Docker image
7. **Deploy Legacy Vercel**: Deploys legacy version to Vercel
8. **Deploy Modern Vercel**: Deploys modern version to Vercel
9. **Deploy Docker**: Pushes Docker image to Docker Hub
10. **Integration Tests**: Runs end-to-end tests
11. **Performance Tests**: Runs Lighthouse CI tests
12. **Notifications**: Success/failure notifications

#### Conditional Execution

The pipeline uses smart conditional execution:

- **Main branch**: Deploys all versions to production
- **Develop branch**: Deploys only modern version
- **Feature branches**: Runs tests only (no deployment)
- **Manual trigger**: Allows selecting specific deployment targets

### Environment Configuration

#### Production Environment

```yaml
environment: production
```

Requires approval for deployments to production.

#### Preview Environment

```yaml
environment: preview
```

Used for staging and testing deployments.

## 📊 Monitoring & Observability

### GitHub Actions Dashboard

Monitor pipeline execution at:
```
https://github.com/your-username/alexai_katra_transfer_package_remote_v7/actions
```

### Deployment URLs

After successful deployment:

- **Legacy Dashboard**: `https://alexai-star-trek.vercel.app`
- **Modern Dashboard**: `https://alexai-nextjs-modern.vercel.app`
- **Docker Image**: `your-username/alexai-star-trek:latest`

### Health Checks

The pipeline includes comprehensive health checks:

```bash
# API Health Check
curl https://alexai-star-trek.vercel.app/api/health

# Docker Health Check
docker run --rm alexai-star-trek:latest curl -f http://localhost:8000/api/health
```

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: Individual component testing
2. **Integration Tests**: API endpoint testing
3. **Performance Tests**: Lighthouse CI analysis
4. **Security Tests**: npm audit and vulnerability scanning

### Test Execution

```bash
# Run all tests
npm test

# Run specific test types
npm test -- --testPathPattern=unit
npm test -- --testPathPattern=integration

# Run performance tests
npm run test:performance
```

## 🔒 Security Considerations

### Secrets Management

- All sensitive data is stored in GitHub Secrets
- No hardcoded credentials in the codebase
- Environment-specific configurations

### Security Scanning

The pipeline includes:

- **npm audit**: Dependency vulnerability scanning
- **CodeQL**: Static code analysis
- **Container scanning**: Docker image security analysis

### Access Control

- Production deployments require approval
- Branch protection rules
- Required status checks

## 🚨 Troubleshooting

### Common Issues

#### 1. Missing Secrets

**Error**: `Error: Missing required secret: VERCEL_TOKEN`

**Solution**: Add the required secret to your GitHub repository settings.

#### 2. Build Failures

**Error**: `Build failed with exit code 1`

**Solution**: Check the build logs for specific error messages and fix the underlying issues.

#### 3. Deployment Failures

**Error**: `Deployment failed`

**Solution**: 
- Verify Vercel project configuration
- Check environment variables
- Ensure proper permissions

#### 4. Docker Build Issues

**Error**: `Docker build failed`

**Solution**:
- Verify Dockerfile syntax
- Check for missing dependencies
- Ensure Docker daemon is running

### Debug Commands

```bash
# Check local environment
./scripts/deploy/full-cicd-deploy.sh status

# Test local deployment
./scripts/deploy/full-cicd-deploy.sh local

# Run tests locally
npm test

# Check Docker build
docker build -t test-image .
```

## 📈 Performance Optimization

### Build Optimization

- **Caching**: GitHub Actions cache for dependencies
- **Parallel Execution**: Independent jobs run in parallel
- **Artifact Management**: Efficient artifact sharing between jobs

### Deployment Optimization

- **Multi-stage Docker builds**: Reduced image size
- **Vercel Edge Functions**: Improved response times
- **CDN Integration**: Global content delivery

## 🔄 Continuous Improvement

### Metrics to Monitor

1. **Build Time**: Track pipeline execution time
2. **Deployment Frequency**: Measure deployment velocity
3. **Success Rate**: Monitor deployment success percentage
4. **Performance Scores**: Lighthouse CI metrics

### Optimization Opportunities

1. **Parallel Job Execution**: Identify sequential dependencies
2. **Cache Optimization**: Improve cache hit rates
3. **Test Optimization**: Reduce test execution time
4. **Deployment Strategy**: Implement blue-green deployments

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 🆘 Support

For issues with the CI/CD pipeline:

1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Create an issue in the repository
4. Contact the development team

---

**Live long and prosper! 🖖**

*This CI/CD pipeline ensures reliable, automated deployments for the AlexAI Star Trek Agile System across all supported platforms and environments.* 