# 🐛 Troubleshooting Guide

> **Complete troubleshooting guide for AlexAI Multimodal Agency**

## 🚨 Emergency Procedures

### System Completely Down
```bash
# 1. Check if development server is running
ps aux | grep "next dev" | grep -v grep

# 2. If not running, start it
npm run dev

# 3. Check for port conflicts
lsof -i :3000 -i :3001 -i :3002

# 4. Kill conflicting processes
lsof -ti:3000 | xargs kill -9

# 5. Clean build and restart
rm -rf .next
npm run build
npm run dev
```

### AI Agents Not Responding
```bash
# 1. Check AI system status
curl -X GET http://localhost:3000/api/ai-agents/status

# 2. Restart AI system
npm run restart:ai-system

# 3. Check AI agent logs
tail -f logs/ai-agents.log

# 4. Verify environment variables
echo $OPENAI_API_KEY
echo $SUPABASE_URL
```

## 🔧 Common Issues & Solutions

### 1. TypeScript Compilation Errors

#### Error: "Cannot find module '@/lib/...'"
**Problem**: Import paths are incorrect after file structure changes.

**Solution**:
```bash
# Update import paths from @/lib/ to @/core/
find src -name "*.tsx" -exec sed -i '' 's/@\/lib\//@\/core\//g' {} \;
find src -name "*.ts" -exec sed -i '' 's/@\/lib\//@\/core\//g' {} \;

# Or manually fix specific files
# Change: import { something } from '@/lib/utils';
# To: import { something } from '@/core/utils';
```

#### Error: "Module has no default export"
**Problem**: Component is trying to import a default export that doesn't exist.

**Solution**:
```typescript
// Check the component's export pattern
// If it uses named exports:
export { ComponentName } from './ComponentName';

// If it uses default exports:
export { default as ComponentName } from './ComponentName';

// Or fix the import:
// Change: import ComponentName from '@/core/components/ComponentName';
// To: import { ComponentName } from '@/core/components/ComponentName';
```

#### Error: "Property does not exist on type"
**Problem**: TypeScript interface is missing properties or has incorrect types.

**Solution**:
```typescript
// Check the interface definition
interface MyInterface {
  // Add missing properties
  missingProperty: string;
  // Fix incorrect types
  count: number; // not string
}

// Or use type assertion (temporary fix)
const data = response.data as MyInterface;
```

### 2. Build & Runtime Errors

#### Error: "Build failed"
**Problem**: Build process is failing due to various issues.

**Solution**:
```bash
# 1. Clean build artifacts
rm -rf .next
rm -rf node_modules

# 2. Reinstall dependencies
npm install

# 3. Check TypeScript compilation
npm run type-check

# 4. Try building again
npm run build

# 5. If still failing, check specific error messages
npm run build 2>&1 | grep -A 5 -B 5 "Error:"
```

#### Error: "Port already in use"
**Problem**: Another process is using the required port.

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001

# Check for multiple Next.js processes
ps aux | grep "next dev" | grep -v grep
pkill -f "next dev"
```

#### Error: "Module not found"
**Problem**: Dependencies are missing or corrupted.

**Solution**:
```bash
# 1. Check package.json for missing dependencies
cat package.json | grep -A 20 "dependencies"

# 2. Clear npm cache
npm cache clean --force

# 3. Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# 4. Check for peer dependency issues
npm ls
npm audit fix
```

### 3. AI Agent Issues

#### Agents Not Initializing
**Problem**: AI agents are failing to start or initialize.

**Solution**:
```bash
# 1. Check environment variables
echo $OPENAI_API_KEY
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# 2. Check AI system logs
tail -f logs/ai-agents.log

# 3. Test individual agent initialization
npm run ai:test-agent -- --agent=ship_computer

# 4. Restart AI system
npm run restart:ai-system

# 5. Check Supabase connection
npm run db:test-connection
```

#### Agent Collaboration Failures
**Problem**: AI agents are not communicating or collaborating properly.

**Solution**:
```bash
# 1. Check collaboration status
npm run ai:collaboration-status

# 2. Test agent communication
npm run ai:communication-test

# 3. Check collective memory system
npm run ai:memory-status

