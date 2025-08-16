# 🏗️ System Architecture

> **Technical architecture and design decisions for AlexAI Multimodal Agency**

## 🎯 Architecture Overview

AlexAI follows a **modern, scalable architecture** that combines:
- **Frontend**: Next.js 15 with App Router
- **AI Engine**: Custom orchestration with collective memory
- **Database**: Supabase (PostgreSQL + Real-time)
- **Automation**: n8n workflow platform
- **UI System**: LCARS design system with AI optimization

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
├─────────────────────────────────────────────────────────────┤
│  LCARS UI System  │  AI-Powered Layouts  │  Responsive    │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Next.js App     │  AI Orchestration    │  Real-time      │
│  Router          │  Engine              │  Collaboration  │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Project Mgmt    │  AI Agents           │  Workflow       │
│  Analytics       │  Coordination        │  Automation     │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│  Supabase        │  File Storage        │  Cache          │
│  PostgreSQL      │  (Local/Cloud)       │  (Redis/Memory) │
├─────────────────────────────────────────────────────────────┤
│                    External Services                        │
├─────────────────────────────────────────────────────────────┤
│  n8n Workflows   │  YouTube API         │  Email          │
│  AI Services     │  Analytics           │  Notifications  │
└─────────────────────────────────────────────────────────────┘
```

## 🧠 AI Agent Architecture

### Agent Hierarchy
```
                    ┌─────────────────┐
                    │  Ship Computer  │
                    │  (Coordinator)  │
                    └─────────┬───────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐         ┌─────▼────┐         ┌─────▼────┐
   │Layout   │         │Content   │         │User      │
   │Analyzer │         │Optimizer │         │Intent    │
   └─────────┘         └──────────┘         │Analyzer  │
                                            └──────────┘
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐         ┌─────▼────┐         ┌─────▼────┐
   │Visual   │         │Performance│        │Learning  │
   │Designer │         │Monitor   │        │Engine    │
   └─────────┘         └──────────┘        └──────────┘
```

### Agent Communication Flow
```typescript
// 1. User interaction triggers analysis
const userContext = {
  screenSize: 'desktop',
  userIntent: 'project_creation',
  currentPage: '/dashboard'
};

// 2. Ship Computer coordinates agents
const collaboration = await collectiveMemoryEngine.startCollaboration(
  ['layout_analyzer', 'content_optimizer', 'visual_designer'],
  'interface_optimization',
  'user_request',
  userContext
);

// 3. Agents work together and share insights
const insights = await collectiveMemoryEngine.getCollectiveInsights(
  collaboration.sessionId
);

// 4. Results are applied to the interface
await applyLayoutOptimization(insights);
```

## 🎨 LCARS UI System Architecture

### Component Hierarchy
```
LCARS Root
├── Layout Container
│   ├── Header Section
│   │   ├── Navigation
│   │   ├── Status Indicators
│   │   └── AI Agent Status
│   ├── Main Content Area
│   │   ├── Elbow Containers
│   │   ├── Dynamic Panels
│   │   └── Responsive Grids
│   └── Footer Section
└── Overlay Components
    ├── Modals
    ├── Notifications
    └── Loading States
```

### Responsive Design System
```typescript
// Breakpoint system
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
};

// LCARS layout adaptation
const getLCARSLayout = (screenSize: ScreenSize) => {
  switch (screenSize) {
    case 'mobile':
      return { columns: 1, spacing: 'compact', panels: 2 };
    case 'tablet':
      return { columns: 2, spacing: 'normal', panels: 4 };
    case 'desktop':
      return { columns: 4, spacing: 'normal', panels: 6 };
    case 'wide':
      return { columns: 6, spacing: 'spacious', panels: 8 };
  }
};
```

### AI-Powered Layout Optimization
```typescript
// Layout optimization algorithm
const optimizeLayout = (userContext: UserContext) => {
  const analysis = {
    screenSize: userContext.screenSize,
    userIntent: userContext.userIntent,
    interactionPatterns: userContext.userBehavior.navigationPattern,
    performanceMetrics: userContext.systemState.performance
  };

  return {
    gridColumns: calculateOptimalColumns(analysis),
    spacing: determineSpacing(analysis),
    visualHierarchy: optimizeHierarchy(analysis),
    colorContrast: ensureAccessibility(analysis)
  };
};
```

## 🔄 n8n Integration Architecture

### Workflow Structure
```
YouTube Analysis Workflow
├── Trigger: YouTube Channel URL
├── Extract: Video Data & Analytics
├── Analyze: Revenue Potential
├── Generate: Project Specifications
├── Create: Agile Project
└── Notify: Team Members

Revenue Generation Workflow
├── Trigger: Market Analysis
├── Calculate: Revenue Potential
├── Plan: Business Strategy
├── Assign: Team Resources
└── Track: Progress Metrics
```

### Integration Points
```typescript
// Webhook endpoint for n8n
export async function POST(request: Request) {
  const { workflowType, data } = await request.json();
  
  switch (workflowType) {
    case 'youtube_analysis':
      return await handleYouTubeAnalysis(data);
    case 'revenue_generation':
      return await handleRevenueGeneration(data);
    case 'team_coordination':
      return await handleTeamCoordination(data);
    default:
      return new Response('Unknown workflow', { status: 400 });
  }
}

