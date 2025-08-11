# AlexAI Mock Data for Comprehensive Testing

This directory contains realistic mock data for testing all AlexAI agents and n8n workflows.

## File Structure

- `crew_agents.json` - Mock data for Star Trek crew agents
- `specialized_agents.json` - Mock data for specialized AI agents
- `orchestration_agents.json` - Mock data for coordination agents
- `workflow_validation.json` - Mock data for n8n workflow testing
- `integration_scenarios.json` - Mock data for complex integration tests
- `test_config.json` - Test configuration and settings

## Usage

These mock data files are automatically used by the comprehensive test suite:

```bash
# Run the comprehensive test suite
./scripts/test/run-comprehensive-agent-test.sh

# Or run the Python test directly
python3 tests/integration/comprehensive_agent_workflow_test.py
```

## Data Categories

### Crew Agents
- Captain Picard (Strategic Decision Making)
- Lieutenant Data (Technical Analysis)
- Counselor Troi (Psychological Assessment)
- Chief Engineer Scott (Engineering Solutions)
- Commander Spock (Logical Analysis)
- Lieutenant Worf (Security Protocols)

### Specialized Agents
- Ship's Computer (Database Operations)
- Multimodal Agency (Visual Data Analysis)
- Bilateral Learning (Cross-Agent Knowledge)
- Enhanced Knowledge (Knowledge Base Management)

### Orchestration Agents
- Crew Coordination (Mission Management)
- Ship Agency (Systems Automation)
- LLM Orchestration (Multi-LLM Coordination)

## Test Scenarios

The mock data includes realistic scenarios such as:
- Diplomatic missions
- Engineering emergencies
- Scientific discoveries
- Security threats
- Multi-agent coordination
- Knowledge synthesis
- Emergency response

## Customization

You can modify these mock data files to test specific scenarios or add new test cases. The test suite will automatically detect and use updated data.

## Validation

All mock data is validated for:
- Realistic Star Trek universe consistency
- Proper data structure and format
- Appropriate complexity levels
- Meaningful test scenarios