# 4. Restart collaboration engine
npm run ai:restart-collaboration

# 5. Verify agent registration
npm run ai:list-agents
```

#### Poor AI Recommendations
**Problem**: AI agents are providing low-quality or incorrect recommendations.

**Solution**:
```bash
# 1. Check agent performance metrics
npm run ai:performance-report

# 2. Analyze agent learning data
npm run ai:learning-analysis

# 3. Reset agent learning (if needed)
npm run ai:reset-learning

# 4. Check training data quality
npm run ai:validate-training-data

# 5. Monitor agent confidence scores
npm run ai:confidence-monitor
```

### 4. LCARS Interface Issues

#### Components Not Rendering
**Problem**: LCARS components are not displaying correctly.

**Solution**:
```bash
# 1. Check component imports
npm run type-check

# 2. Verify CSS is loading
curl -s http://localhost:3000 | grep -i "lcars"

# 3. Check browser console for errors
# Open DevTools (F12) and check Console tab

# 4. Verify component registration
# Check src/core/components/lcars/index.ts

# 5. Test individual components
npm run test -- --testPathPattern=lcars
```

#### Responsive Design Issues
**Problem**: LCARS interface is not adapting to different screen sizes.

**Solution**:
```typescript
// 1. Check breakpoint configuration
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
};

// 2. Verify responsive classes are applied
// Check if components have classes like 'lcars-mobile', 'lcars-desktop'

// 3. Test on different screen sizes
// Use browser DevTools device simulation

// 4. Check CSS media queries
// Verify @media rules are working correctly
```

#### Accessibility Issues
**Problem**: LCARS interface is not accessible to screen readers or keyboard navigation.

**Solution**:
```bash
# 1. Run accessibility audit
npm run test:accessibility

# 2. Check color contrast
npm run test:contrast

# 3. Verify ARIA labels
npm run test:aria

# 4. Test keyboard navigation
# Use Tab, Enter, Space, Arrow keys

# 5. Check screen reader compatibility
# Use browser DevTools Accessibility tab
```

### 5. n8n Integration Issues

#### Workflows Not Executing
**Problem**: n8n workflows are not running or completing.

**Solution**:
```bash
# 1. Check n8n status
curl -X GET http://localhost:5678/api/v1/health

# 2. Verify webhook endpoints
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{"workflowType": "test", "data": {}}'

# 3. Check n8n logs
tail -f ~/.n8n/logs/n8n.log

# 4. Verify API keys
echo $N8N_API_KEY
echo $N8N_WEBHOOK_SECRET

# 5. Test individual workflows
npm run n8n:test-workflow -- --workflow=youtube_analysis
```

#### Webhook Failures
**Problem**: Webhooks are not being received or processed.

**Solution**:
```bash
# 1. Check webhook signature verification
npm run n8n:verify-webhooks

# 2. Test webhook endpoint directly
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -H "x-n8n-signature: test-signature" \
  -d '{"workflowType": "test", "data": {}}'

# 3. Check webhook logs
tail -f logs/webhooks.log

# 4. Verify endpoint registration
# Check src/app/api/workflows/route.ts

# 5. Test with different payloads
npm run n8n:test-webhooks
```

#### Data Sync Issues
**Problem**: Data is not synchronizing between AlexAI and n8n.

**Solution**:
```bash
# 1. Check database connection
npm run db:test-connection

# 2. Verify real-time subscriptions
npm run n8n:check-subscriptions

# 3. Check data flow
npm run n8n:data-flow-test

# 4. Verify table permissions
npm run db:check-permissions

# 5. Test bilateral sync
npm run n8n:test-bilateral-sync
```

### 6. Database & Supabase Issues

#### Connection Failures
**Problem**: Cannot connect to Supabase database.

**Solution**:
```bash
# 1. Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
echo $SUPABASE_SERVICE_ROLE_KEY

# 2. Test connection
npm run db:test-connection

# 3. Check Supabase status
curl -X GET https://status.supabase.com/

# 4. Verify network connectivity
ping your-project.supabase.co

# 5. Check firewall settings
# Ensure outbound connections to port 443 are allowed
```

#### Real-time Issues
**Problem**: Real-time updates are not working.

**Solution**:
```bash
# 1. Check real-time subscriptions
npm run db:check-realtime

