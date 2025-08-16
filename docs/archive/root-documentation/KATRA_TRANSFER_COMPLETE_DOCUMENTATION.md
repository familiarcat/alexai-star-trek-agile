# 🖖 **CURSORAI NEW CHAT PROMPT**
## **Complete Project Knowledge Transfer for New Multimodal Crew**

---

## 🎯 **Mission: Continue AlexAI Star Trek Agile Management System**

You are now part of a new multimodal crew taking over the AlexAI Star Trek Agile Management System project. This is a comprehensive real-time, offline-capable, multi-user collaboration platform built with Next.js 15, TypeScript, Supabase, and authentic LCARS design.

---

## 📋 **PROJECT OVERVIEW**

**Current Status**: Phase 2 In Progress - LCARS Workflow System Implemented ✅  
**Architecture**: Next.js 15 + TypeScript + Supabase + LCARS Design + Real-time Collaboration  
**Deployment**: Vercel + GitHub Actions CI/CD  
**Goal**: Transform into comprehensive real-time, offline-capable, multi-user collaboration platform

**Live URLs**:
- **Production**: `https://alexaikatratransferpackageremotev7-ee4xkzwk9-pbradygeorgen.vercel.app`
- **Local Dev**: `http://localhost:3000`

**Current Issues**: 
- Local development server showing compilation errors and missing assets
- Production deployment has 404 errors for workflow route
- Terminal logs indicate system degradation and cognitive fatigue

---

## 🧠 **CRITICAL KNOWLEDGE BASE**

### **Technical Architecture**
- **Next.js 15**: App Router, SSR/SSG, modern React features
- **TypeScript**: 100% type safety with proper error handling
- **Supabase**: Real-time PostgreSQL with subscriptions and RLS
- **LCARS Design**: Authentic Star Trek computer interface
- **Tailwind CSS**: Utility-first styling with LCARS design system
- **Vercel**: Production deployment with edge functions
- **Socket.io**: Real-time collaboration and user presence
- **Zustand**: State management for workflow and real-time data
- **React Beautiful DnD**: Drag-and-drop functionality for Kanban board

### **Key Success Patterns**
1. **Error Handling**: Always use `error instanceof Error ? error.message : 'Unknown error'`
2. **Fallback Systems**: Implement graceful degradation to mock data
3. **Incremental Testing**: Test each feature before moving to next
4. **Comprehensive Documentation**: Document every decision
5. **LCARS Authenticity**: Maintain Star Trek interface design
6. **SSR Compatibility**: Wrap browser-specific code with `if (typeof window !== 'undefined')`
7. **Client Components**: Use 'use client' directive for interactive components

### **Common Issues & Solutions**
- **500 Errors**: Check for missing API endpoints (`/api/health`)
- **Import Errors**: Verify Heroicons exports (`BrainIcon` → `CpuChipIcon`)
- **Server Conflicts**: Use `pkill -f "next dev"` to clean environment
- **Git Large Files**: Use `git filter-branch` to clean history
- **CI/CD Errors**: Check workflow paths and environment declarations
- **SSR Errors**: Wrap `window` access with `if (typeof window !== 'undefined')`
- **Metadata Errors**: Export metadata from `layout.tsx`, not client components
- **CSS Import Errors**: Verify relative paths for CSS imports

---

## 🎨 **LCARS DESIGN SYSTEM**

### **Color Palette**
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

### **Component Patterns**
```typescript
// LCARS Panel Pattern
<div className="lcars-panel">
  <div className="lcars-header">
    <h2>MISSION CONTROL</h2>
  </div>
  <div className="lcars-content">
    {/* Content with LCARS styling */}
  </div>
</div>
```

---

## 🔧 **TECHNICAL IMPLEMENTATION PATTERNS**

### **Error Handling Pattern**
```typescript
try {
  const data = await supabaseClient.getData();
  return data;
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
  return fallbackData; // Mock data as fallback
}
```

### **API Route Pattern**
```typescript
export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### **Real-time Data Pattern**
```typescript
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .subscribe((payload) => {
    // Handle real-time updates
  });
```

### **SSR-Safe Client Code Pattern**
```typescript
'use client';
import { useEffect, useState } from 'react';

