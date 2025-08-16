# 🚀 Ship Computer Testing Guide

## 🎯 Overview

This guide helps you test the Ship Computer's ability to dynamically generate UI based on user intent, with all multimodal agents active in the n8n bidirectional framework.

## 🚀 Quick Start

### 1. Start Local Testing
```bash
# Start the development server and testing environment
./start-ship-computer-testing.sh
```

### 2. Run Comprehensive Tests
```bash
# Test all multimodal agents and UI generation
./scripts/test/test-ship-computer-multimodal.sh

# Test enhanced ship agency
./scripts/test/test-enhanced-ship-agency.sh
```

## 🧪 Test Scenarios

### Strategic Leadership Mission
- **Query**: "Develop diplomatic strategy for first contact with unknown species"
- **Expected Crew**: Captain Picard + Commander Spock
- **Expected UI**: Strategic command layout

### Technical Engineering Mission
- **Query**: "Analyze warp core efficiency and optimize power distribution"
- **Expected Crew**: Lieutenant Data + Chief Engineer Scott
- **Expected UI**: Engineering technical layout

### Tactical Security Mission
- **Query**: "Assess security protocols for entering hostile territory"
- **Expected Crew**: Lieutenant Worf
- **Expected UI**: Tactical security layout

### Emotional Intelligence Mission
- **Query**: "Help resolve crew conflict in engineering department"
- **Expected Crew**: Counselor Troi
- **Expected UI**: Counseling empathetic layout

### Scientific Analysis Mission
- **Query**: "Comprehensive analysis of unknown spatial anomaly"
- **Expected Crew**: Lieutenant Data + Observation Lounge
- **Expected UI**: Scientific research layout

### Critical Emergency Mission
- **Query**: "Critical system failure - warp core breach imminent"
- **Expected Crew**: All Crew
- **Expected UI**: Emergency critical layout

## 🎨 UI Preferences Testing

Test different interface preferences:
- `minimal` - Quick status check
- `detailed` - Detailed system analysis
- `emergency` - Emergency protocol
- `training` - Training simulation
- `research` - Research mode
- `command-focused` - Strategic leadership
- `technical-detailed` - Engineering tasks
- `tactical-focused` - Security operations
- `empathetic-focused` - Counseling tasks
- `scientific-detailed` - Research analysis
- `coordination-focused` - Multi-crew operations
- `data-focused` - Data analysis
- `diplomatic-focused` - Negotiation tasks
- `integration-focused` - System integration

## 🔧 Configuration

### Environment Variables
Set these in your `~/.zshrc` or `.env.local`:
```bash
export OPENROUTER_API_KEY="your-openrouter-api-key"
export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
```

### Test Configuration
The test configuration is stored in `test-config.json` and includes:
- Test scenarios with expected crew and UI layouts
- UI preference options
- Local testing settings

## 🚀 Testing Workflow

### 1. Local Development
```bash
# Start development server
npm run dev

# Access Ship Computer UI
open http://localhost:3000
```

### 2. Run Tests
```bash
# Comprehensive testing
./scripts/test/test-ship-computer-multimodal.sh

# Specific scenario testing
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ships-computer" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Test query",
    "context": "testing",
    "userRole": "developer",
    "urgency": "low",
    "complexity": "low"
  }'
```

### 3. Analyze Results
- Review test output for crew selection accuracy
- Check UI layout generation quality
- Monitor response times and performance
- Identify areas for improvement

## 🔍 Debugging

### Check n8n Workflows
1. Visit https://n8n.pbradygeorgen.com
2. Check workflow execution logs
3. Verify webhook endpoints are active
4. Review environment variable configuration

### Local Debugging
1. Check browser console for errors
2. Review Next.js development logs
3. Verify environment variables are loaded
4. Check network requests in browser dev tools

## 📊 Expected Results

### Successful Test Run
- All tests pass with green checkmarks
- Crew selection matches expected patterns
- UI layout generation produces valid responses
- Response times under 5 seconds
- Error handling works gracefully

### Common Issues
- **Webhook failures**: Check n8n workflow status
- **Authentication errors**: Verify API keys
- **Timeout issues**: Check network connectivity
- **Invalid responses**: Review workflow logic

## 🎯 Next Steps

After successful testing:

1. **Refine Logic**: Use test results to improve crew selection
2. **Optimize UI**: Enhance layout generation based on feedback
3. **Performance**: Optimize response times and reliability
4. **Deploy**: Push improvements to production n8n instance
5. **Monitor**: Set up ongoing testing and monitoring

## 🖖 Live Long and Prosper!

The Ship Computer is ready to serve the Enterprise and its crew. May your testing be thorough and your discoveries be enlightening!
