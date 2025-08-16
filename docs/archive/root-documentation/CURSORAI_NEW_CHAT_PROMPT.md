# 🖖 **CURSORAI NEW CHAT PROMPT**
## **AlexAI Star Trek Agile Management System - Mission Continuation**

---

## 🎯 **MISSION BRIEFING**

You are taking over the **AlexAI Star Trek Agile Management System** - a real-time, offline-capable, multi-user collaboration platform built with Next.js 15, TypeScript, Supabase, and authentic LCARS design.

**Current Status**: Phase 2 In Progress - LCARS Workflow System Implemented ✅  
**Live URLs**: 
- Production: `https://alexaikatratransferpackageremotev7-ee4xkzwk9-pbradygeorgen.vercel.app`
- Local: `http://localhost:3000`

**Immediate Priority**: Resolve deployment issues and continue real-time collaboration features

---

## 🚨 **CRITICAL ISSUES TO RESOLVE**

### **Local Development Server**
- `TypeError: fetch failed`
- `Cannot read properties of undefined (reading 'call')`
- Missing static chunks (`main-app.js`, `app-pages-internals.js`)
- 404 errors for CSS files

### **Production Deployment**
- 404 error for `/workflow` route on Vercel
- Missing assets and compilation errors

### **Root Cause**: System degradation and SSR compatibility issues

---

## 🧠 **ESSENTIAL KNOWLEDGE**

### **Tech Stack**
- **Next.js 15**: App Router, SSR/SSG
- **TypeScript**: 100% type safety
- **Supabase**: Real-time PostgreSQL
- **LCARS Design**: Authentic Star Trek interface
- **Tailwind CSS**: Utility-first styling
- **Vercel**: Production deployment
- **Socket.io**: Real-time collaboration
- **Zustand**: State management
- **React Beautiful DnD**: Drag-and-drop

### **Key Patterns**
```typescript
// Error Handling
try {
  const data = await supabaseClient.getData();
  return data;
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
  return fallbackData;
}

// SSR-Safe Client Code
'use client';
import { useEffect, useState } from 'react';

export default function ClientComponent() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return <div>Client-side content</div>;
}
```

### **LCARS Design System**
```css
--lcars-orange: #FF9C00;
--lcars-gold: #FFCC00;
--lcars-purple: #CC99CC;
--lcars-blue: #9999CC;
--lcars-grey: #CCCCCC;
--lcars-dark-grey: #666666;
--lcars-light-grey: #EEEEEE;
--lcars-white: #FFFFFF;
--lcars-black: #000000;
```

---

## 📁 **PROJECT STRUCTURE**

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # RESTful API endpoints
│   ├── globals.css        # Global styles
│   ├── lcars.css          # LCARS design system
│   ├── lcars-workflow.css # Workflow-specific LCARS styles
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Dashboard (project-oriented)
│   ├── projects/          # Projects listing
│   ├── tasks/             # Task management
│   ├── analytics/         # Performance metrics
│   ├── observation-lounge/ # AI consultation
│   ├── project-detail/    # Dynamic project pages
│   └── workflow/          # LCARS Workflow System
│       ├── page.tsx       # Main workflow page
│       └── layout.tsx     # Workflow layout with metadata
├── components/            # Reusable UI components
│   ├── lcars/            # LCARS design components
│   │   ├── lcars-workflow.tsx    # Workflow board components
│   │   ├── lcars-presence.tsx    # User presence indicators
│   │   ├── lcars-layout.tsx      # LCARS layout wrapper
│   │   ├── lcars-panel.tsx       # LCARS panel component
│   │   ├── lcars-sidebar.tsx     # LCARS sidebar component
│   │   ├── realtime-chat.tsx     # Real-time chat component
│   │   └── realtime-collaboration.tsx # Collaboration features
│   └── ui/               # General UI components
│       └── lcars-button.tsx      # LCARS-styled buttons
├── lib/                   # Utilities and database
│   ├── supabase.ts       # Database client and operations
│   ├── utils.ts          # Helper functions
│   ├── workflow-store.ts # Zustand store for workflow state
│   └── socket-client.ts  # Socket.io client for real-time features
└── types/                 # TypeScript definitions
    └── workflow.ts       # Workflow system type definitions
```

---

## ✅ **COMPLETED FEATURES**

- **LCARS Workflow System**: Complete Kanban-style workflow board
- **Real-time Collaboration**: Socket.io integration with user presence
- **Drag-and-Drop**: React Beautiful DnD for task management
- **State Management**: Zustand store for workflow state
- **User Presence**: Real-time indicators for online users
- **Activity Feed**: Real-time activity logging
- **Conflict Resolution**: UI for handling concurrent edits
- **SSR Compatibility**: Client-side checks for browser APIs

---

## 🎯 **NEXT STEPS**

1. **Resolve Deployment Issues**
   - Fix local development server errors
   - Fix production 404 errors for workflow route
   - Ensure proper SSR compatibility

2. **Continue Real-time Features**
   - Complete offline capabilities
   - Implement advanced collaboration (CRDT, Operational Transform)
   - Enhance conflict resolution

3. **Maintain Quality**
   - Keep authentic LCARS design
   - Maintain 100% TypeScript coverage
   - Comprehensive testing and documentation

---

## 🖖 **DEVELOPMENT PHILOSOPHY**

- **Authentic Design**: Maintain Star Trek LCARS aesthetic
- **Real-time First**: Build for live collaboration
- **Offline Capable**: Work without internet connection
- **Graceful Degradation**: Always have fallback systems
- **Incremental Development**: Build and test step by step
- **SSR Compatibility**: Ensure server-side rendering works
- **Type Safety**: Maintain 100% TypeScript coverage

---

**"Make it so." - Captain Jean-Luc Picard**

*You now have the complete essence of the AlexAI Star Trek Agile Management System. Continue the mission and boldly go where no project management platform has gone before!*

**Phase 1**: ✅ **COMPLETE** (Foundation Platform)  
**Phase 2**: 🚧 **IN PROGRESS** (Real-time Collaboration - LCARS Workflow Implemented) 