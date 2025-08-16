# 🔄 n8n Integration

> **Complete guide to AlexAI's n8n workflow automation system**

## 🎯 Overview

n8n is a powerful workflow automation platform that connects AlexAI with external services, automates business processes, and enables intelligent data flows. This integration provides:

- **Automated Project Creation** - YouTube analysis to agile projects
- **Business Process Automation** - Revenue generation workflows
- **Real-time Synchronization** - Bilateral sync between systems
- **Webhook Management** - Crew coordination and task assignment

## 🏗️ Architecture Overview

### Integration Points
```
AlexAI Application ←→ n8n Workflows ←→ External Services
       │                    │                    │
       ▼                    ▼                    ▼
   User Interface    Workflow Engine      YouTube API
   AI Agents        Data Processing      Email Services
   Database         Webhook Handling     Analytics APIs
   Real-time Sync   Error Handling      Notification Services
```

### Data Flow
```
1. User Action → 2. AlexAI API → 3. n8n Webhook → 4. Workflow Execution → 5. External API → 6. Data Processing → 7. Database Update → 8. Real-time Sync → 9. UI Update
```

## 🔧 Setup & Configuration

### Environment Variables
```bash
# .env.local
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key
N8N_WEBHOOK_SECRET=your_webhook_secret

# External API Keys
YOUTUBE_API_KEY=your_youtube_api_key
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### n8n Installation
```bash
# Install n8n globally
npm install -g n8n

# Start n8n
n8n start

# Or use Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### AlexAI Integration Setup
```typescript
// src/core/n8n-integration.ts
import { n8nClient } from './n8n-client';

export class N8NIntegration {
  private baseUrl: string;
  private apiKey: string;
  
  constructor() {
    this.baseUrl = process.env.N8N_BASE_URL!;
    this.apiKey = process.env.N8N_API_KEY!;
  }
  
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health`);
      return response.ok;
    } catch (error) {
      console.error('n8n connection failed:', error);
      return false;
    }
  }
}
```

## 🔄 Core Workflows

### 1. YouTube Analysis Workflow

**Purpose**: Analyze YouTube channels and create agile projects automatically

**Workflow Structure**:
```
YouTube Channel URL → Extract Video Data → Analyze Revenue Potential → Generate Project Specs → Create Agile Project → Notify Team
```

**Implementation**:
```typescript
// Trigger YouTube analysis workflow
async function triggerYouTubeAnalysis(channelUrl: string) {
  const response = await fetch('/api/workflows/youtube-analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.N8N_API_KEY}`
    },
    body: JSON.stringify({
      channelUrl,
      analysisDepth: 'comprehensive',
      includeRevenueProjection: true,
      targetProjectType: 'agile'
    })
  });
  
  if (!response.ok) {
    throw new Error('YouTube analysis workflow failed');
  }
  
  return await response.json();
}

// Webhook endpoint for n8n
export async function POST(request: Request) {
  const { channelUrl, analysisDepth, includeRevenueProjection, targetProjectType } = await request.json();
  
  try {
    // Execute YouTube analysis
    const analysis = await analyzeYouTubeChannel(channelUrl);
    
    // Generate project specifications
    const projectSpecs = await generateProjectSpecs(analysis, {
      includeRevenueProjection,
      targetProjectType
    });
    
    // Create agile project
    const project = await createAgileProject(projectSpecs);
    
    // Notify team members
    await notifyTeam(project);
    
    return Response.json({
      success: true,
      projectId: project.id,
      analysis: analysis.summary
    });
    
  } catch (error) {
    console.error('YouTube analysis failed:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

### 2. Revenue Generation Workflow

**Purpose**: Automate business strategy and revenue generation processes

**Workflow Structure**:
```
Market Analysis → Revenue Calculation → Business Strategy → Team Assignment → Progress Tracking
```

**Implementation**:
```typescript
// Revenue generation workflow
async function triggerRevenueGeneration(marketData: MarketData) {
  const response = await fetch('/api/workflows/revenue-generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.N8N_API_KEY}`
    },
    body: JSON.stringify({
      marketData,
      targetRevenue: marketData.targetRevenue,
      timeline: marketData.timeline,
      teamSize: marketData.teamSize
    })
  });
  
  return await response.json();
}

