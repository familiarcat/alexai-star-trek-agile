# 🛠️ Development Guide

> **Complete development guidelines for AlexAI Multimodal Agency**

## 🎯 Development Philosophy

AlexAI follows a **collaborative AI-driven development approach** where:
- **AI agents assist** in code review and optimization
- **Automated testing** validates all changes
- **Continuous integration** ensures quality
- **Real-time collaboration** enables rapid development

## 🏗️ Project Structure

### Directory Organization
```
src/
├── app/                    # Next.js 15 App Router
│   ├── (routes)/          # Route groups
│   ├── api/               # API endpoints
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── core/                   # Core business logic
│   ├── components/         # Reusable components
│   │   ├── ui/            # Base UI components
│   │   └── lcars/         # LCARS interface components
│   ├── ai-orchestration-engine.ts  # AI agent management
│   ├── supabase.ts        # Database integration
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
├── features/               # Feature-specific modules
│   ├── agile/             # Agile project management
│   ├── analytics/         # Analytics and reporting
│   └── workflows/         # Workflow management
└── lib/                    # External library wrappers
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `AICollaborationDashboard.tsx`)
- **Utilities**: camelCase (e.g., `aiOrchestrationEngine.ts`)
- **Types**: PascalCase with `.types.ts` suffix (e.g., `workflow.types.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `AI_AGENT_CONFIG.ts`)

## 🔧 Development Environment

### Prerequisites
```bash
# Required software
Node.js 18+
npm 8+
Git
VS Code (recommended)

# VS Code extensions
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens
```

### Environment Setup
```bash
# Clone repository
git clone https://github.com/familiarcat/alexai-star-trek-agile.git
cd alexai-star-trek-agile

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key
N8N_WEBHOOK_SECRET=your_webhook_secret
```

## 🧪 Testing Strategy

### Testing Commands
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- --testPathPattern=ai-orchestration-engine

# Run TypeScript compilation check
npm run type-check

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix
```

### Test Structure
```typescript
// Example test structure
describe('AI Orchestration Engine', () => {
  describe('Agent Collaboration', () => {
    it('should coordinate multiple agents successfully', async () => {
      // Test implementation
    });
    
    it('should handle agent failures gracefully', async () => {
      // Test implementation
    });
  });
  
  describe('Collective Memory', () => {
    it('should store and retrieve insights correctly', async () => {
      // Test implementation
    });
  });
});
```

### Testing Best Practices
1. **Test AI agents individually** before testing collaboration
2. **Mock external services** (Supabase, n8n) in unit tests
3. **Test error conditions** and edge cases
4. **Use descriptive test names** that explain the expected behavior
5. **Test both success and failure scenarios**

## 🔍 Code Quality

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 🚀 Development Workflow

### Feature Development
```bash
# 1. Create feature branch
git checkout -b feature/ai-agent-enhancement

# 2. Make changes and test
npm run type-check
npm run test
npm run build

# 3. Commit changes
git add .
git commit -m "feat: enhance AI agent collaboration capabilities

- Add real-time agent communication
- Implement collective memory optimization
- Improve error handling and recovery"

# 4. Push and create PR
git push origin feature/ai-agent-enhancement
```

### Code Review Process
1. **Self-review** your code before submitting
2. **Run all tests** to ensure nothing is broken
3. **Check TypeScript compilation** for type errors
4. **Verify AI agent functionality** with manual testing
5. **Request review** from team members or AI agents

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
**Scope**: `ai-agents`, `lcars`, `n8n`, `api`, `ui`

## 🧠 AI Agent Development

### Adding New Agents
```typescript
// 1. Define agent interface
interface NewAgent extends AIAgent {
  specialty: 'new_specialty';
  capabilities: string[];
  analyze(context: UserContext): Promise<AgentInsight>;
}

// 2. Implement agent class
export class NewAgent implements NewAgent {
  id = 'new_agent';
  name = 'New Agent';
  specialty = 'new_specialty';
  capabilities = ['capability1', 'capability2'];
  
  async analyze(context: UserContext): Promise<AgentInsight> {
    // Implement analysis logic
    return {
      agentId: this.id,
      category: 'new_analysis',
      insight: 'analysis result',
      confidence: 0.85,
      reasoning: 'analysis reasoning'
    };
  }
}

// 3. Register agent in orchestration engine
const newAgent = new NewAgent();
collectiveMemoryEngine.registerAgent(newAgent);
```

### Agent Testing
```typescript
// Test new agent
describe('NewAgent', () => {
  let agent: NewAgent;
  
  beforeEach(() => {
    agent = new NewAgent();
  });
  
  it('should analyze context correctly', async () => {
    const context: UserContext = {
      screenSize: 'desktop',
      userIntent: 'test_intent'
    };
    
    const insight = await agent.analyze(context);
    
    expect(insight.agentId).toBe('new_agent');
    expect(insight.confidence).toBeGreaterThan(0.5);
    expect(insight.reasoning).toBeDefined();
  });
});
```

## 🎨 LCARS Component Development

### Creating New Components
```typescript
// 1. Create component file
// src/core/components/lcars/NewLCARSComponent.tsx
import React from 'react';
import { cn } from '@/core/utils';

