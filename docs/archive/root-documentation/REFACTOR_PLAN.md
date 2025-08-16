# 🚀 File Structure Refactoring Plan
## Branch: `refactor/file-structure-cleanup`

### 🎯 **Objective**
Reorganize the codebase into a clean, maintainable structure that groups functionality logically and eliminates duplication.

---

## 📊 **Current State Analysis**

### **Issues Identified** ⚠️
1. **Massive API Directory** - 50+ API routes scattered across multiple subdirectories
2. **Duplicate Functionality** - Multiple similar components (e.g., multiple ship computer components)
3. **Inconsistent Naming** - Mix of kebab-case and PascalCase
4. **Scattered LCARS Components** - LCARS components mixed with other functionality
5. **Deep Nesting** - Some directories go 4-5 levels deep
6. **Mixed Concerns** - Business logic mixed with UI components

---

## 🏗️ **Proposed New Structure**

```
src/
├── app/                          # Next.js App Router
│   ├── (features)/              # Feature-based route groups
│   │   ├── agile/               # Agile project management
│   │   ├── analytics/           # Analytics & reporting
│   │   ├── crew/                # Crew coordination
│   │   ├── market-intelligence/ # Market analysis
│   │   ├── n8n/                 # n8n integration
│   │   ├── projects/            # Project management
│   │   ├── workflows/           # Workflow management
│   │   └── youtube/             # YouTube analysis
│   ├── api/                     # Consolidated API routes
│   │   ├── agile/               # Agile-related APIs
│   │   ├── crew/                # Crew coordination APIs
│   │   ├── n8n/                 # n8n integration APIs
│   │   ├── projects/            # Project management APIs
│   │   └── youtube/             # YouTube analysis APIs
│   └── globals.css              # Global styles
├── core/                        # Core application code
│   ├── api/                     # API client utilities
│   ├── components/              # Shared components
│   │   ├── lcars/               # LCARS design system
│   │   ├── ui/                  # Base UI components
│   │   └── forms/               # Form components
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── features/                    # Feature-specific code
│   ├── agile/                   # Agile project management
│   ├── analytics/               # Analytics & reporting
│   ├── crew/                    # Crew coordination
│   ├── market-intelligence/     # Market analysis
│   ├── n8n/                     # n8n integration
│   ├── projects/                # Project management
│   ├── workflows/               # Workflow management
│   └── youtube/                 # YouTube analysis
└── lib/                         # External library integrations
    ├── supabase/                # Supabase client
    └── auth/                    # Authentication utilities
```

---

## 🔄 **Migration Strategy**

### **Phase 1: Core Structure Setup** 🏗️
- [x] Create new directory structure
- [ ] Move shared components to `core/components`
- [ ] Consolidate utility functions to `core/utils`
- [ ] Move types to `core/types`

### **Phase 2: Feature Consolidation** 📦
- [ ] Group related components by feature
- [ ] Move feature-specific logic to `features/` directories
- [ ] Consolidate duplicate components
- [ ] Standardize naming conventions

### **Phase 3: API Route Consolidation** 🌐
- [ ] Group API routes by domain
- [ ] Eliminate duplicate API endpoints
- [ ] Standardize API response formats
- [ ] Implement proper error handling

### **Phase 4: Component Deduplication** 🧹
- [ ] Identify duplicate functionality
- [ ] Merge similar components
- [ ] Create reusable base components
- [ ] Update imports across the codebase

---

## 🎨 **Naming Conventions**

### **Files & Directories**
- **Directories**: kebab-case (`market-intelligence`)
- **Components**: PascalCase (`MarketIntelligenceDashboard`)
- **Utilities**: camelCase (`formatCurrency`)
- **Types**: PascalCase (`ProjectData`)

### **Component Structure**
```
features/market-intelligence/
├── components/           # Feature-specific components
├── hooks/               # Feature-specific hooks
├── types/               # Feature-specific types
├── utils/               # Feature-specific utilities
└── index.ts             # Public API exports
```

---

## 🚫 **What to Eliminate**

### **Duplicate Components**
- Multiple ship computer components → Single `ShipsComputer` component
- Multiple layout components → Unified `LCARSLayout` system
- Scattered UI components → Consolidated in `core/components/ui`

### **Redundant API Routes**
- Multiple crew API endpoints → Single crew coordination API
- Scattered project APIs → Unified project management API
- Duplicate YouTube analysis → Single YouTube analysis API

### **Mixed Concerns**
- Business logic in components → Move to hooks/services
- API logic in components → Move to API utilities
- Styling mixed with logic → Separate concerns

---

## ✅ **Success Criteria**

1. **Reduced Complexity** - Eliminate deep nesting (>3 levels)
2. **Eliminated Duplication** - No duplicate components or functionality
3. **Clear Separation** - Business logic separate from UI components
4. **Consistent Naming** - Standardized naming conventions
5. **Improved Maintainability** - Easier to find and modify code
6. **Better Developer Experience** - Clear import paths and structure

---

## 🔧 **Implementation Steps**

### **Step 1: Setup New Structure** (Current)
- [x] Create new directories
- [ ] Move existing files to new structure
- [ ] Update import statements

### **Step 2: Component Consolidation**
- [ ] Identify duplicate components
- [ ] Create unified base components
- [ ] Update all imports

### **Step 3: API Route Cleanup**
- [ ] Group related API endpoints
- [ ] Eliminate duplicates
- [ ] Standardize responses

### **Step 4: Testing & Validation**
- [ ] Ensure all imports work
- [ ] Test application functionality
- [ ] Validate build process

---

## 📝 **Notes**

- **Preserve Functionality** - Ensure no features are lost during refactoring
- **Incremental Changes** - Make changes in small, testable increments
- **Documentation** - Update README and component documentation
- **Git History** - Maintain clear commit history for rollback if needed

---

*This refactoring will significantly improve code maintainability and developer experience while preserving all existing functionality.*
