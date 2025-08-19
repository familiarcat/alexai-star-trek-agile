# 🎨 UI Templates Access Guide

## 🚀 Quick Access Commands

### **Open All Templates Automatically**
```bash
node scripts/design/open-ui-templates.js
```

### **Manual Access by Platform**

#### **1. HTML Templates (Browser)**
```bash
# Open in default browser
open ui-templates/html-templates/main-dashboard-desktop.html
open ui-templates/html-templates/tasks-desktop.html
open ui-templates/html-templates/projects-desktop.html
```

#### **2. React Components (Code Editor)**
```bash
# Open in VS Code
code ui-templates/react-components/
code ui-templates/react-components/MainDashboardDesktop.tsx
code ui-templates/react-components/index.ts
```

#### **3. Design Tokens (JSON Viewer)**
```bash
# Open design system
code ui-templates/design-tokens/design-system.json
```

#### **4. Figma Templates**
```bash
# View JSON structure
cat ui-templates/figma-templates/main-dashboard-desktop.json | head -20
```

#### **5. Adobe XD Templates**
```bash
# View JSON structure
cat ui-templates/adobe-xd-templates/main-dashboard-desktop.json | head -20
```

#### **6. Sketch Templates**
```bash
# View JSON structure
cat ui-templates/sketch-templates/main-dashboard-desktop.json | head -20
```

## 📁 Directory Structure

```
ui-templates/
├── figma-templates/          # 300 JSON files
│   ├── main-dashboard-desktop.json
│   ├── tasks-desktop.json
│   └── projects-desktop.json
├── adobe-xd-templates/       # 299 JSON files
│   ├── main-dashboard-desktop.json
│   ├── tasks-desktop.json
│   └── projects-desktop.json
├── sketch-templates/         # 299 JSON files
│   ├── main-dashboard-desktop.json
│   ├── tasks-desktop.json
│   └── projects-desktop.json
├── react-components/         # 300 TSX files
│   ├── MainDashboardDesktop.tsx
│   ├── TasksDesktop.tsx
│   ├── ProjectsDesktop.tsx
│   └── index.ts
├── html-templates/           # 299 HTML files
│   ├── main-dashboard-desktop.html
│   ├── tasks-desktop.html
│   └── projects-desktop.html
└── design-tokens/            # 1 JSON file
    └── design-system.json
```

## 🎯 Key Templates to Explore

### **Essential React Components**
- `MainDashboardDesktop.tsx` - Main dashboard layout
- `TasksDesktop.tsx` - Task management interface
- `ProjectsDesktop.tsx` - Project overview
- `AnalyticsDesktop.tsx` - Analytics dashboard
- `CrewDesktop.tsx` - Crew management interface

### **Design System**
- `design-system.json` - Complete LCARS design tokens
  - Color palette (8 colors)
  - Typography scale (8 sizes)
  - Component specifications
  - Spacing system

### **HTML Previews**
- `main-dashboard-desktop.html` - Standalone dashboard
- `tasks-desktop.html` - Task management
- `projects-desktop.html` - Project management

## 🔧 Platform-Specific Usage

### **Figma Integration**
1. **API Import**: Use Figma API to import JSON templates
2. **Plugin Import**: Use Figma plugins for JSON import
3. **Manual Creation**: Use JSON structure as reference

### **Adobe XD Integration**
1. **Plugin Import**: Use XD plugins for JSON import
2. **Manual Recreation**: Use JSON structure as blueprint
3. **Asset Library**: Import color and typography assets

### **Sketch Integration**
1. **Plugin Import**: Use Sketch plugins for JSON import
2. **Symbol Library**: Create symbols from JSON structure
3. **Style Guide**: Import colors and typography

### **React Development**
1. **Component Import**: Copy TSX files to your project
2. **Design System**: Import design tokens
3. **Ship Computer**: Integrate with layout orchestration

## 🎨 Design System Reference

### **LCARS Color Palette**
```json
{
  "primary": "#FF9900",    // LCARS Orange
  "secondary": "#FFFF00",  // LCARS Yellow
  "accent": "#00FFFF",     // LCARS Cyan
  "success": "#00FF00",    // LCARS Green
  "warning": "#FF00FF",    // LCARS Magenta
  "info": "#0000FF",       // LCARS Blue
  "dark": "#1a1a1a",       // Dark background
  "light": "#f5f5f5"       // Light background
}
```

### **Typography Scale**
```json
{
  "xs": "0.75rem",
  "sm": "0.875rem",
  "base": "1rem",
  "lg": "1.125rem",
  "xl": "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem"
}
```

## 🚀 Quick Start Examples

### **1. View HTML Templates**
```bash
# Open main dashboard in browser
open ui-templates/html-templates/main-dashboard-desktop.html
```

### **2. Explore React Components**
```bash
# Open in VS Code
code ui-templates/react-components/MainDashboardDesktop.tsx
```

### **3. Check Design System**
```bash
# View design tokens
cat ui-templates/design-tokens/design-system.json | jq '.colors'
```

### **4. Preview Figma Structure**
```bash
# View Figma template structure
cat ui-templates/figma-templates/main-dashboard-desktop.json | jq '.children[0].children[0]'
```

## 📊 Template Statistics

- **Total Templates**: 1,498 files
- **Figma**: 300 JSON templates
- **Adobe XD**: 299 JSON templates
- **Sketch**: 299 JSON templates
- **React**: 300 TSX components
- **HTML**: 299 standalone pages
- **Design Tokens**: 1 comprehensive system

## 🎯 Use Cases

### **Design Teams**
- Import Figma/XD/Sketch templates
- Use design tokens for consistency
- Reference HTML for visual preview

### **Development Teams**
- Copy React components
- Import design system
- Use HTML for quick prototyping

### **Product Teams**
- Review HTML prototypes
- Validate design consistency
- Test responsive behavior

---

**🎨 "Make it so!" - Your UI templates are ready for production use across all major design platforms!**