// Revenue generation webhook
export async function POST(request: Request) {
  const { marketData, targetRevenue, timeline, teamSize } = await request.json();
  
  try {
    // Analyze market potential
    const marketAnalysis = await analyzeMarketPotential(marketData);
    
    // Calculate revenue projections
    const revenueProjections = await calculateRevenueProjections({
      marketAnalysis,
      targetRevenue,
      timeline
    });
    
    // Generate business strategy
    const businessStrategy = await generateBusinessStrategy({
      marketAnalysis,
      revenueProjections,
      teamSize
    });
    
    // Assign team resources
    const teamAssignment = await assignTeamResources(businessStrategy);
    
    // Create tracking system
    const trackingSystem = await createProgressTracking({
      businessStrategy,
      teamAssignment
    });
    
    return Response.json({
      success: true,
      strategyId: businessStrategy.id,
      revenueProjections,
      teamAssignment,
      trackingSystem
    });
    
  } catch (error) {
    console.error('Revenue generation failed:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

### 3. Team Coordination Workflow

**Purpose**: Automate team communication and task assignment

**Workflow Structure**:
```
Team Status Check → Task Assignment → Communication → Progress Monitoring → Performance Analytics
```

**Implementation**:
```typescript
// Team coordination workflow
async function triggerTeamCoordination(teamData: TeamData) {
  const response = await fetch('/api/workflows/team-coordination', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.N8N_API_KEY}`
    },
    body: JSON.stringify({
      teamData,
      coordinationType: 'task_assignment',
      priority: 'high'
    })
  });
  
  return await response.json();
}
```

## 🔌 Webhook Integration

### Webhook Endpoints
```typescript
// src/app/api/workflows/route.ts
export async function POST(request: Request) {
  const { workflowType, data } = await request.json();
  
  // Verify webhook signature
  const signature = request.headers.get('x-n8n-signature');
  if (!verifyWebhookSignature(signature, data)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  switch (workflowType) {
    case 'youtube_analysis':
      return await handleYouTubeAnalysis(data);
    case 'revenue_generation':
      return await handleRevenueGeneration(data);
    case 'team_coordination':
      return await handleTeamCoordination(data);
    default:
      return Response.json({ error: 'Unknown workflow' }, { status: 400 });
  }
}

// Webhook signature verification
function verifyWebhookSignature(signature: string | null, data: any): boolean {
  if (!signature || !process.env.N8N_WEBHOOK_SECRET) {
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.N8N_WEBHOOK_SECRET)
    .update(JSON.stringify(data))
    .digest('hex');
    
  return signature === expectedSignature;
}
```

### Real-time Updates
```typescript
// Real-time workflow status updates
const workflowChannel = supabase
  .channel('workflow_updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'workflows' },
    (payload) => {
      updateWorkflowStatus(payload.new);
      notifyWorkflowUpdate(payload.new);
    }
  )
  .subscribe();

// Update workflow status in UI
function updateWorkflowStatus(workflow: WorkflowStatus) {
  const workflowElement = document.querySelector(`[data-workflow-id="${workflow.id}"]`);
  if (workflowElement) {
    workflowElement.classList.remove('pending', 'running', 'completed', 'failed');
    workflowElement.classList.add(workflow.status);
    workflowElement.querySelector('.status-text').textContent = workflow.status;
  }
}
```

## 📊 Workflow Monitoring

### Status Tracking
```typescript
// Workflow status interface
interface WorkflowStatus {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
  results?: any;
}

// Monitor workflow execution
async function monitorWorkflow(workflowId: string): Promise<WorkflowStatus> {
  const response = await fetch(`/api/workflows/${workflowId}/status`);
  if (!response.ok) {
    throw new Error('Failed to get workflow status');
  }
  
  return await response.json();
}

// Real-time monitoring
function startWorkflowMonitoring(workflowId: string) {
  const interval = setInterval(async () => {
    try {
      const status = await monitorWorkflow(workflowId);
      
      if (status.status === 'completed' || status.status === 'failed') {
        clearInterval(interval);
        handleWorkflowCompletion(status);
      } else {
        updateWorkflowProgress(status);
      }
    } catch (error) {
      console.error('Workflow monitoring failed:', error);
    }
  }, 2000); // Check every 2 seconds
  
  return interval;
}
```

### Performance Analytics
```typescript
// Workflow performance tracking
interface WorkflowPerformance {
  workflowId: string;
  executionTime: number;
  successRate: number;
  averageExecutionTime: number;
  totalExecutions: number;
  lastExecution: Date;
}

// Track workflow performance
async function trackWorkflowPerformance(workflowId: string, executionTime: number, success: boolean) {
  const performance: WorkflowPerformance = {
    workflowId,
    executionTime,
    successRate: success ? 1 : 0,
    averageExecutionTime: executionTime,
    totalExecutions: 1,
    lastExecution: new Date()
  };
  
  await supabase
    .from('workflow_performance')
    .upsert(performance, { onConflict: 'workflowId' });
}

// Get performance analytics
async function getWorkflowAnalytics(): Promise<WorkflowPerformance[]> {
  const { data, error } = await supabase
    .from('workflow_performance')
    .select('*')
    .order('lastExecution', { ascending: false });
    
  if (error) throw error;
  return data;
}
```

## 🚀 Advanced Features

### Conditional Workflows
```typescript
// Conditional workflow execution
async function executeConditionalWorkflow(conditions: WorkflowConditions) {
  const { data, error } = await supabase
    .from('workflow_conditions')
    .select('*')
    .eq('active', true)
    .gte('threshold', conditions.value);
    
  if (error) throw error;
  
  if (data.length > 0) {
    // Execute workflow
    await triggerWorkflow(data[0].workflowType, conditions);
  } else {
    // Skip execution
    console.log('Workflow conditions not met');
  }
}

// Dynamic workflow selection
async function selectWorkflow(context: WorkflowContext): Promise<string> {
  const workflows = await getAvailableWorkflows();
  
  // Score workflows based on context
  const scoredWorkflows = workflows.map(workflow => ({
    ...workflow,
    score: calculateWorkflowScore(workflow, context)
  }));
  
  // Return highest scoring workflow
  return scoredWorkflows.sort((a, b) => b.score - a.score)[0].id;
}
```

### Error Handling & Retry Logic
```typescript
// Retry logic for failed workflows
async function retryWorkflow(workflowId: string, maxRetries: number = 3) {
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      const result = await executeWorkflow(workflowId);
      return result;
    } catch (error) {
      retryCount++;
      console.log(`Workflow ${workflowId} failed, attempt ${retryCount}/${maxRetries}`);
      
      if (retryCount >= maxRetries) {
        throw new Error(`Workflow ${workflowId} failed after ${maxRetries} attempts`);
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
}

// Error categorization and handling
function categorizeError(error: any): ErrorCategory {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    return 'rate_limit';
  } else if (error.code === 'API_KEY_INVALID') {
    return 'authentication';
  } else if (error.code === 'SERVICE_UNAVAILABLE') {
    return 'service_unavailable';
  } else {
    return 'unknown';
  }
}

// Handle different error types
async function handleWorkflowError(error: any, workflowId: string) {
  const category = categorizeError(error);
  
  switch (category) {
    case 'rate_limit':
      await scheduleRetry(workflowId, Date.now() + 60000); // Retry in 1 minute
      break;
    case 'authentication':
      await refreshApiKeys();
      await retryWorkflow(workflowId);
      break;
    case 'service_unavailable':
      await scheduleRetry(workflowId, Date.now() + 300000); // Retry in 5 minutes
      break;
    default:
      await logError(error, workflowId);
      break;
  }
}
```

## 🧪 Testing & Development

### Local Development
```bash
# Start n8n locally
n8n start

# Test webhook endpoints
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -H "x-n8n-signature: test-signature" \
  -d '{
    "workflowType": "youtube_analysis",
    "data": {
      "channelUrl": "https://youtube.com/@testchannel"
    }
  }'

