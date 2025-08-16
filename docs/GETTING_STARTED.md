# 🚀 Getting Started Guide

> **Complete setup guide for AlexAI Multimodal Agency**

## 🎯 What You'll Learn

This guide will walk you through:
1. Setting up your development environment
2. Understanding the project structure
3. Running the application locally
4. Making your first changes
5. Understanding the AI agent system

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm 8+** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended
- **Terminal** - macOS Terminal, Windows PowerShell, or Linux terminal

## 🚀 Quick Setup (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/familiarcat/alexai-star-trek-agile.git
cd alexai-star-trek-agile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Your Browser
Navigate to: **http://localhost:3000**

🎉 **Congratulations! You're now running AlexAI locally!**

## 🏗️ Understanding the Project Structure

### Core Directories
```
src/
├── app/                    # Next.js pages and routing
│   ├── page.tsx          # Main dashboard (homepage)
│   ├── analytics/        # Performance metrics page
│   ├── workflows/        # n8n workflow management
│   ├── crew/            # Team collaboration
│   └── tasks/           # Task management
├── core/                 # Business logic and components
│   ├── components/       # Reusable UI components
│   ├── ai-orchestration-engine.ts  # AI agent management
│   └── supabase.ts      # Database integration
└── features/             # Feature-specific modules
```

### Key Files to Know
- **`package.json`** - Dependencies and scripts
- **`tsconfig.json`** - TypeScript configuration
- **`next.config.ts`** - Next.js configuration
- **`.env.local`** - Environment variables (create this)

## 🔧 Development Workflow

### Starting Development
```bash
# Start development server
npm run dev

# In another terminal, check TypeScript
npm run type-check

# Build for production
npm run build
```

### Making Changes
1. **Create a new branch** for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the code

3. **Test your changes**
   ```bash
   npm run type-check  # Check TypeScript
   npm run build       # Ensure it builds
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

## 🧠 Understanding the AI Agent System

### What Are AI Agents?
AI agents are specialized programs that work together to:
- Analyze user behavior
- Optimize the interface layout
- Provide intelligent recommendations
- Coordinate with each other

### The 5 Active Agents
1. **Ship's Computer (Majel Barrot)** - Overall coordination
2. **Layout Analyzer** - Page structure optimization
3. **Content Optimizer** - Content organization
4. **User Intent Analyzer** - Understanding user goals
5. **Visual Designer** - UI/UX improvements

### How They Work Together
```typescript
// Example: Agents collaborating on layout optimization
const sessionId = await collectiveMemoryEngine.startCollaboration(
  ['ship_computer', 'layout_analyzer', 'visual_designer'],
  'layout_optimization',
  'user_request',
  userContext
);
```

## 🎨 Understanding the LCARS Interface

### What is LCARS?
LCARS (Library Computer Access/Retrieval System) is the Star Trek-inspired interface that provides:
- **Responsive Design** - Works on any device
- **AI-Powered Layouts** - Automatically optimizes for user context
- **Accessibility** - WCAG compliant with screen reader support

### Key LCARS Components
```typescript
// Example LCARS component structure
<div className="lcars-elbow-container">
  <div className="lcars-elbow-header">SECTION TITLE</div>
  <div className="lcars-elbow-content">
    {/* Your content here */}
  </div>
</div>
```

### Color System
- **Orange** - Primary actions and headers
- **Blue** - Secondary information
- **Purple** - Accent elements
- **Dark Background** - Professional appearance

## 🔄 Understanding n8n Integration

### What is n8n?
n8n is a workflow automation platform that:
- Connects different services together
- Automates business processes
- Integrates with external APIs
- Manages data flows

### Key Workflows
1. **YouTube Analysis** → **Project Creation**
2. **Revenue Generation** → **Agile Project Management**
3. **Team Coordination** → **Task Assignment**

### How to Test Workflows
```bash
# Check n8n status
curl -X GET http://your-n8n-instance/api/v1/health

# Test a workflow
curl -X POST http://your-n8n-instance/webhook/test-endpoint
```

## 🐛 Common Issues and Solutions

### Port Already in Use
```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### TypeScript Errors
```bash
# Check for type errors
npm run type-check

# Fix common issues:
# 1. Check import paths (@/core/ not @/lib/)
# 2. Ensure all required props are passed
# 3. Check interface definitions
```

### Build Failures
```bash
# Clean and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### AI Agents Not Working
```bash
# Check console logs for errors
# Verify environment variables
# Check Supabase connection
# Ensure all dependencies are installed
```

## 📚 Next Steps

### 1. Explore the Codebase
- Start with `src/app/page.tsx` (main dashboard)
- Look at `src/core/components/lcars/` (UI components)
- Examine `src/core/ai-orchestration-engine.ts` (AI system)

### 2. Make a Small Change
- Change a color in the LCARS interface
- Add a new metric to the dashboard
- Modify an AI agent's behavior

### 3. Test Your Changes
- Ensure TypeScript compiles without errors
- Test the application in your browser
- Verify AI agents are still working

### 4. Learn More
- Read the [Architecture Guide](ARCHITECTURE.md)
- Study the [AI Agents Documentation](AI_AGENTS.md)
- Explore the [LCARS System Guide](LCARS_SYSTEM.md)

## 🆘 Getting Help

### When You're Stuck
1. **Check the console** for error messages
2. **Review the troubleshooting guide** for common issues
3. **Examine the AI agent logs** for system issues
4. **Check the n8n workflow status** for automation issues

### Useful Commands
```bash
# Check application status
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000

# Monitor AI agent logs
tail -f logs/ai-agents.log

# Check n8n workflows
npm run deploy:workflow -- --status

# Validate TypeScript
npm run type-check
```

---

**🎯 You're now ready to contribute to AlexAI!**

Remember: The AI agents are here to help you learn and improve the system. Don't hesitate to experiment and ask questions!

*"Make it so!" - Captain Jean-Luc Picard*
