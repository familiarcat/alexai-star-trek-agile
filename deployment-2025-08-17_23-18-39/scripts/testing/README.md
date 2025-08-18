# N8N Workflow Testing System 🧪

A comprehensive testing and cleanup system for N8N workflows that helps maintain a healthy, efficient automation environment.

## 🎯 Features

- **🧪 Comprehensive Workflow Testing**: Tests all active workflows with appropriate mock data
- **📊 Usage Analysis**: Identifies unused, inactive, and problematic workflows
- **🧹 Smart Cleanup**: Safely archives unused workflows with backup creation
- **🎭 Orchestrated Testing**: Unified interface for testing, analysis, and cleanup
- **📈 Detailed Reporting**: Comprehensive reports with recommendations and risk assessment
- **🔒 Safe Operations**: All destructive operations include backups and confirmation

## 🚀 Quick Start

### Prerequisites

1. **Node.js 16+** installed
2. **N8N API Key** configured in environment
3. **N8N instance** accessible

### Environment Setup

```bash
export N8N_API_KEY="your-n8n-api-key"
export N8N_BASE_URL="https://your-n8n-instance.com"
```

### Installation

```bash
cd scripts/testing
npm install
```

### Run Complete Testing

```bash
npm run test:all
```

## 📋 Available Commands

### Main Testing Commands

| Command | Description |
|---------|-------------|
| `npm run test:all` | Complete testing and cleanup workflow |
| `npm run test:workflows` | Test all active workflows only |
| `npm run test:cleanup` | Analyze and recommend cleanup actions |
| `npm run test:analysis` | Run both testing and cleanup analysis |

### Specialized Commands

| Command | Description |
|---------|-------------|
| `npm run test:quick` | Quick testing without cleanup analysis |
| `npm run test:cleanup-only` | Cleanup analysis only |
| `npm run test:non-interactive` | Non-interactive mode for automation |
| `npm run test:no-save` | Run without saving reports |

### Direct Script Execution

```bash
# Test orchestrator
node test-orchestrator.js complete

# Individual components
node workflow-testing-system.js
node workflow-cleanup-manager.js

# Specific phases
node test-orchestrator.js phase testing
node test-orchestrator.js phase cleanup
node test-orchestrator.js phase analysis
```

## 🏗️ System Architecture

### Core Components

1. **WorkflowTestingSystem** (`workflow-testing-system.js`)
   - Tests individual workflows with mock data
   - Analyzes execution patterns and error rates
   - Generates testing recommendations

2. **WorkflowCleanupManager** (`workflow-cleanup-manager.js`)
   - Identifies unused and problematic workflows
   - Safely archives workflows with backup creation
   - Generates cleanup recommendations

3. **TestOrchestrator** (`test-orchestrator.js`)
   - Coordinates testing and cleanup processes
   - Generates comprehensive reports
   - Provides unified management interface

### Mock Data System

The system automatically creates and manages mock data for different workflow types:

- **Webhook Triggers**: Simulated webhook payloads
- **Manual Triggers**: Test input data
- **Scheduled Triggers**: Timestamp-based data
- **API Integrations**: Mock API responses
- **File Operations**: Test file data
- **Database Operations**: Sample queries and data

## 📊 Understanding Reports

### Testing Report Structure

```json
{
  "timestamp": "2025-01-10T12:00:00.000Z",
  "summary": {
    "totalWorkflows": 15,
    "passed": 12,
    "failed": 2,
    "errors": 1,
    "successRate": 80.0
  },
  "testResults": [...],
  "recommendations": [...]
}
```

### Cleanup Report Structure

```json
{
  "timestamp": "2025-01-10T12:00:00.000Z",
  "summary": {
    "totalWorkflows": 15,
    "activeWorkflows": 12,
    "archivedWorkflows": 3,
    "recommendations": 5
  },
  "recommendations": [...],
  "archivedWorkflows": [...]
}
```

### Orchestration Report Structure

```json
{
  "timestamp": "2025-01-10T12:00:00.000Z",
  "summary": {...},
  "testing": {...},
  "cleanup": {...},
  "orchestration": {
    "recommendations": [...],
    "nextSteps": [...],
    "riskAssessment": [...]
  }
}
```

## 🔍 Workflow Analysis

### Usage Categories

- **High Usage**: 10+ executions per week
- **Medium Usage**: 5+ executions per month
- **Low Usage**: 1-4 executions per month
- **Inactive**: No executions in recent weeks
- **Unused**: No executions ever

### Complexity Assessment

- **Low**: ≤10 nodes, ≤15 connections
- **Medium**: 11-20 nodes, 16-30 connections
- **High**: >20 nodes, >30 connections

### Risk Assessment

