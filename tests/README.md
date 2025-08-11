# AlexAI Comprehensive Agent Testing Framework

This directory contains a comprehensive testing framework for validating all AlexAI agents and n8n workflows with realistic mock data.

## 🎯 Overview

The testing framework provides end-to-end validation of:
- **Crew Agents**: Captain Picard, Lieutenant Data, Counselor Troi, Chief Engineer Scott, Commander Spock, Lieutenant Worf
- **Specialized Agents**: Ship's Computer, Multimodal Agency, Bilateral Learning, Enhanced Knowledge
- **Orchestration Agents**: Crew Coordination, Ship Agency, LLM Orchestration
- **N8N Workflows**: All automated workflows and integrations
- **Bilateral Sync System**: Cross-agent synchronization and learning
- **Integration Scenarios**: Complex multi-agent coordination

## 🚀 Quick Start

### 1. Generate Mock Data
```bash
# Generate realistic test data for all agents
./scripts/test/generate-mock-data.sh
```

### 2. Run Quick Tests
```bash
# Run rapid connectivity and basic functionality tests
./scripts/test/quick-test.sh
```

### 3. Run Comprehensive Tests
```bash
# Run full end-to-end test suite with all agents and workflows
./scripts/test/run-comprehensive-agent-test.sh
```

## 📁 Directory Structure

```
tests/
├── README.md                           # This file
├── requirements.txt                    # Python dependencies
├── integration/                        # Integration tests
│   ├── comprehensive_agent_workflow_test.py  # Main test suite
│   ├── test_end_to_end.py            # Legacy end-to-end tests
│   └── ...                           # Other integration tests
├── fixtures/                          # Test data and fixtures
│   └── mock-data/                    # Generated mock data
│       ├── crew_agents.json          # Star Trek crew agent data
│       ├── specialized_agents.json   # Specialized AI agent data
│       ├── orchestration_agents.json # Coordination agent data
│       ├── workflow_validation.json  # N8N workflow test data
│       ├── integration_scenarios.json # Complex scenario data
│       ├── test_config.json          # Test configuration
│       └── README.md                 # Mock data documentation
├── reports/                           # Test execution reports
├── unit/                             # Unit tests
└── e2e/                              # End-to-end tests
```

## 🧪 Test Categories

### 1. Agent API Testing
- **Crew Agents**: Test all Star Trek crew member endpoints
- **Specialized Agents**: Test AI and automation agents
- **Orchestration Agents**: Test coordination and management agents

### 2. N8N Workflow Testing
- **Workflow Execution**: Test all automated workflows
- **Response Validation**: Verify workflow output structure
- **Performance Testing**: Measure response times and throughput

### 3. Bilateral Sync Testing
- **Sync Status**: Verify cross-agent synchronization
- **Learning Progress**: Test knowledge sharing between agents
- **System Health**: Monitor overall system status

### 4. Integration Testing
- **Multi-Agent Coordination**: Test complex mission scenarios
- **Knowledge Synthesis**: Validate cross-domain learning
- **Emergency Response**: Test critical system scenarios

## 📊 Mock Data

The framework generates realistic mock data including:

### Crew Agent Scenarios
- **Captain Picard**: Diplomatic missions, strategic decisions
- **Lieutenant Data**: Technical analysis, alien technology assessment
- **Counselor Troi**: Psychological profiling, species analysis
- **Chief Engineer Scott**: Engineering emergencies, system repairs
- **Commander Spock**: Logical analysis, temporal paradoxes
- **Lieutenant Worf**: Security protocols, hostile environments

### Specialized Agent Scenarios
- **Ship's Computer**: Database queries, historical analysis
- **Multimodal Agency**: Visual data analysis, pattern recognition
- **Bilateral Learning**: Cross-agent knowledge synthesis
- **Enhanced Knowledge**: Knowledge base expansion, discovery integration

### Integration Scenarios
- **Multi-Agent Missions**: Complex coordination scenarios
- **Knowledge Synthesis**: Cross-domain learning and integration
- **Emergency Response**: Critical system failure scenarios