interface NewLCARSComponentProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function NewLCARSComponent({ title, children, className }: NewLCARSComponentProps) {
  return (
    <div className={cn('lcars-component', className)}>
      <div className="lcars-component-header">{title}</div>
      <div className="lcars-component-content">
        {children}
      </div>
    </div>
  );
}

// 2. Add to index file
// src/core/components/lcars/index.ts
export { NewLCARSComponent } from './NewLCARSComponent';

// 3. Add to main components index
// src/core/components/index.ts
export { NewLCARSComponent } from './lcars';
```

### Component Styling
```css
/* LCARS component styles */
.lcars-component {
  background: var(--lcars-dark);
  border: 2px solid var(--lcars-orange);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
}

.lcars-component-header {
  color: var(--lcars-orange);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.lcars-component-content {
  color: var(--lcars-text-primary);
}
```

## 🔄 n8n Workflow Development

### Creating New Workflows
```typescript
// 1. Define workflow interface
interface NewWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
}

// 2. Implement workflow handler
export async function handleNewWorkflow(data: any) {
  try {
    // Validate input data
    const validatedData = validateWorkflowData(data);
    
    // Execute workflow steps
    const step1Result = await executeStep1(validatedData);
    const step2Result = await executeStep2(step1Result);
    const finalResult = await executeStep3(step2Result);
    
    // Return success response
    return Response.json({
      success: true,
      result: finalResult,
      workflowId: generateWorkflowId()
    });
    
  } catch (error) {
    console.error('New workflow failed:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// 3. Add to workflow router
// src/app/api/workflows/route.ts
case 'new_workflow':
  return await handleNewWorkflow(data);
```

### Workflow Testing
```typescript
// Test new workflow
describe('New Workflow', () => {
  it('should execute successfully with valid data', async () => {
    const testData = {
      // Test data structure
    };
    
    const response = await fetch('/api/workflows', {
      method: 'POST',
      body: JSON.stringify({
        workflowType: 'new_workflow',
        data: testData
      })
    });
    
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
  });
});
```

## 📊 Performance Optimization

### Code Splitting
```typescript
// Lazy load components
const LazyHeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <LazyHeavyComponent />
    </React.Suspense>
  );
}
```

### Memoization
```typescript
// Memoize expensive calculations
const useExpensiveCalculation = (data: any[]) => {
  return useMemo(() => {
    return data.reduce((acc, item) => {
      // Expensive calculation
      return acc + processItem(item);
    }, 0);
  }, [data]);
};

// Memoize components
const MemoizedComponent = React.memo(ExpensiveComponent, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
});
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze

# Check for duplicate dependencies
npm ls
npm dedupe
```

## 🔍 Debugging

### Development Tools
```typescript
// Enable React DevTools
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
}

// Debug AI agents
const debugAI = (agentId: string, message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AI Agent ${agentId}]:`, message);
  }
};

// Performance monitoring
const measurePerformance = (operation: string, fn: () => any) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${operation} took ${end - start}ms`);
  }
  
  return result;
};
```

### Logging
```typescript
// Structured logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  }
};

// Use in components
logger.info('AI agent collaboration started', { agentCount: 5 });
logger.error('Workflow execution failed', error);
```

## 🚀 Deployment

### Pre-deployment Checklist
- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] AI agents are functioning correctly
- [ ] n8n workflows are tested
- [ ] Environment variables are configured

### Deployment Commands
```bash
# Deploy to Vercel
npm run deploy

# Deploy n8n workflows
npm run deploy:workflow

# Deploy with full CI/CD
./deploy-full-cicd.sh all

# Check deployment status
npm run deploy:status
```

### Environment Management
```bash
# Production environment
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
N8N_BASE_URL=https://your-n8n-instance.com

# Staging environment
NODE_ENV=staging
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
N8N_BASE_URL=https://your-staging-n8n-instance.com
```

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [n8n Documentation](https://docs.n8n.io)

### Development Tools
- [VS Code](https://code.visualstudio.com)
- [Postman](https://www.postman.com) - API testing
- [Insomnia](https://insomnia.rest) - API client
- [DBeaver](https://dbeaver.io) - Database client
- [Figma](https://www.figma.com) - Design collaboration

### Learning Resources
- [React Patterns](https://reactpatterns.com)
- [TypeScript Design Patterns](https://refactoring.guru/design-patterns/typescript)
- [Web Performance](https://web.dev/performance)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref)

---

**🛠️ This development guide provides the foundation for building and maintaining AlexAI with best practices, quality standards, and collaborative development approaches.**

*"Make it so!" - Captain Jean-Luc Picard*