# Monitor n8n logs
tail -f ~/.n8n/logs/n8n.log
```

### Workflow Testing
```typescript
// Test workflow execution
describe('n8n Workflows', () => {
  it('should execute YouTube analysis workflow', async () => {
    const mockData = {
      channelUrl: 'https://youtube.com/@testchannel',
      analysisDepth: 'comprehensive'
    };
    
    const response = await fetch('/api/workflows/youtube-analysis', {
      method: 'POST',
      body: JSON.stringify(mockData)
    });
    
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.projectId).toBeDefined();
  });
  
  it('should handle workflow errors gracefully', async () => {
    const mockData = {
      channelUrl: 'invalid-url',
      analysisDepth: 'comprehensive'
    };
    
    const response = await fetch('/api/workflows/youtube-analysis', {
      method: 'POST',
      body: JSON.stringify(mockData)
    });
    
    expect(response.status).toBe(500);
    const result = await response.json();
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

## 🔒 Security & Best Practices

### API Key Management
```typescript
// Secure API key storage
class SecureAPIKeyManager {
  private keys: Map<string, string> = new Map();
  
  setKey(service: string, key: string) {
    // Encrypt key before storage
    const encryptedKey = this.encrypt(key);
    this.keys.set(service, encryptedKey);
  }
  
  getKey(service: string): string | null {
    const encryptedKey = this.keys.get(service);
    if (!encryptedKey) return null;
    
    // Decrypt key before use
    return this.decrypt(encryptedKey);
  }
  
  private encrypt(text: string): string {
    // Implement encryption logic
    return btoa(text); // Base64 encoding (use proper encryption in production)
  }
  
  private decrypt(encryptedText: string): string {
    // Implement decryption logic
    return atob(encryptedText); // Base64 decoding
  }
}
```

### Rate Limiting
```typescript
// Rate limiting for workflow execution
class WorkflowRateLimiter {
  private executions: Map<string, number[]> = new Map();
  private maxExecutions = 100; // Max executions per hour
  private windowMs = 60 * 60 * 1000; // 1 hour
  
  async canExecute(workflowId: string): Promise<boolean> {
    const now = Date.now();
    const executions = this.executions.get(workflowId) || [];
    
    // Remove old executions outside the window
    const recentExecutions = executions.filter(time => now - time < this.windowMs);
    
    if (recentExecutions.length >= this.maxExecutions) {
      return false;
    }
    
    // Add current execution
    recentExecutions.push(now);
    this.executions.set(workflowId, recentExecutions);
    
    return true;
  }
}
```

## 📚 Troubleshooting

### Common Issues

#### Workflow Not Executing
```bash
# Check n8n status
curl -X GET http://localhost:5678/api/v1/health

# Check webhook endpoint
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{"workflowType": "test", "data": {}}'

# Check logs
tail -f logs/n8n-integration.log
```

#### Authentication Failures
```bash
# Verify API keys
echo $N8N_API_KEY
echo $N8N_WEBHOOK_SECRET

# Test authentication
curl -X GET http://localhost:5678/api/v1/credentials \
  -H "X-N8N-API-KEY: $N8N_API_KEY"
```

#### Data Sync Issues
```bash
# Check database connection
npm run db:test-connection

# Verify webhook signatures
npm run n8n:verify-webhooks

# Check real-time subscriptions
npm run n8n:check-subscriptions
```

### Debug Commands
```bash
# Test individual workflows
npm run n8n:test-workflow -- --workflow=youtube_analysis

# Monitor workflow execution
npm run n8n:monitor -- --workflow-id=123

# Check performance metrics
npm run n8n:performance -- --duration=24h

# Validate webhook endpoints
npm run n8n:validate-webhooks
```

## 🔮 Future Enhancements

### Planned Features
1. **AI-Powered Workflow Generation** - Automatic workflow creation based on business needs
2. **Advanced Error Recovery** - Intelligent error handling and automatic recovery
3. **Workflow Optimization** - Performance analysis and automatic optimization
4. **Multi-Platform Integration** - Support for additional automation platforms
5. **Real-time Collaboration** - Live workflow editing and collaboration

### Research Areas
- **Workflow Intelligence** - Machine learning for workflow optimization
- **Predictive Analytics** - Anticipating workflow needs and failures
- **Advanced Scheduling** - Intelligent workflow scheduling and resource allocation
- **Cross-Platform Sync** - Synchronization between different automation platforms

---

**🔄 The n8n integration provides AlexAI with powerful workflow automation capabilities, enabling intelligent business process automation and seamless integration with external services.**

*"The best automation is the one you don't notice." - Chief Engineer Montgomery Scott*
