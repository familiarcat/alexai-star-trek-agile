# 🚀 ALEXAI NCC-1701-B DEPLOYMENT PROCEDURES

## 🌟 **OVERVIEW**

This document provides step-by-step procedures for deploying AlexAI workflows from local development to production n8n instances. The bilateral sync system automates most of this process, but understanding the manual procedures is crucial for troubleshooting and advanced deployments.

## 🎯 **DEPLOYMENT ARCHITECTURE**

### **Current State**
```
Local Development ←→ Bilateral Sync ←→ Production n8n
     (Port 3000)         (Auto)         (n8n.pbradygeorgen.com)
```

### **Target State**
```
Local Development ←→ Bilateral Sync ←→ Production n8n ←→ Live Webhooks
     (Port 3000)         (Auto)         (n8n.pbradygeorgen.com)   (Public)
```

## 🔧 **PREREQUISITES**

### **1. Environment Setup**
- ✅ Local Next.js development environment running
- ✅ Bilateral sync system configured and running
- ✅ Production n8n instance accessible
- ✅ Valid API keys and credentials

### **2. Required Tools**
```bash
# Check available deployment tools
npm run

# Verify bilateral sync status
npm run sync:status

# Check production connectivity
curl -s "https://n8n.pbradygeorgen.com/api/v1/health"
```

### **3. Configuration Validation**
```bash
# Verify bilateral sync configuration
cat bilateral-sync/config.json

# Check environment variables
cat .env.local | grep -E "(N8N|OPENROUTER|API)"
```

## 🚀 **AUTOMATED DEPLOYMENT (RECOMMENDED)**

### **1. Start Bilateral Sync**
```bash
# Start the bilateral sync system
npm run sync:start &

# Monitor sync status
npm run sync:status

# Check real-time sync
npm run sync:monitor
```

### **2. Automatic Workflow Deployment**
The bilateral sync system automatically:
- ✅ Monitors local workflow changes
- ✅ Pushes updates to production within 60 seconds
- ✅ Handles conflict resolution
- ✅ Creates deployment snapshots
- ✅ Validates deployment success

### **3. Monitor Deployment Progress**
```bash
# Watch deployment logs
tail -f bilateral-sync/logs/sync-scheduler.log

# Check sync status
npm run sync:status

# Monitor production health
npm run sync:monitor
```

## 🛠️ **MANUAL DEPLOYMENT PROCEDURES**

### **1. Individual Workflow Deployment**

#### **Deploy Specific Workflow**
```bash
# Deploy a single workflow
npm run deploy:workflow

# Deploy specific workflow by name
npm run deploy:workflow -- --name="alexai-complete-crew-workflow"

# Force deploy with overwrite
npm run deploy:workflow -- --force --overwrite
```

#### **Deploy All Workflows**
```bash
# Deploy all workflows
npm run deploy:workflows

# Deploy with validation
npm run deploy:workflows -- --validate

# Deploy with backup
npm run deploy:workflows -- --backup
```

### **2. Workflow Activation**

#### **Activate Deployed Workflows**
```bash
# Activate all workflows
npm run activate:workflow

# Activate specific workflow
npm run activate:workflow -- --name="alexai-complete-crew-workflow"

# Activate with health check
npm run activate:workflow -- --health-check
```

#### **Verify Activation**
```bash
# Check workflow status
npm run n8n:status

# Verify webhook endpoints
curl -X POST "https://n8n.pbradygeorgen.com/webhook/crew-request" \
  -H "Content-Type: application/json" \
  -d '{"test":"activation","query":"test"}'
```

### **3. Production Validation**

#### **Health Check Procedures**
```bash
# Check n8n instance health
curl -s "https://n8n.pbradygeorgen.com/api/v1/health"

# Test webhook endpoints
curl -X POST "https://n8n.pbradygeorgen.com/webhook/crew-request" \
  -H "Content-Type: application/json" \
  -d '{"test":"health","query":"system status"}'

# Validate crew member endpoints
curl -X POST "https://n8n.pbradygeorgen.com/webhook/captain-picard" \
  -H "Content-Type: application/json" \
  -d '{"query":"strategic assessment","context":"deployment validation"}'
```

#### **Performance Testing**
```bash
# Load test webhook endpoints
npm run test:load -- --endpoint="crew-request" --requests=100

# Performance benchmark
npm run test:performance -- --workflow="alexai-complete-crew-workflow"

# Response time analysis
npm run test:response -- --endpoint="crew-request"
```

