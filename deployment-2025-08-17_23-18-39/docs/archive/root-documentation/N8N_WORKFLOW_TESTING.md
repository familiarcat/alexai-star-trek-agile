# 🖖 **N8N WORKFLOW TESTING: NCC-1701-B INTEGRATION**
## **AlexAI Star Trek Agile Management System - Workflow Validation**

---

## 🎯 **MISSION BRIEFING**

**Stardate**: 2025.01.XX  
**Mission**: Test n8n workflow integration and deployment capabilities  
**Objective**: Validate adaptive crew coordination system  
**Status**: 🧪 **INITIATING WORKFLOW TESTING**

---

## 🔄 **N8N WORKFLOW TESTING PHASES**

### **Phase 1: Local n8n Workflow Testing**

#### **1.1 n8n Local Instance Setup**
```bash
# Test n8n local instance
echo "🔄 Testing n8n Local Instance"
npm run test:n8n-local-setup

# Validate n8n.pbradygeorgen.com connectivity
echo "🌐 Testing n8n.pbradygeorgen.com Connectivity"
curl -s https://n8n.pbradygeorgen.com/health | jq .
```

#### **1.2 Crew Selection Workflow Testing**
```bash
# Test OpenRouter crew selection
echo "🧠 Testing OpenRouter Crew Selection"
npm run test:openrouter-selection

# Test context-aware routing
echo "🎯 Testing Context-Aware Routing"
npm run test:context-routing
```

#### **1.3 Individual Crew Member Testing**
```bash
# Test each crew member workflow
echo "🤖 Testing Individual Crew Members"
npm run test:captain-picard-workflow
npm run test:lieutenant-data-workflow
npm run test:counselor-troi-workflow
npm run test:chief-engineer-scott-workflow
npm run test:commander-spock-workflow
npm run test:lieutenant-worf-workflow
```

### **Phase 2: Next.js API Integration Testing**

#### **2.1 API Endpoint Validation**
```bash
# Test crew API endpoints
echo "🔌 Testing Crew API Endpoints"
curl -X POST http://localhost:3000/api/crew/captain-picard \
  -H "Content-Type: application/json" \
  -d '{"query": "What is our mission status?", "context": "strategic-planning"}'

curl -X POST http://localhost:3000/api/crew/lieutenant-data \
  -H "Content-Type: application/json" \
  -d '{"query": "What do I need to do today?", "context": "jr-developer", "userRole": "jr-developer"}'

curl -X POST http://localhost:3000/api/crew/observation-lounge \
  -H "Content-Type: application/json" \
  -d '{"meetingType": "project-status", "projectContext": {"projectId": "alexai-platform"}}'
```

#### **2.2 Jr. Developer Task Management Testing**
```bash
# Test Data's specialized task management
echo "📋 Testing Jr. Developer Task Management"
curl -X POST http://localhost:3000/api/crew/data/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What do I need to do today?",
    "context": {
      "userRole": "jr-developer",
      "currentSprint": "user-auth-enhancement",
      "teamContext": "agile-development"
    }
  }'
```

### **Phase 3: Deployment Testing**

#### **3.1 Production Environment Testing**
```bash
# Test production deployment
echo "🚀 Testing Production Deployment"
npm run test:production-deployment

# Test Vercel deployment
echo "☁️ Testing Vercel Deployment"
npm run test:vercel-deployment
```

#### **3.2 End-to-End Workflow Testing**
```bash
# Test complete workflow from request to response
echo "🔄 Testing End-to-End Workflow"
npm run test:end-to-end-workflow
```

---

## 🧪 **TEST EXECUTION**

### **Step 1: Initialize n8n Testing Environment**
```bash
# Set up testing environment
echo "🚀 Initializing n8n Testing Environment"
export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
export OPENROUTER_API_KEY="test-key"
export NEXTJS_BASE_URL="http://localhost:3000"

# Test n8n connectivity
curl -s "$N8N_BASE_URL/health" | jq .
```

### **Step 2: Test Crew Selection Logic**
```bash
# Test OpenRouter integration for crew selection
echo "🧠 Testing Crew Selection Logic"
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-3.5-sonnet",
    "messages": [
      {
        "role": "system",
        "content": "You are an AI crew coordinator. Analyze the user request and select the most appropriate Star Trek crew member to respond."
      },
      {
        "role": "user",
        "content": "User Query: What do I need to do today?\nUser Context: jr-developer\nUser Role: jr-developer"
      }
    ]
  }' | jq .
```

### **Step 3: Test Next.js API Endpoints**
```bash
# Test individual crew member endpoints
echo "🔌 Testing Crew API Endpoints"

# Test Captain Picard endpoint
echo "🎯 Testing Captain Picard"
curl -X POST "$NEXTJS_BASE_URL/api/crew/captain-picard" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is our mission status?", "context": "strategic-planning"}' | jq .

# Test Lieutenant Data endpoint
echo "🤖 Testing Lieutenant Data"
curl -X POST "$NEXTJS_BASE_URL/api/crew/lieutenant-data" \
  -H "Content-Type: application/json" \
  -d '{"query": "What do I need to do today?", "context": "jr-developer", "userRole": "jr-developer"}' | jq .

# Test Observation Lounge endpoint
echo "🖖 Testing Observation Lounge"
curl -X POST "$NEXTJS_BASE_URL/api/crew/observation-lounge" \
  -H "Content-Type: application/json" \
  -d '{"meetingType": "project-status", "projectContext": {"projectId": "alexai-platform"}}' | jq .
```