- **🔴 High Risk**: Low test success rate, high error rates
- **🟡 Medium Risk**: Moderate issues, some workflows need attention
- **🟢 Low Risk**: Healthy system, minor optimizations possible

## 🛡️ Safety Features

### Backup System

- **Automatic Backups**: All workflows backed up before archiving
- **Timestamped Files**: Unique backup names with timestamps
- **Metadata Preservation**: Archive reasons and backup locations recorded

### Confirmation Prompts

- **Interactive Mode**: User confirmation for destructive operations
- **Non-Interactive Mode**: Safe for automation and CI/CD
- **Dry Run Options**: Preview changes without execution

### Error Handling

- **Graceful Degradation**: Continues operation despite individual failures
- **Detailed Logging**: Comprehensive error reporting and debugging
- **Rollback Information**: Backup paths and restoration instructions

## 🔧 Configuration

### Mock Data Customization

Edit `mock-data-registry.json` to customize test data:

```json
{
  "webhook-trigger": {
    "type": "webhook",
    "data": {
      "body": { "custom": "test data" },
      "headers": { "x-test": "true" }
    }
  }
}
```

### Testing Parameters

Adjust testing behavior via environment variables:

```bash
export N8N_TEST_DELAY=2000        # Delay between tests (ms)
export N8N_TEST_TIMEOUT=30000     # Test execution timeout (ms)
export N8N_MAX_CONCURRENT=3       # Maximum concurrent tests
```

## 📅 Recommended Usage Patterns

### Daily Operations
- Monitor workflow execution status
- Check for failed executions
- Review error logs

### Weekly Operations
- Run complete testing workflow
- Review testing reports
- Address high-priority issues

### Monthly Operations
- Run cleanup analysis
- Archive unused workflows
- Optimize high-complexity workflows
- Update mock data registry

### Quarterly Operations
- Comprehensive system health review
- Performance optimization
- Workflow consolidation planning

## 🚨 Troubleshooting

### Common Issues

1. **API Key Errors**
   ```bash
   export N8N_API_KEY="your-actual-key"
   ```

2. **Network Connectivity**
   ```bash
   curl -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows"
   ```

3. **Permission Issues**
   - Ensure N8N API key has read/write permissions
   - Check workflow ownership and access rights

4. **Timeout Issues**
   - Increase timeout values for complex workflows
   - Check N8N instance performance

### Debug Mode

Enable verbose logging:

```bash
export N8N_DEBUG=true
npm run test:all
```

### Manual Testing

Test individual components:

```bash
# Test specific workflow
node -e "
const WorkflowTestingSystem = require('./workflow-testing-system');
const system = new WorkflowTestingSystem();
system.testWorkflow({id: 'workflow-id', name: 'Test Workflow'});
"
```

## 🔄 Integration with CI/CD

### GitHub Actions Example

```yaml
name: N8N Workflow Testing
on: [schedule, workflow_dispatch]
jobs:
  test-workflows:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: |
          cd scripts/testing
          npm install
          npm run test:non-interactive
      - uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: scripts/testing/*.json
```

### Scheduled Testing

```bash
# Add to crontab for daily testing
0 2 * * * cd /path/to/project/scripts/testing && npm run test:non-interactive
```

## 📚 API Reference

### WorkflowTestingSystem

```javascript
const system = new WorkflowTestingSystem();

// Test all workflows
await system.runCompleteTest();

// Test specific workflow
await system.testWorkflow(workflow);

// Generate report
const report = system.generateTestingReport();
```

### WorkflowCleanupManager

```javascript
const manager = new WorkflowCleanupManager();

// Analyze workflows
await manager.runCompleteCleanup(false);

// Archive specific workflow
await manager.archiveWorkflow(workflow, 'reason');

// Generate recommendations
const recommendations = manager.generateCleanupRecommendations();
```

### TestOrchestrator

```javascript
const orchestrator = new TestOrchestrator();

// Run complete orchestration
await orchestrator.runCompleteOrchestration({
  runTesting: true,
  runCleanup: true,
  interactive: false,
  saveReports: true
});

// Run specific phase
await orchestrator.runPhase('testing');
```

## 🤝 Contributing

### Development Setup

```bash
git clone <repository>
cd scripts/testing
npm install
npm run test:all
```

### Code Style

- Use ES6+ features
- Follow JSDoc documentation standards
- Include comprehensive error handling
- Write unit tests for new features

### Testing New Features

```bash
# Test individual components
npm run test:system
npm run test:cleanup-manager

# Test orchestration
npm run test:orchestrator
```

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section
2. Review error logs and reports
3. Test individual components
4. Create detailed issue reports with logs

---

**Happy Testing! 🧪✨**