## 🔄 **DEPLOYMENT WORKFLOWS**

### **1. Complete System Deployment**

#### **Phase 1: Core Workflows**
```bash
# Deploy core crew coordination workflows
npm run deploy:workflow -- --priority="core"

# Activate core workflows
npm run activate:workflow -- --priority="core"

# Validate core functionality
npm run test:core -- --production
```

#### **Phase 2: Integration Workflows**
```bash
# Deploy AI integration workflows
npm run deploy:workflow -- --priority="integration"

# Activate integration workflows
npm run activate:workflow -- --priority="integration"

# Validate AI integrations
npm run test:integration -- --production
```

#### **Phase 3: Enhancement Workflows**
```bash
# Deploy enhancement workflows
npm run deploy:workflow -- --priority="enhancement"

# Activate enhancement workflows
npm run activate:workflow -- --priority="enhancement"

# Validate enhancements
npm run test:enhancement -- --production
```

### **2. Incremental Deployment**

#### **Safe Deployment Strategy**
```bash
# Deploy to staging first (if available)
npm run deploy:workflow -- --environment="staging"

# Test in staging
npm run test:workflow -- --environment="staging"

# Deploy to production
npm run deploy:workflow -- --environment="production"

# Validate production deployment
npm run test:workflow -- --environment="production"
```

#### **Rollback Procedures**
```bash
# Create deployment backup
npm run deploy:backup -- --name="pre-deployment-backup"

# Rollback to previous version
npm run deploy:rollback -- --backup="pre-deployment-backup"

# Verify rollback success
npm run test:workflow -- --environment="production"
```

## 📊 **DEPLOYMENT MONITORING**

### **1. Real-time Monitoring**

#### **Sync Status Monitoring**
```bash
# Monitor bilateral sync
npm run sync:monitor

# Check sync logs
npm run sync:logs

# Monitor deployment progress
npm run deploy:monitor
```

#### **Production Health Monitoring**
```bash
# Monitor production endpoints
npm run monitor:production

# Check workflow execution
npm run monitor:workflows

# Monitor system performance
npm run monitor:performance
```

### **2. Deployment Metrics**

#### **Success Metrics**
- ✅ **Deployment Success Rate**: >95%
- ✅ **Sync Completion Time**: <60 seconds
- ✅ **Workflow Activation Rate**: 100%
- ✅ **Webhook Response Time**: <2 seconds
- ✅ **Error Rate**: <1%

#### **Performance Metrics**
- 📊 **Throughput**: Requests per second
- 📊 **Latency**: Response time percentiles
- 📊 **Availability**: Uptime percentage
- 📊 **Resource Usage**: CPU, memory, network

## 🚨 **TROUBLESHOOTING DEPLOYMENT ISSUES**

### **1. Common Deployment Problems**

#### **Sync Failures**
```bash
# Check sync configuration
cat bilateral-sync/config.json

# Validate n8n connectivity
curl -s "https://n8n.pbradygeorgen.com/api/v1/health"

# Restart sync system
npm run sync:restart

# Check sync logs
tail -f bilateral-sync/logs/sync-scheduler.log
```

#### **Workflow Deployment Issues**
```bash
# Validate workflow syntax
npm run validate:workflows

# Check workflow dependencies
npm run check:dependencies

# Force workflow sync
npm run sync:force

# View deployment logs
npm run deploy:logs
```

#### **Production Connectivity Issues**
```bash
# Test production endpoints
curl -v "https://n8n.pbradygeorgen.com/webhook/crew-request"

# Check n8n instance status
npm run n8n:status

# Validate API keys
npm run validate:credentials

# Test webhook delivery
npm run test:webhook -- --endpoint="crew-request"
```

### **2. Advanced Troubleshooting**

#### **Debug Mode Deployment**
```bash
# Enable debug logging
export DEBUG=alexai:deployment

# Deploy with verbose output
npm run deploy:workflow -- --debug --verbose

# Check debug logs
tail -f bilateral-sync/logs/debug.log
```

#### **Network Diagnostics**
```bash
# Test network connectivity
npm run network:test

# Check DNS resolution
nslookup n8n.pbradygeorgen.com

# Test port connectivity
telnet n8n.pbradygeorgen.com 443

# Validate SSL certificate
openssl s_client -connect n8n.pbradygeorgen.com:443
```

