# 📁 Project Structure Guide

> **Clear organization and purpose for every file and folder in the AlexAI Star Trek Agile System**

## 🎯 **Overview**

This document provides a comprehensive breakdown of the project structure, explaining the purpose and organization of every component. The structure follows modern Next.js 15 conventions while maintaining clear separation of concerns.

## 🏗️ **Root Level Structure**

```
alexai-star-trek-agile/
├── 📁 src/                    # 🎨 Modern Next.js Application
├── 📁 public/                 # 🖼️ Static Assets
├── 📁 scripts/                # ⚙️ Build & Deployment
├── 📁 docs/                   # 📚 Documentation
├── 📁 tests/                  # 🧪 Test Suite
├── 📁 storage/                # 💾 Data Storage
├── 📁 logs/                   # 📝 Application Logs
├── 📁 .github/                # 🔄 CI/CD Workflows
├── 📄 server.js              # 🔌 Express.js API Server
├── 📄 package.json           # 📦 Dependencies & Scripts
├── 📄 tsconfig.json          # 🔧 TypeScript Config
├── 📄 next.config.ts         # ⚡ Next.js Config
├── 📄 vercel.json            # 🚀 Vercel Deployment
├── 📄 docker-compose.yml     # 🐳 Docker Services
├── 📄 Dockerfile             # 🐳 Docker Build
├── 📄 README.md              # 📖 Main Documentation
└── 📄 PROJECT_STRUCTURE.md   # 📁 This File
```

## 🎨 **Frontend Application (`src/`)**

### **Purpose**: Modern Next.js 15 application with App Router

```
src/
├── 📁 app/                    # 🎯 Next.js 15 App Router
│   ├── 📄 page.tsx           # 🏠 Dashboard (Home Page)
│   ├── 📄 layout.tsx         # 🎨 Root Layout Component
│   ├── 📄 globals.css        # 🎨 Global Styles
│   ├── 📄 favicon.ico        # 🖼️ Site Icon
│   ├── 📁 projects/          # 📋 Project Management
│   │   └── 📄 page.tsx       # 📋 Projects List Page
│   ├── 📁 observation-lounge/ # 🤖 AI Consultation
│   │   └── 📄 page.tsx       # 🤖 AI Chat Interface
│   ├── 📁 project-detail/    # 📊 Individual Projects
│   │   └── 📄 page.tsx       # 📊 Project Details Page
│   └── 📁 alexai/            # 🧠 AI System Monitoring
│       └── 📄 page.tsx       # 🧠 AI Core Dashboard
├── 📁 components/             # 🧩 React Components
│   ├── 📁 lcars/             # 🖖 LCARS UI Components
│   │   ├── 📄 lcars-layout.tsx    # 🎨 LCARS Layout
│   │   ├── 📄 lcars-sidebar.tsx   # 📋 LCARS Sidebar
│   │   └── 📄 lcars-panel.tsx     # 🎛️ LCARS Panel
│   └── 📁 ui/                # 🎨 Generic UI Components
│       └── 📄 lcars-button.tsx    # 🔘 LCARS Button
├── 📁 lib/                   # 🛠️ Utilities & Helpers
├── 📁 types/                 # 🔧 TypeScript Types
└── 📁 hooks/                 # 🎣 React Hooks
```

### **Key Features**:
- **App Router**: Next.js 15 file-based routing
- **TypeScript**: Full type safety
- **LCARS Design**: Authentic Star Trek UI components
- **Responsive**: Mobile-first design
- **SEO Optimized**: Meta tags and structured data

## 🖼️ **Static Assets (`public/`)**

### **Purpose**: Static files served directly by the web server

```
public/
├── 📁 assets/                # 🎨 CSS, JS, Images
│   ├── 📄 lcars.css         # 🖖 LCARS Design System
│   ├── 📄 data-translator.js # 🔄 Data Transformation
│   └── 📁 images/           # 🖼️ Image Assets
├── 📄 favicon.ico           # 🖼️ Browser Icon
├── 📄 next.svg              # ⚡ Next.js Logo
├── 📄 vercel.svg            # 🚀 Vercel Logo
└── 📄 globe.svg             # 🌍 Globe Icon
```