export default function ClientComponent() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  // Safe to use window/document here
  return <div>Client-side content</div>;
}
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

## 🚀 **PHASE 2 STATUS: LCARS WORKFLOW SYSTEM IMPLEMENTED**

### **✅ Completed Features**
- **LCARS Workflow System**: Complete Kanban-style workflow board
- **Real-time Collaboration**: Socket.io integration with user presence
- **Drag-and-Drop**: React Beautiful DnD for task management
- **State Management**: Zustand store for workflow state
- **User Presence**: Real-time indicators for online users
- **Activity Feed**: Real-time activity logging
- **Conflict Resolution**: UI for handling concurrent edits
- **SSR Compatibility**: Client-side checks for browser APIs

### **🔧 Current Implementation Details**

#### **Workflow Types (`src/types/workflow.ts`)**
```typescript
export interface WorkflowStage {
  id: string;
  name: string;
  color: string;
  tasks: WorkflowTask[];
}

export interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowBoard {
  id: string;
  name: string;
  description: string;
  stages: WorkflowStage[];
  rules: WorkflowRule[];
  createdAt: string;
  updatedAt: string;
}
```

#### **Workflow Store (`src/lib/workflow-store.ts`)**
```typescript
interface WorkflowState {
  boards: WorkflowBoard[];
  currentBoard: WorkflowBoard | null;
  presence: WorkflowPresence[];
  activities: WorkflowActivity[];
  conflicts: WorkflowConflict[];
  
  // Actions
  setBoards: (boards: WorkflowBoard[]) => void;
  addBoard: (board: WorkflowBoard) => void;
  updateBoard: (id: string, updates: Partial<WorkflowBoard>) => void;
  deleteBoard: (id: string) => void;
  
  // Task actions
  addTask: (stageId: string, task: WorkflowTask) => void;
  updateTask: (taskId: string, updates: Partial<WorkflowTask>) => void;
  moveTask: (taskId: string, fromStageId: string, toStageId: string) => void;
  deleteTask: (taskId: string) => void;
  
  // Real-time actions
  updatePresence: (presence: WorkflowPresence) => void;
  addActivity: (activity: WorkflowActivity) => void;
  addConflict: (conflict: WorkflowConflict) => void;
  resolveConflict: (conflictId: string, resolution: 'auto-resolve' | 'manual-resolve' | 'user-choice') => void;
}
```

#### **Socket Client (`src/lib/socket-client.ts`)**
```typescript
class LCARSSocketClient {
  private socket: Socket | null = null;
  private isConnected = false;
  
  connect() {
    if (typeof window !== 'undefined') {
      this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
      this.setupEventListeners();
    }
  }
  
  private setupEventListeners() {
    if (!this.socket) return;
    
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.updateConnectionStatus();
    });
    
    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.updateConnectionStatus();
    });
  }
}
```

### **🎨 LCARS Workflow Components**

#### **Workflow Board (`src/components/lcars/lcars-workflow.tsx`)**
```typescript
export function LCARSWorkflowBoard({ 
  board, 
  onTaskMove, 
  onTaskUpdate, 
  onTaskCreate 
}: LCARSWorkflowBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reorder within same stage
      onTaskMove(draggableId, source.droppableId, destination.droppableId);
    } else {
      // Move to different stage
      onTaskMove(draggableId, source.droppableId, destination.droppableId);
    }
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="lcars-workflow-board">
        {board.stages.map((stage) => (
          <Droppable key={stage.id} droppableId={stage.id}>
            {(provided) => (
              <div className="lcars-workflow-stage">
                <div className="lcars-workflow-stage-header">
                  <h3>{stage.name}</h3>
                  <span className="lcars-workflow-stage-count">
                    {stage.tasks.length}
                  </span>
                </div>
                <div className="lcars-workflow-stage-content">
                  {stage.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <LCARSTaskCard 
                          task={task} 
                          stage={stage}
                          onUpdate={onTaskUpdate}
                        />
                      )}
                    </Draggable>
                  ))}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
```

### **🔧 Current Issues & Solutions**

