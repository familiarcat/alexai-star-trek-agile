# 🖖 AlexAI Star Trek Agile System

> **A modern AI-powered agile project management system with authentic Star Trek TNG LCARS interface**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🎯 **Project Overview**

AlexAI Star Trek Agile System is a comprehensive project management platform that combines modern web technologies with the iconic Star Trek: The Next Generation LCARS interface. Built with Next.js 15, TypeScript, and Tailwind CSS, it provides an intuitive, AI-enhanced project management experience.

### **Key Features**
- 🤖 **Multi-Agent AI System** - Star Trek crew-inspired AI agents
- 📊 **Three-Tier Architecture** - Dashboard, Projects, and AI Consultation
- 🎨 **Authentic LCARS UI** - True-to-series Star Trek TNG interface
- 🚀 **Universal Deployment** - Local, Vercel, and Docker support
- 📱 **Responsive Design** - Works on all devices
- 🔄 **Real-Time Updates** - Live data synchronization
- 🛡️ **Type Safety** - Full TypeScript implementation

## 🏗️ **Architecture**

```
alexai-star-trek-agile/
├── 📁 src/                    # Modern Next.js Application
│   ├── 📁 app/               # App Router (Next.js 15)
│   │   ├── 📄 page.tsx      # Dashboard (Home)
│   │   ├── 📁 projects/     # Project Management
│   │   ├── 📁 observation-lounge/ # AI Consultation
│   │   ├── 📁 project-detail/ # Individual Projects
│   │   └── 📁 alexai/       # AI System Monitoring
│   ├── 📁 components/        # React Components
│   │   ├── 📁 lcars/        # LCARS UI Components
│   │   └── 📁 ui/           # Generic UI Components
│   └── 📁 lib/              # Utilities & Helpers
├── 📁 public/                # Static Assets
│   ├── 📁 assets/           # CSS, JS, Images
│   └── 📄 favicon.ico       # Site Icon
├── 📁 scripts/               # Build & Deployment Scripts
│   └── 📁 deploy/           # CI/CD Automation
├── 📁 docs/                  # Documentation
│   ├── 📁 guides/           # User & Developer Guides
│   ├── 📁 api/              # API Documentation
│   └── 📁 archive/          # Historical Documentation
├── 📁 tests/                 # Test Suite
├── 📁 storage/               # Data Storage
├── 📁 logs/                  # Application Logs
├── 📄 server.js             # Express.js API Server
├── 📄 package.json          # Dependencies & Scripts
├── 📄 tsconfig.json         # TypeScript Configuration
├── 📄 next.config.ts        # Next.js Configuration
├── 📄 vercel.json           # Vercel Deployment
├── 📄 docker-compose.yml    # Docker Services
└── 📄 Dockerfile            # Docker Build
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Git for version control

### **1. Clone & Install**
```bash
# Clone the repository
git clone https://github.com/familiarcat/alexai-star-trek-agile.git
cd alexai-star-trek-agile

# Install dependencies
npm install
```

### **2. Start Development**
```bash
# Start Next.js development server (Frontend)
npm run dev
# 🌐 http://localhost:3000

# Start Express.js API server (Backend)
npm run server
# 🔌 http://localhost:8000
```

### **3. Access the Application**
- **Dashboard**: http://localhost:3000
- **API Health**: http://localhost:8000/api/health
- **Projects**: http://localhost:3000/projects
- **AI Consultation**: http://localhost:3000/observation-lounge

## 🎮 **Usage Guide**

### **Dashboard** (`/`)
The main command center displaying:
- Project statistics and metrics
- Recent project activity
- Quick action buttons
- System status indicators

### **Projects** (`/projects`)
Comprehensive project management:
- Project listing with search and filters
- Status indicators (Active, Completed, On Hold)
- Priority levels and progress tracking
- Create new projects or import existing ones

### **Observation Lounge** (`/observation-lounge`)
AI consultation interface:
- Select from Star Trek crew-inspired AI agents
- Real-time chat interface
- Agent specialties and capabilities
- Project recommendations and insights

### **Project Detail** (`/project-detail`)
Individual project management:
- Detailed project information
- Task management and tracking
- Team member assignments
- Progress visualization
- File attachments and documentation

### **AlexAI Core** (`/alexai`)
AI system monitoring:
- Agent status and performance
- System metrics and analytics
- AI model health monitoring
- Configuration and settings

## 🛠️ **Development**

### **Available Scripts**
```bash
# Development
npm run dev          # Start Next.js development server
npm run server       # Start Express.js API server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run test suite
npm run lint         # Lint code with ESLint