### **Key Features**:
- **LCARS CSS**: Authentic Star Trek styling
- **Data Translator**: Unified data layer
- **Optimized Assets**: Compressed and optimized
- **CDN Ready**: Cacheable static content

## ⚙️ **Build & Deployment (`scripts/`)**

### **Purpose**: Automation scripts for development and deployment

```
scripts/
├── 📁 deploy/                # 🚀 Deployment Scripts
│   ├── 📄 full-cicd-deploy.sh    # 🔄 Full CI/CD Pipeline
│   ├── 📁 local/             # 💻 Local Development
│   ├── 📁 production/        # 🌐 Production Deployment
│   └── 📁 vercel/            # 🚀 Vercel Deployment
├── 📁 setup/                 # ⚙️ Setup Scripts
│   ├── 📁 environment/       # 🌍 Environment Setup
│   ├── 📁 onboarding/        # 👥 Team Onboarding
│   └── 📄 bootstrap.sh       # 🚀 Project Bootstrap
├── 📁 maintenance/           # 🔧 Maintenance Scripts
│   ├── 📁 backup/            # 💾 Backup Operations
│   ├── 📁 cleanup/           # 🧹 Cleanup Operations
│   └── 📁 testing/           # 🧪 Test Automation
└── 📄 consolidate-project.sh # 🔄 Project Consolidation
```

### **Key Features**:
- **Automated Deployment**: One-command deployment
- **Environment Setup**: Automated configuration
- **CI/CD Integration**: GitHub Actions support
- **Maintenance Tools**: Backup and cleanup scripts

## 📚 **Documentation (`docs/`)**

### **Purpose**: Comprehensive project documentation

```
docs/
├── 📁 guides/                # 📖 User & Developer Guides
│   ├── 📁 development/       # 👨‍💻 Development Guide
│   ├── 📁 deployment/        # 🚀 Deployment Guide
│   ├── 📁 user/              # 👤 User Guide
│   ├── 📄 full-cicd-setup.md     # 🔄 CI/CD Setup
│   ├── 📄 automated_deployment.md # 🤖 Auto Deployment
│   ├── 📄 vercel_setup.md        # 🚀 Vercel Setup
│   └── 📄 quick_deployment.md    # ⚡ Quick Deploy
├── 📁 api/                   # 🔌 API Documentation
│   ├── 📁 endpoints/         # 📍 API Endpoints
│   └── 📁 examples/          # 💡 API Examples
├── 📁 architecture/          # 🏗️ System Architecture
│   ├── 📁 decisions/         # 🤔 Architecture Decisions
│   ├── 📁 diagrams/          # 📊 System Diagrams
│   └── 📁 database/          # 🗄️ Database Schema
├── 📁 features/              # ✨ Feature Documentation
│   ├── 📁 ai/                # 🤖 AI Integration
│   ├── 📁 lcars/             # 🖖 LCARS Design
│   └── 📁 projects/          # 📋 Project Management
├── 📁 reports/               # 📊 Analysis Reports
│   ├── 📁 analysis_reports/  # 📈 Analysis Results
│   ├── 📁 deployment_reports/ # 🚀 Deployment Status
│   └── 📁 status_reports/    # 📊 System Status
└── 📁 archive/               # 📦 Historical Documentation
    ├── 📄 *MIGRATION*.md     # 🔄 Migration History
    ├── 📄 *STATUS*.md        # 📊 Status Reports
    └── 📄 *ANALYSIS*.md      # 📈 Analysis Reports
```

### **Key Features**:
- **Comprehensive Coverage**: All aspects documented
- **User-Friendly**: Clear, accessible language
- **Searchable**: Well-organized structure
- **Historical**: Archived for reference

## 🧪 **Test Suite (`tests/`)**

### **Purpose**: Comprehensive testing infrastructure