## 🔐 **SECURITY CONSIDERATIONS**

### **1. API Key Management**
```bash
# Rotate API keys
npm run security:rotate-keys

# Validate key permissions
npm run security:validate-keys

# Check key expiration
npm run security:check-expiry

# Update credentials
npm run security:update-credentials
```

### **2. Access Control**
```bash
# Validate webhook security
npm run security:validate-webhooks

# Check authentication
npm run security:check-auth

# Validate permissions
npm run security:check-permissions
```

## 📈 **DEPLOYMENT OPTIMIZATION**

### **1. Performance Optimization**
```bash
# Optimize workflow execution
npm run optimize:workflows

# Performance analysis
npm run analyze:performance

# Resource optimization
npm run optimize:resources

# Cache optimization
npm run optimize:cache
```

### **2. Scalability Enhancement**
```bash
# Load balancing setup
npm run setup:load-balancing

# Auto-scaling configuration
npm run setup:auto-scaling

# Failover configuration
npm run setup:failover
```

## 🎯 **DEPLOYMENT CHECKLIST**

### **Pre-Deployment**
- [ ] **Environment Validation**: Verify all environments are accessible
- [ ] **Credential Check**: Validate API keys and credentials
- [ ] **Dependency Check**: Ensure all dependencies are available
- [ ] **Backup Creation**: Create deployment backup
- [ ] **Testing**: Run comprehensive local tests

### **During Deployment**
- [ ] **Sync Monitoring**: Monitor bilateral sync progress
- [ ] **Deployment Validation**: Verify each workflow deployment
- [ ] **Activation Check**: Ensure workflows are properly activated
- [ ] **Health Monitoring**: Monitor production health
- [ ] **Performance Tracking**: Track deployment performance

### **Post-Deployment**
- [ ] **Functionality Testing**: Test all deployed workflows
- [ ] **Performance Validation**: Validate performance metrics
- [ ] **Security Verification**: Verify security measures
- [ ] **Documentation Update**: Update deployment documentation
- [ ] **Monitoring Setup**: Configure production monitoring

## 🔮 **FUTURE ENHANCEMENTS**

### **1. Advanced Deployment Features**
- **Blue-Green Deployment**: Zero-downtime deployment strategy
- **Canary Deployment**: Gradual rollout with monitoring
- **Automated Rollback**: Intelligent rollback based on metrics
- **Deployment Analytics**: Advanced deployment insights

### **2. Enhanced Monitoring**
- **Real-time Dashboards**: Live deployment monitoring
- **Predictive Analytics**: AI-powered deployment prediction
- **Automated Alerts**: Intelligent alerting system
- **Performance Optimization**: Automated performance tuning

## 📚 **ADDITIONAL RESOURCES**

### **Documentation**
- [N8N Workflow Architecture](../architecture/N8N_WORKFLOW_ARCHITECTURE.md)
- [Workflow Dependency Map](../architecture/WORKFLOW_DEPENDENCY_MAP.md)
- [Bilateral Sync System](../architecture/BILATERAL_SYNC_SYSTEM.md)

### **Scripts and Tools**
- **Deployment Scripts**: `scripts/deploy/`
- **Validation Tools**: `scripts/validation/`
- **Testing Framework**: `scripts/test/`
- **Monitoring Tools**: `scripts/monitoring/`

---

## 🎉 **CONCLUSION**

The AlexAI deployment procedures provide a comprehensive framework for deploying workflows from local development to production environments. The bilateral sync system automates most deployment tasks, while manual procedures provide control and troubleshooting capabilities.

**Key Benefits:**
- ✅ **Automated Deployment**: Seamless workflow synchronization
- ✅ **Comprehensive Validation**: Thorough testing and validation
- ✅ **Rollback Protection**: Safe deployment with rollback capability
- ✅ **Performance Monitoring**: Continuous performance tracking
- ✅ **Security Integration**: Built-in security validation

**Next Steps:**
1. **Deploy Core Workflows**: Deploy essential workflows to production
2. **Validate Production**: Test all production endpoints and functionality
3. **Monitor Performance**: Establish baseline performance metrics
4. **Document Procedures**: Update deployment procedures based on experience
5. **Optimize Process**: Continuously improve deployment efficiency

---

*This document should be updated as deployment procedures evolve. For questions or updates, consult the bilateral sync system or contact the development team.*