## 🔧 Configuration

### Test Environment
- **Local URL**: `http://localhost:8000` (AlexAI development server)
- **N8N URL**: `https://n8n.pbradygeorgen.com` (Workflow automation)
- **Timeouts**: Configurable for different test types
- **Retry Logic**: Automatic retry with exponential backoff

### Test Parameters
- **Test Depth**: Basic, standard, or comprehensive
- **Mock Execution**: Enable/disable realistic data simulation
- **Performance Metrics**: Response time, throughput, error rates
- **Validation Criteria**: Functionality, reliability, performance, security

## 📈 Test Reports

The framework generates detailed reports including:

### Summary Metrics
- Total tests executed
- Pass/fail statistics
- Success rate percentage
- Test duration and performance

### Category Breakdown
- Agent test results
- Workflow validation results
- Sync system status
- Integration scenario outcomes

### Detailed Results
- Individual test outcomes
- Performance metrics
- Error details and stack traces
- Recommendations for improvement

### Mock Data Summary
- Agents tested
- Workflows validated
- Scenarios covered
- Data quality metrics

## 🛠️ Customization

### Adding New Test Cases
1. Create new test methods in the test class
2. Add corresponding mock data to the fixtures
3. Update validation logic for new scenarios
4. Include in the main test suite

### Modifying Mock Data
1. Edit the appropriate JSON files in `fixtures/mock-data/`
2. Ensure data consistency with Star Trek universe
3. Maintain realistic complexity levels
4. Update documentation as needed

### Extending Test Coverage
1. Add new agent types to the mock data generator
2. Create new workflow validation tests
3. Implement additional integration scenarios
4. Enhance performance and security testing

## 🚨 Troubleshooting

### Common Issues

#### Local Server Not Running
```bash
# Start the development server
npm run dev
# or
yarn dev
```

#### Missing Python Dependencies
```bash
# Install required packages
pip install -r tests/requirements.txt
```

#### N8N Workflow Access Issues
- Verify n8n server is accessible
- Check webhook endpoint configurations
- Validate workflow permissions

#### Test Timeout Issues
- Increase timeout values in test configuration
- Check network connectivity
- Verify server performance

### Debug Mode
```bash
# Run tests with verbose output
python3 -v tests/integration/comprehensive_agent_workflow_test.py

# Run specific test categories
python3 tests/integration/comprehensive_agent_workflow_test.py --agent-tests-only
```

## 📋 Best Practices

### Test Execution
1. **Generate fresh mock data** before major test runs
2. **Run quick tests first** to verify basic connectivity
3. **Use comprehensive tests** for full validation
4. **Review reports** for actionable insights

### Data Management
1. **Keep mock data realistic** and consistent
2. **Update scenarios regularly** to cover new features
3. **Validate data quality** before test execution
4. **Version control** mock data changes

### Continuous Testing
1. **Integrate with CI/CD** for automated validation
2. **Run tests regularly** to catch regressions
3. **Monitor performance trends** over time
4. **Update test coverage** as system evolves

## 🔮 Future Enhancements

### Planned Features
- **Real-time monitoring** of agent performance
- **Automated test generation** from system logs
- **Machine learning** for test optimization
- **Advanced reporting** with visualizations

### Integration Opportunities
- **Grafana dashboards** for test metrics
- **Slack notifications** for test results
- **JIRA integration** for issue tracking
- **Performance benchmarking** against baselines

## 📞 Support

For questions or issues with the testing framework:

1. **Check the logs** in the test reports
2. **Review mock data** for consistency issues
3. **Verify system status** with quick tests
4. **Consult documentation** for configuration details

## 🖖 Live Long and Prosper

The AlexAI testing framework ensures your Star Trek-inspired AI system operates at peak efficiency. May your tests pass and your agents coordinate flawlessly!

---

*"The needs of the many outweigh the needs of the few... or the one."* - Spock