```
tests/
├── 📁 unit/                  # 🧪 Unit Tests
│   ├── 📁 components/        # 🧩 Component Tests
│   ├── 📁 utils/             # 🛠️ Utility Tests
│   └── 📁 api/               # 🔌 API Tests
├── 📁 integration/           # 🔗 Integration Tests
│   ├── 📁 api/               # 🔌 API Integration
│   ├── 📁 database/          # 🗄️ Database Tests
│   └── 📁 auth/              # 🔐 Authentication
├── 📁 e2e/                   # 🌐 End-to-End Tests
│   ├── 📁 user-flows/        # 👤 User Journey Tests
│   ├── 📁 critical-paths/    # 🚨 Critical Path Tests
│   └── 📁 performance/       # ⚡ Performance Tests
├── 📁 fixtures/              # 📋 Test Data
│   ├── 📁 data/              # 📊 Sample Data
│   └── 📁 mocks/             # 🎭 Mock Objects
└── 📁 reports/               # 📊 Test Reports
    ├── 📄 test_report.json   # 📈 Test Results
    └── 📄 coverage.json      # 📊 Coverage Report
```

### **Key Features**:
- **Comprehensive Coverage**: Unit, integration, and E2E tests
- **Realistic Data**: Fixtures and mocks
- **Performance Testing**: Load and stress tests
- **Automated Reports**: Coverage and results tracking

## 💾 **Data Storage (`storage/`)**

### **Purpose**: Application data and persistent storage

```
storage/
├── 📁 database/              # 🗄️ Database Files
│   ├── 📁 migrations/        # 🔄 Database Migrations
│   ├── 📁 seeds/             # 🌱 Seed Data
│   └── 📄 agile_manager.db   # 🗄️ SQLite Database
├── 📁 uploads/               # 📤 User Uploads
│   ├── 📁 documents/         # 📄 Document Storage
│   ├── 📁 images/            # 🖼️ Image Storage
│   └── 📁 attachments/       # 📎 File Attachments
├── 📁 cache/                 # ⚡ Cache Storage
│   ├── 📁 api/               # 🔌 API Cache
│   └── 📁 assets/            # 🎨 Asset Cache
└── 📁 backups/               # 💾 Backup Storage
    ├── 📁 daily/             # 📅 Daily Backups
    ├── 📁 weekly/            # 📅 Weekly Backups
    └── 📁 monthly/           # 📅 Monthly Backups
```

### **Key Features**:
- **SQLite Database**: Lightweight, file-based database
- **File Uploads**: Secure file storage
- **Caching**: Performance optimization
- **Backup System**: Data protection

## 📝 **Application Logs (`logs/`)**

### **Purpose**: Application logging and monitoring

```
logs/
├── 📄 app.log               # 📱 Application Logs
├── 📄 error.log             # ❌ Error Logs
├── 📄 access.log            # 🔍 Access Logs
├── 📄 performance.log       # ⚡ Performance Logs
├── 📄 security.log          # 🔒 Security Logs
└── 📁 archived/             # 📦 Archived Logs
    ├── 📁 daily/            # 📅 Daily Archives
    ├── 📁 weekly/           # 📅 Weekly Archives
    └── 📁 monthly/          # 📅 Monthly Archives
```

### **Key Features**:
- **Structured Logging**: JSON format logs
- **Log Rotation**: Automatic archiving
- **Error Tracking**: Detailed error information
- **Performance Monitoring**: Response time tracking

## 🔄 **CI/CD Workflows (`.github/`)**

### **Purpose**: Automated development and deployment pipelines

```
.github/
├── 📁 workflows/             # 🔄 GitHub Actions
│   ├── 📄 full-cicd-pipeline.yml    # 🔄 Full CI/CD
│   ├── 📄 nextjs-ci-cd.yml          # ⚡ Next.js Pipeline
│   ├── 📄 test-automation.yml       # 🧪 Test Automation
│   └── 📄 deployment.yml            # 🚀 Deployment
├── 📁 ISSUE_TEMPLATE/        # 📋 Issue Templates
│   ├── 📄 bug_report.md      # 🐛 Bug Report Template
│   ├── 📄 feature_request.md # ✨ Feature Request
│   └── 📄 documentation.md   # 📚 Documentation Request
└── 📁 PULL_REQUEST_TEMPLATE/ # 🔄 PR Templates
    └── 📄 pull_request_template.md  # 🔄 PR Template
```

