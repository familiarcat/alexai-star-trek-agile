# 🚀 AlexAI Agile Project Management System

A comprehensive, multi-agent Agile project management platform that integrates with your workspace and provides intelligent insights for project development.

## 🌟 Features

### 🤖 Multi-Agent AI System
- **Captain Picard** - Strategic leadership and decision making
- **Counselor Troi** - UX and team morale analysis
- **Mr. Spock** - Logical reasoning and time management
- **Lt. Commander Data** - UI systems and technical implementation
- **Chief Engineer Scott** - Infrastructure and deployment guidance

### 📊 Project Management
- **Multi-Project Support** - Manage multiple projects simultaneously
- **Kanban Boards** - Visual task management with drag-and-drop
- **Sprint Planning** - Agile sprint management and velocity tracking
- **Task Management** - Create, assign, and track tasks with priorities
- **Real-time Updates** - WebSocket-powered live updates

### 🔍 Workspace Integration
- **Automatic Project Detection** - Scans your workspace for existing projects
- **Technology Stack Recognition** - Identifies Next.js, React Native, Terraform, etc.
- **Embedding Generation** - Creates AI embeddings for project context
- **Historical Analysis** - Learns from your project patterns

### 📈 Analytics & Insights
- **Project Metrics** - Completion rates, velocity, and performance tracking
- **AI-Powered Insights** - Get recommendations from all five agents
- **Real-time Dashboards** - Live project status and progress
- **Team Collaboration** - Multi-user support with role-based access

## 🛠️ Technology Stack

- **Backend**: Python Flask with SQLite database
- **Frontend**: Modern HTML/CSS/JavaScript with Tailwind CSS
- **Real-time**: Socket.IO for live updates
- **AI**: OpenAI GPT-4 for multi-agent insights
- **Deployment**: Ready for Vercel, AWS, or local development

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Ensure you have Python 3.8+ installed
python3 --version

# Set up environment variables (already configured)
export OPENAI_API_KEY="your-openai-key"
export SUPABASE_URL="your-supabase-url"
export SUPABASE_KEY="your-supabase-key"
export VERCEL_TOKEN="your-vercel-token"
```

### 2. Deploy the System
```bash
# Make the deployment script executable
chmod +x deploy_agile_system.sh

# Run the deployment
./deploy_agile_system.sh
```

### 3. Access the Dashboard
Open your browser and navigate to: `http://localhost:5000`

## 📋 System Architecture

### Core Components

1. **AgileProjectManager** (`agile_project_manager.py`)
   - Main business logic and database operations
   - Multi-agent AI system integration
   - Project and task management

2. **Web Interface** (`app.py`)
   - Flask web application with REST API
   - Real-time WebSocket communication
   - Modern responsive UI

3. **Database Schema**
   - Projects table: Project metadata and configuration
   - Tasks table: Task management with status tracking
   - Sprints table: Agile sprint planning and metrics

### Multi-Agent System

Each agent has specialized responsibilities:

| Agent | Role | Focus Area |
|-------|------|------------|
| **Captain Picard** | Strategic Leadership | Project vision, resource allocation, risk assessment |
| **Counselor Troi** | UX & Morale | User experience, team well-being, communication |
| **Mr. Spock** | Logic & Time Management | Efficiency, data analysis, process optimization |
| **Lt. Commander Data** | UI Systems | Technical implementation, code quality, system architecture |
| **Chief Engineer Scott** | Infrastructure | Deployment, build systems, DevOps, scalability |

## 🎯 Usage Guide

### Creating Projects

1. **Manual Creation**
   - Click "New Project" on the dashboard
   - Fill in project details and select technology stack
   - Project is automatically added to the system

2. **Workspace Scanning**
   - Click "Scan Workspace" to automatically detect projects
   - System analyzes your `~/Documents/workspace` directory
   - Creates projects based on detected technology stacks

### Managing Tasks

1. **Create Tasks**
   - Navigate to a project's detail page
   - Use the Kanban board to create and organize tasks
   - Assign priorities, story points, and due dates

2. **Track Progress**
   - Move tasks between columns (Todo → In Progress → Review → Done)
   - Real-time updates across all connected clients
   - Automatic metrics calculation

### Getting AI Insights

1. **Multi-Agent Analysis**
   - Click "Get AI Insights" on the dashboard
   - All five agents analyze current project state
   - Receive specialized recommendations from each agent

2. **Context-Aware Recommendations**
   - Agents consider project type, team size, and progress
   - Recommendations are tailored to your specific situation
   - Historical data informs future suggestions

## 🔧 Configuration

### Environment Variables
```bash
# Required for AI functionality
OPENAI_API_KEY=your-openai-api-key

# Optional for enhanced features
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
VERCEL_TOKEN=your-vercel-token
```

### Database Configuration
- SQLite database is automatically created at `agile_manager.db`
- No additional setup required
- Data persists between sessions

## 📊 Project Types Supported

The system automatically detects and supports:

- **Next.js** - React-based web applications
- **React Native** - Mobile applications
- **Terraform** - Infrastructure as Code
- **Python** - Backend and data science projects
- **Node.js** - JavaScript/TypeScript applications
- **AWS Amplify** - Full-stack cloud applications

## 🔄 Integration with Existing Workflow

### Git Integration
- Track project repositories and deployment URLs
- Link to GitHub/GitLab for source control
- Monitor commit activity and deployment status

### CI/CD Pipeline
- Integration with Vercel for automatic deployments
- Support for GitHub Actions and other CI/CD tools
- Real-time deployment status tracking

### Team Collaboration
- Multi-user support with role-based permissions
- Real-time collaboration through WebSocket updates
- Team member assignment and task distribution

## 🚀 Deployment Options

### Local Development
```bash
./deploy_agile_system.sh
```

### Production Deployment
1. **Vercel** (Recommended)
   ```bash
   vercel --prod
   ```

2. **AWS Amplify**
   ```bash
   amplify push
   ```

3. **Docker**
   ```bash
   docker build -t alexai-agile .
   docker run -p 5000:5000 alexai-agile
   ```

## 📈 Metrics and Analytics

### Project Metrics
- **Completion Rate**: Percentage of completed tasks
- **Velocity**: Story points completed per sprint
- **Lead Time**: Time from task creation to completion
- **Cycle Time**: Time tasks spend in active work

### Team Performance
- **Individual Velocity**: Per-team-member productivity
- **Task Distribution**: Workload balance analysis
- **Bottleneck Detection**: Identify process inefficiencies

## 🔮 Future Enhancements

### Planned Features
- **Multimodal AI Integration** - Image and document analysis
- **Advanced Analytics** - Predictive project completion
- **Mobile App** - Native iOS/Android applications
- **Enterprise Features** - SSO, advanced permissions, audit logs

### AI Enhancements
- **Predictive Insights** - Forecast project risks and delays
- **Automated Task Generation** - AI-suggested task breakdown
- **Code Review Integration** - Automated code quality analysis
- **Natural Language Processing** - Voice commands and chat interface

## 🤝 Contributing

This system is part of the AlexAI framework and follows the multi-agent architecture principles. Contributions are welcome through the established AlexAI development process.

## 📄 License

Part of the AlexAI framework - see main project documentation for licensing details.

---

**Made with ❤️ by the AlexAI Multi-Agent System**

*"Make it so." - Captain Jean-Luc Picard* 