# 2. Verify table replication
npm run db:check-replication

# 3. Test real-time channels
npm run db:test-channels

# 4. Check WebSocket connections
# Use browser DevTools Network tab

# 5. Verify database triggers
npm run db:check-triggers
```

#### Performance Issues
**Problem**: Database queries are slow or timing out.

**Solution**:
```bash
# 1. Check query performance
npm run db:analyze-queries

# 2. Verify indexes
npm run db:check-indexes

# 3. Monitor connection pool
npm run db:connection-pool-status

# 4. Check for slow queries
npm run db:slow-query-log

# 5. Optimize database schema
npm run db:optimize-schema
```

## 🔍 Diagnostic Commands

### System Health Check
```bash
# Comprehensive system check
npm run system:health-check

# Check all services
npm run system:check-all

# Generate health report
npm run system:health-report > health-report.txt
```

### Performance Monitoring
```bash
# Monitor system performance
npm run monitor:performance

# Check memory usage
npm run monitor:memory

# Monitor CPU usage
npm run monitor:cpu

# Check network performance
npm run monitor:network
```

### Log Analysis
```bash
# Search logs for errors
npm run logs:search -- --query="error"

# Analyze log patterns
npm run logs:analyze

# Generate log summary
npm run logs:summary

# Export logs for analysis
npm run logs:export -- --format=json
```

## 🚀 Recovery Procedures

### Complete System Reset
```bash
# 1. Stop all services
pkill -f "next dev"
pkill -f "n8n"

# 2. Clean all build artifacts
rm -rf .next
rm -rf node_modules
rm -rf logs/*

# 3. Reset database (if needed)
npm run db:reset

# 4. Reinstall dependencies
npm install

# 5. Restart services
npm run dev &
n8n start &
```

### AI System Recovery
```bash
# 1. Reset AI agents
npm run ai:reset-all

# 2. Clear collective memory
npm run ai:clear-memory

# 3. Reinitialize agents
npm run ai:initialize

# 4. Test agent functionality
npm run ai:test-all

# 5. Restore from backup (if available)
npm run ai:restore-backup
```

### Database Recovery
```bash
# 1. Check database integrity
npm run db:check-integrity

# 2. Repair corrupted tables
npm run db:repair-tables

# 3. Restore from backup
npm run db:restore-backup

# 4. Rebuild indexes
npm run db:rebuild-indexes

# 5. Verify data consistency
npm run db:verify-consistency
```

## 📞 Getting Help

### When to Escalate
- **System completely down** for more than 15 minutes
- **Data loss** or corruption
- **Security breach** or unauthorized access
- **Performance degradation** affecting all users
- **AI agents** providing consistently incorrect responses

### Information to Collect
```bash
# System information
npm run system:info

# Error logs
npm run logs:errors

# Performance metrics
npm run monitor:metrics

# Configuration files
cat .env.local
cat package.json
cat tsconfig.json

# Recent changes
git log --oneline -10
```

### Support Channels
1. **Check this troubleshooting guide** first
2. **Review the documentation** in the `docs/` folder
3. **Check GitHub Issues** for similar problems
4. **Examine AI agent logs** for system insights
5. **Contact the development team** with collected information

## 🔮 Prevention

### Regular Maintenance
```bash
# Daily checks
npm run system:daily-check

# Weekly maintenance
npm run system:weekly-maintenance

# Monthly optimization
npm run system:monthly-optimization

# Quarterly review
npm run system:quarterly-review
```

### Monitoring Setup
```bash
# Set up automated monitoring
npm run monitor:setup

# Configure alerts
npm run monitor:configure-alerts

# Set up logging
npm run logs:setup

# Configure backups
npm run backup:setup
```

### Best Practices
1. **Always test changes** in development before production
2. **Monitor system health** regularly
3. **Keep dependencies updated** and secure
4. **Document all changes** and configurations
5. **Have backup and recovery procedures** ready

---

**🐛 This troubleshooting guide provides comprehensive solutions for common issues. Always start with the specific error you're encountering and work through the solutions systematically.**

*"The best troubleshooting is the troubleshooting you don't need." - Chief Engineer Montgomery Scott*