# Deployment
npm run deploy       # Deploy to Vercel
./deploy-full-cicd.sh all  # Full CI/CD pipeline
```

### **Technology Stack**
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, Socket.IO, SQLite3
- **AI**: OpenAI integration, custom AI agents
- **Deployment**: Vercel, Docker, GitHub Actions
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint, TypeScript strict mode

### **Key Dependencies**
```json
{
  "next": "15.4.5",
  "react": "19.1.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@heroicons/react": "^2.1.1",
  "express": "^4.18.2",
  "socket.io": "^4.7.2",
  "sqlite3": "^5.1.6"
}
```

## 🚀 **Deployment**

### **Local Development**
```bash
# Start both frontend and backend
npm run dev & npm run server
```

### **Vercel Deployment**
```bash
# Deploy to Vercel
npm run deploy

# Or use the automated script
./deploy-full-cicd.sh vercel
```

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individual containers
docker build -t alexai-agile .
docker run -p 3000:3000 alexai-agile
```

### **CI/CD Pipeline**
```bash
# Trigger full CI/CD pipeline
./deploy-full-cicd.sh all

# Monitor deployment
./scripts/deploy/full-cicd-deploy.sh status
```

## 📊 **API Reference**

### **Core Endpoints**
```bash
# Health Check
GET /api/health

# Dashboard Statistics
GET /api/dashboard/stats

# Project Management
GET /api/projects
GET /api/projects/:id
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id

# Sample Data
POST /api/projects/sample
```

### **Response Format**
```json
{
  "status": "success",
  "data": {
    "projects": [...],
    "metrics": {
      "total_projects": 15,
      "active_projects": 8,
      "completed_projects": 5
    }
  },
  "timestamp": "2025-08-07T19:00:00.000Z"
}
```

## 🎨 **LCARS Design System**

The application uses an authentic Star Trek: The Next Generation LCARS (Library Computer Access/Retrieval System) interface:

### **Color Palette**
- **Primary**: Orange (#FF6B35)
- **Secondary**: Blue (#4A90E2)
- **Accent**: Purple (#9B59B6)
- **Background**: Dark (#1A1A1A)
- **Text**: Light (#FFFFFF)

### **Typography**
- **Headers**: LCARS-style geometric fonts
- **Body**: Clean, readable sans-serif
- **Code**: Monospace for technical content

### **Layout Principles**
- **Asymmetric Design**: Non-uniform grid layouts
- **Rounded Corners**: Soft, organic shapes
- **Color Coding**: Functional color associations
- **Minimalist**: Clean, uncluttered interfaces

## 🤖 **AI Integration**

### **AI Agents**
The system features AI agents inspired by Star Trek crew members:

- **Captain Picard** - Strategic planning and decision making
- **Commander Data** - Data analysis and pattern recognition
- **Counselor Troi** - Team dynamics and communication
- **Chief O'Brien** - Technical implementation and optimization
- **Dr. Crusher** - Quality assurance and risk assessment

### **Capabilities**
- Project recommendations
- Risk assessment
- Team optimization
- Performance analytics
- Automated reporting

## 🧪 **Testing**

### **Run Tests**
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### **Test Structure**
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data
```

## 📚 **Documentation**

### **Guides**
- [Development Guide](docs/guides/development/)
- [Deployment Guide](docs/guides/deployment/)
- [User Guide](docs/guides/user/)
- [API Documentation](docs/api/)

### **Architecture**
- [System Architecture](docs/architecture/)
- [Database Schema](docs/architecture/database/)
- [Component Library](docs/architecture/components/)

### **Features**
- [AI Integration](docs/features/ai/)
- [LCARS Design System](docs/features/lcars/)
- [Project Management](docs/features/projects/)

## 🔧 **Configuration**

### **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
OPENAI_API_KEY=your_openai_key
DATABASE_URL=sqlite:./agile_manager.db
NODE_ENV=development
```

### **Vercel Configuration**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**
- Follow TypeScript strict mode
- Use ESLint for code linting
- Write tests for new features
- Follow LCARS design principles
- Document API changes

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Star Trek: The Next Generation** - For the LCARS design inspiration
- **Next.js Team** - For the amazing React framework
- **Vercel** - For seamless deployment platform
- **Tailwind CSS** - For utility-first CSS framework

## 🆘 **Support**

### **Common Issues**
- **Port conflicts**: Ensure ports 3000 and 8000 are available
- **Database issues**: Check SQLite file permissions
- **Build errors**: Verify Node.js version (18.0.0+)
- **Deployment issues**: Check Vercel configuration

### **Getting Help**
- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/familiarcat/alexai-star-trek-agile/issues)
- 💬 [Discussions](https://github.com/familiarcat/alexai-star-trek-agile/discussions)

---

**🖖 Live Long and Prosper**

*"Make it so." - Captain Jean-Luc Picard*

---

**Version**: 2.0.0  
**Last Updated**: August 7, 2025  
**Status**: ✅ Production Ready