// Real-time updates via Supabase
const channel = supabase
  .channel('workflow_updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'workflows' },
    (payload) => {
      updateWorkflowStatus(payload.new);
    }
  )
  .subscribe();
```

## 🗄️ Data Architecture

### Database Schema (Supabase)
```sql
-- Core tables
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  performance_metrics JSONB,
  last_activity TIMESTAMP DEFAULT NOW()
);

CREATE TABLE collective_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agents(id),
  context JSONB NOT NULL,
  insights JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Real-time enabled tables
ALTER TABLE projects REPLICA IDENTITY FULL;
ALTER TABLE ai_agents REPLICA IDENTITY FULL;
ALTER TABLE collective_memory REPLICA IDENTITY FULL;
```

### Data Flow
```
User Action → AI Analysis → Database Update → Real-time Sync → UI Update
     │              │            │              │              │
     ▼              ▼            ▼              ▼              ▼
  Interface    Agent Engine   Supabase     WebSocket      Component
  Component    Processing     PostgreSQL   Connection     Re-render
```

## 🔐 Security Architecture

### Authentication & Authorization
```typescript
// Supabase auth integration
const { user, session } = await supabase.auth.getUser();

// Role-based access control
const userRoles = {
  admin: ['read', 'write', 'delete', 'admin'],
  manager: ['read', 'write'],
  developer: ['read', 'write'],
  viewer: ['read']
};

// API route protection
export async function GET(request: Request) {
  const { user } = await supabase.auth.getUser();
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Check user permissions
  const hasPermission = await checkUserPermission(user.id, 'read');
  if (!hasPermission) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Proceed with request
  return await handleRequest(request);
}
```

### Environment Security
```bash
# .env.local (create this file)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
N8N_BASE_URL=your_n8n_url
N8N_API_KEY=your_n8n_api_key
```

## 🚀 Performance Architecture

### Optimization Strategies
1. **Code Splitting**: Next.js automatic code splitting
2. **Image Optimization**: Next.js Image component
3. **Caching**: Supabase query caching and Redis
4. **Lazy Loading**: Component and route lazy loading
5. **AI Optimization**: Intelligent layout pre-computation

### Monitoring & Metrics
```typescript
// Performance monitoring
const performanceMetrics = {
  loadTime: performance.now() - startTime,
  renderTime: renderEndTime - renderStartTime,
  memoryUsage: performance.memory?.usedJSHeapSize,
  cpuUsage: getCPUUsage(),
  successRate: calculateSuccessRate()
};

// AI agent performance tracking
await collectiveMemoryEngine.recordPerformance(
  agentId,
  performanceMetrics
);
```

## 🔧 Development Architecture

### Code Organization
```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Route groups
│   ├── api/               # API endpoints
│   └── globals.css        # Global styles
├── core/                   # Core business logic
│   ├── components/         # Reusable components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript definitions
├── features/               # Feature modules
│   ├── agile/             # Agile project management
│   ├── analytics/         # Analytics and reporting
│   └── workflows/         # Workflow management
└── lib/                    # External library wrappers
```

### Testing Strategy
```typescript
// Unit tests for AI agents
describe('AI Orchestration Engine', () => {
  it('should coordinate multiple agents', async () => {
    const engine = new CollectiveMemoryEngine();
    const session = await engine.startCollaboration(
      ['agent1', 'agent2'],
      'test_task',
      'test_context'
    );
    
    expect(session.sessionId).toBeDefined();
    expect(session.agents).toHaveLength(2);
  });
});

// Integration tests for workflows
describe('n8n Integration', () => {
  it('should process YouTube analysis workflow', async () => {
    const response = await fetch('/api/workflows/youtube-analysis', {
      method: 'POST',
      body: JSON.stringify({ channelUrl: 'test-url' })
    });
    
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.projectId).toBeDefined();
  });
});
```

## 🚀 Deployment Architecture

### Environment Strategy
```
Development → Staging → Production
     │           │          │
     ▼           ▼          ▼
  Local DB    Test DB    Supabase
  Local n8n   Test n8n   Production n8n
  Local API   Test API   Vercel/EC2
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy AlexAI
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run type-check
      - run: npm run build
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🔮 Future Architecture Considerations

### Scalability
- **Microservices**: Break down into smaller services
- **Load Balancing**: Distribute traffic across instances
- **Database Sharding**: Partition data for performance
- **CDN Integration**: Global content delivery

### AI Enhancement
- **Machine Learning**: Predictive analytics and recommendations
- **Natural Language Processing**: Advanced user interaction
- **Computer Vision**: Image and video analysis
- **Reinforcement Learning**: Continuous system improvement

### Integration Expansion
- **API Gateway**: Centralized API management
- **Event Streaming**: Real-time data processing
- **Service Mesh**: Inter-service communication
- **Observability**: Comprehensive monitoring and tracing

---

**🏗️ This architecture provides a solid foundation for scaling AlexAI to enterprise levels while maintaining the innovative AI-driven approach that makes it unique.**

*"The needs of the many outweigh the needs of the few." - Spock*