### **Key Features**:
- **Automated Testing**: Runs on every commit
- **Deployment Pipeline**: Automated deployment
- **Quality Gates**: Code quality checks
- **Issue Management**: Structured issue tracking

## 🔧 **Configuration Files**

### **Root Level Configuration**

| File | Purpose | Technology |
|------|---------|------------|
| `package.json` | Dependencies & scripts | Node.js |
| `tsconfig.json` | TypeScript configuration | TypeScript |
| `next.config.ts` | Next.js configuration | Next.js |
| `vercel.json` | Vercel deployment config | Vercel |
| `docker-compose.yml` | Multi-container setup | Docker |
| `Dockerfile` | Container build instructions | Docker |
| `server.js` | Express.js API server | Node.js |
| `.env` | Environment variables | Environment |
| `.gitignore` | Git ignore patterns | Git |

### **Key Features**:
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Universal Deployment**: Local, Vercel, Docker support
- **Type Safety**: Full TypeScript implementation
- **Environment Management**: Secure configuration

## 🎯 **File Naming Conventions**

### **Components**
- **React Components**: `PascalCase.tsx` (e.g., `LcarsButton.tsx`)
- **Pages**: `page.tsx` (Next.js App Router)
- **Layouts**: `layout.tsx` (Next.js App Router)
- **Utilities**: `camelCase.ts` (e.g., `dataTranslator.ts`)

### **Styles**
- **Global Styles**: `globals.css`
- **Component Styles**: `ComponentName.module.css`
- **LCARS Styles**: `lcars.css`

### **Configuration**
- **TypeScript**: `tsconfig.json`
- **Next.js**: `next.config.ts`
- **ESLint**: `.eslintrc.js`
- **Tailwind**: `tailwind.config.ts`

### **Scripts**
- **Shell Scripts**: `kebab-case.sh` (e.g., `deploy-full-cicd.sh`)
- **Node Scripts**: `camelCase.js` (e.g., `server.js`)

## 🔍 **Finding Files**

### **Quick Reference**

| What You're Looking For | Where to Find It |
|-------------------------|------------------|
| **React Components** | `src/components/` |
| **Pages** | `src/app/` |
| **API Routes** | `server.js` |
| **Styles** | `src/app/globals.css` or `public/assets/` |
| **Configuration** | Root directory |
| **Documentation** | `docs/` |
| **Tests** | `tests/` |
| **Scripts** | `scripts/` |
| **Database** | `storage/database/` |
| **Logs** | `logs/` |

### **Search Tips**
- **Components**: Look in `src/components/`
- **Pages**: Look in `src/app/`
- **API**: Look in `server.js`
- **Configuration**: Look in root directory
- **Documentation**: Look in `docs/`

## 🎉 **Benefits of This Structure**

### **Developer Experience**
- ✅ **Clear Organization**: Logical file grouping
- ✅ **Easy Navigation**: Intuitive folder structure
- ✅ **Scalable**: Grows with the project
- ✅ **Maintainable**: Easy to understand and modify

### **Performance**
- ✅ **Optimized Builds**: Efficient bundling
- ✅ **Fast Loading**: Optimized assets
- ✅ **Caching**: Strategic cache placement
- ✅ **CDN Ready**: Static asset optimization

### **Deployment**
- ✅ **Universal**: Works everywhere
- ✅ **Automated**: CI/CD integration
- ✅ **Reliable**: Tested deployment process
- ✅ **Scalable**: Handles growth

---

**🖖 This structure ensures that every file has a purpose and every purpose has a place.**

*"The needs of the many outweigh the needs of the few." - Spock* 