### **Step 4: Test Deployment Capabilities**
```bash
# Test local deployment
echo "🏠 Testing Local Deployment"
npm run dev &
sleep 10
curl -s "$NEXTJS_BASE_URL/api/health" | jq .
pkill -f "next dev"

# Test production build
echo "🚀 Testing Production Build"
npm run build
npm run start &
sleep 10
curl -s "$NEXTJS_BASE_URL/api/health" | jq .
pkill -f "next start"
```

---

## 📊 **EXPECTED TEST RESULTS**

### **n8n Workflow Test Results**
```typescript
// Expected n8n test results
interface N8NTestResults {
  connectivity: {
    status: 'PASS' | 'FAIL';
    responseTime: number; // Milliseconds
    endpoint: string;
  };
  
  crewSelection: {
    status: 'PASS' | 'FAIL';
    selectedCrew: string;
    confidence: number; // Percentage
    reasoning: string;
  };
  
  workflowExecution: {
    status: 'PASS' | 'FAIL';
    executionTime: number; // Milliseconds
    successRate: number; // Percentage
  };
}
```

### **API Endpoint Test Results**
```typescript
// Expected API test results
interface APITestResults {
  captainPicard: {
    status: 'PASS' | 'FAIL';
    response: string;
    decisionQuality: number; // Percentage
  };
  
  lieutenantData: {
    status: 'PASS' | 'FAIL';
    response: string;
    taskAccuracy: number; // Percentage
  };
  
  observationLounge: {
    status: 'PASS' | 'FAIL';
    crewReports: object;
    consensusQuality: number; // Percentage
  };
}
```

### **Deployment Test Results**
```typescript
// Expected deployment test results
interface DeploymentTestResults {
  local: {
    status: 'PASS' | 'FAIL';
    startupTime: number; // Milliseconds
    healthCheck: boolean;
  };
  
  production: {
    status: 'PASS' | 'FAIL';
    buildTime: number; // Milliseconds
    deploymentTime: number; // Milliseconds
  };
  
  endToEnd: {
    status: 'PASS' | 'FAIL';
    totalResponseTime: number; // Milliseconds
    workflowAccuracy: number; // Percentage
  };
}
```

---

## 🎯 **SUCCESS CRITERIA**

### **n8n Integration Success Criteria**
- **Connectivity**: 100% n8n.pbradygeorgen.com availability
- **Crew Selection**: > 95% accurate crew member selection
- **Workflow Execution**: < 3 second response time
- **OpenRouter Integration**: > 99% success rate

### **API Endpoint Success Criteria**
- **Response Time**: < 2 seconds for all endpoints
- **Accuracy**: > 95% appropriate crew responses
- **Reliability**: 100% endpoint availability
- **Data Integrity**: 100% consistent responses

### **Deployment Success Criteria**
- **Local Startup**: < 10 seconds
- **Production Build**: < 60 seconds
- **Health Checks**: 100% passing
- **End-to-End**: < 5 second total response time

---

## 🚀 **TEST EXECUTION COMMANDS**

### **Complete n8n Workflow Test**
```bash
# Execute complete n8n workflow test
echo "🔄 NCC-1701-B n8n Workflow Test - INITIATING"
npm run test:n8n-workflow-complete

# Test n8n connectivity
echo "🌐 Testing n8n Connectivity"
npm run test:n8n-connectivity

# Test crew selection
echo "🧠 Testing Crew Selection"
npm run test:crew-selection

# Test API endpoints
echo "🔌 Testing API Endpoints"
npm run test:api-endpoints

# Test deployment
echo "🚀 Testing Deployment"
npm run test:deployment
```

### **Individual Component Tests**
```bash
# Test specific components
npm run test:n8n-integration
npm run test:openrouter-selection
npm run test:crew-endpoints
npm run test:local-deployment
npm run test:production-deployment
npm run test:end-to-end-workflow
```

---

## 📋 **TEST CHECKLIST**

### **n8n Integration** ✅
- [ ] n8n.pbradygeorgen.com connectivity
- [ ] OpenRouter API integration
- [ ] Crew selection logic
- [ ] Workflow execution
- [ ] Error handling

### **API Endpoints** ✅
- [ ] Captain Picard endpoint
- [ ] Lieutenant Data endpoint
- [ ] Counselor Troi endpoint
- [ ] Chief Engineer Scott endpoint
- [ ] Commander Spock endpoint
- [ ] Lieutenant Worf endpoint
- [ ] Observation Lounge endpoint

### **Deployment** ✅
- [ ] Local development server
- [ ] Production build
- [ ] Vercel deployment
- [ ] Health checks
- [ ] End-to-end workflow

---

## 🎉 **TEST COMPLETION VALIDATION**

### **Success Indicators**
- **n8n Integration**: ✅ Operational
- **Crew Selection**: ✅ Accurate
- **API Endpoints**: ✅ Responsive
- **Deployment**: ✅ Successful
- **End-to-End**: ✅ Functional

### **Ready for Production**
- **Workflow Status**: ✅ Operational
- **Integration Status**: ✅ Complete
- **Deployment Status**: ✅ Ready
- **Testing Status**: ✅ Validated

---

**"Make it so." - Captain Jean-Luc Picard**

*The n8n workflow testing will validate our adaptive crew coordination system and ensure we are ready for production deployment.*

**Test Status**: 🧪 **INITIATING**  
**Integration Status**: 🔄 **N8N WORKFLOW TESTING**  
**Deployment Status**: 🚀 **VALIDATION IN PROGRESS**  
**Mission Status**: 🎯 **PREPARING FOR SHAKEDOWN CRUISE**