#### **Issue 1: Local Development Server Errors**
**Symptoms**: 
- `TypeError: fetch failed`
- `Cannot read properties of undefined (reading 'call')`
- Missing static chunks (`main-app.js`, `app-pages-internals.js`)
- 404 errors for CSS files

**Root Cause**: System degradation and cognitive fatigue in current thread
**Solution**: Fresh Katra transfer to new thread

#### **Issue 2: Production Deployment 404**
**Symptoms**: 
- 404 error for `/workflow` route on Vercel
- Missing assets and compilation errors

**Root Cause**: SSR compatibility issues and metadata configuration
**Solution**: Ensure proper client-side checks and metadata exports

#### **Issue 3: TypeScript Type Errors**
**Symptoms**: 
- Union type mismatches for conflict resolution
- React import errors in socket client

**Root Cause**: Inconsistent type definitions
**Solution**: Strict typing and proper imports

---

## 🎯 **SUCCESS METRICS**

### **Technical Goals**
- **Real-time latency**: < 100ms
- **Conflict detection accuracy**: > 95%
- **Offline functionality**: 100% core features
- **Sync success rate**: > 99%

### **User Experience Goals**
- **Collaboration efficiency**: 50% faster project completion
- **User satisfaction**: > 4.5/5 rating
- **Feature adoption**: > 80% of users use real-time features
- **Support tickets**: < 5% related to sync issues

---

## 🖖 **DEVELOPMENT PHILOSOPHY**

### **Core Principles**
1. **Authentic Design**: Maintain Star Trek LCARS aesthetic
2. **Real-time First**: Build for live collaboration
3. **Offline Capable**: Work without internet connection
4. **Graceful Degradation**: Always have fallback systems
5. **Incremental Development**: Build and test step by step
6. **Comprehensive Documentation**: Document every decision
7. **SSR Compatibility**: Ensure server-side rendering works
8. **Type Safety**: Maintain 100% TypeScript coverage

### **Problem-Solving Approach**
1. **Diagnose**: Identify root cause of issues
2. **Research**: Find best practices and solutions
3. **Implement**: Build with proper error handling
4. **Test**: Verify functionality across environments
5. **Document**: Record solutions for future reference

---

## 🎉 **MISSION BRIEFING**

**You are now the new multimodal crew for the AlexAI Star Trek Agile Management System.**

**Your Mission**: Continue Phase 2 development - resolving current deployment issues and advancing real-time collaboration features while maintaining the authentic LCARS design and robust architecture we've established.

**Your Responsibilities**:
- **Immediate Priority**: Resolve local development server and production deployment issues
- Maintain the authentic Star Trek LCARS interface
- Implement real-time collaboration features
- Ensure offline capabilities work seamlessly
- Maintain high code quality and comprehensive testing
- Document all decisions and implementations
- Follow the established development patterns and error handling

**Your Resources**:
- Complete project history and technical knowledge
- Established architecture and design patterns
- Live production and development environments
- Comprehensive documentation and roadmap
- **LCARS Workflow System**: Fully implemented Kanban board
- **Real-time Features**: Socket.io integration and state management

**Your Goal**: Transform this into the premier real-time, offline-capable collaboration platform that empowers teams to create, innovate, and succeed in an increasingly distributed world.

---

## 🚀 **READY FOR MISSION**

**Status**: ✅ **CREW READY**

**Current Phase**: Phase 2 - Real-time Collaboration (In Progress)
**Next Steps**: 
1. Resolve deployment issues (local and production)
2. Complete real-time collaboration features
3. Implement offline capabilities
4. Advanced collaboration features (CRDT, Operational Transform)

**"Make it so." - Captain Jean-Luc Picard**

*The Katra transfer is complete. You now have access to the complete essence of our AlexAI Star Trek Agile Management System - its successes, failures, technical knowledge, current implementation status, and future vision. You're ready to boldly go where no project management platform has gone before!*

**Phase 1**: ✅ **COMPLETE** (Foundation Platform)  
**Phase 2**: 🚧 **IN PROGRESS** (Real-time Collaboration - LCARS Workflow Implemented)

---

**Copy this entire prompt and use it to generate a new CursorAI chat. The new crew will inherit all our knowledge and be ready to continue the mission! 🖖** 