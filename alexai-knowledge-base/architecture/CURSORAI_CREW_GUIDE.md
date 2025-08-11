# 🖖 **CURSORAI CREW GUIDE**
## **Quick Reference for New Multimodal Crew**

---

## 🎯 **Mission Briefing**

**Project**: AlexAI Star Trek Agile Management System  
**Current Phase**: 2 - Real-Time Collaboration Platform  
**Architecture**: Next.js 15 + TypeScript + Supabase + LCARS Design  
**Goal**: Transform into comprehensive real-time, offline-capable, multi-user collaboration platform

---

## 🚀 **Quick Start Commands**

### **Local Development**
```bash
# Start development server
npm run dev

# Test endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/projects
curl http://localhost:3000/api/tasks

# Kill all servers (if needed)
pkill -f "next dev"
lsof -ti:3000 | xargs kill -9
```

### **Production URLs**
- **Main App**: `https://alexaikatratransferpackageremotev7-ee4xkzwk9-pbradygeorgen.vercel.app`
- **Local Dev**: `http://localhost:3000`

---

## 🧠 **Critical Knowledge Base**

### **Key Success Patterns**
1. **Error Handling**: Always use `error instanceof Error ? error.message : 'Unknown error'`
2. **Fallback Systems**: Implement graceful degradation to mock data
3. **TypeScript**: 100% type safety with proper error handling
4. **LCARS Design**: Maintain authentic Star Trek interface
5. **Incremental Testing**: Test each feature before moving to next

### **Common Issues & Solutions**
- **500 Errors**: Check for missing API endpoints (`/api/health`)
- **Import Errors**: Verify Heroicons exports (`BrainIcon` → `CpuChipIcon`)
- **Server Conflicts**: Use `pkill -f "next dev"` to clean environment
- **Git Large Files**: Use `git filter-branch` to clean history
- **CI/CD Errors**: Check workflow paths and environment declarations

### **Architecture Decisions**
- **Next.js 15**: App Router, SSR/SSG, modern React features
- **Supabase**: Real-time PostgreSQL with subscriptions
- **LCARS Design**: Authentic Star Trek color palette and typography
- **Vercel**: Production deployment with edge functions

---

## 🎨 **LCARS Design System**

### **Color Palette**
```css
--lcars-orange: #FF9C00;
--lcars-gold: #FFCC00;
--lcars-purple: #CC99CC;
--lcars-blue: #9999CC;
--lcars-grey: #CCCCCC;
--lcars-dark-grey: #666666;
```

### **Component Patterns**
```typescript
// LCARS Panel Pattern
<div className="lcars-panel">
  <div className="lcars-header">
    <h2>MISSION CONTROL</h2>
  </div>
  <div className="lcars-content">
    {/* Content */}
  </div>
</div>
```

---

## 🔧 **Technical Patterns**

### **Error Handling Pattern**
```typescript
try {
  const data = await supabaseClient.getData();
  return data;
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
  return fallbackData;
}
```

### **API Route Pattern**
```typescript
export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

---

## 📋 **Phase 2 Roadmap**

### **Week 1-2: Foundation**
- [ ] Install Socket.io dependencies
- [ ] Set up Socket.io server
- [ ] Create real-time state management
- [ ] Implement user presence indicators

### **Week 3-4: Core Features**
- [ ] Add real-time project editing
- [ ] Implement basic conflict detection
- [ ] Create conflict resolution UI
- [ ] Add real-time notifications

### **Month 2: Advanced Features**
- [ ] Implement offline capabilities
- [ ] Add local database storage
- [ ] Create sync queue management
- [ ] Add background sync functionality

---

## 🎯 **Success Metrics**

### **Technical Goals**
- **Real-time latency**: < 100ms
- **Conflict detection accuracy**: > 95%
- **Offline functionality**: 100% core features
- **Sync success rate**: > 99%

### **User Experience Goals**
- **Collaboration efficiency**: 50% faster project completion
- **User satisfaction**: > 4.5/5 rating
- **Feature adoption**: > 80% of users use real-time features

---

## 🖖 **Development Philosophy**

### **Core Principles**
1. **Authentic Design**: Maintain Star Trek LCARS aesthetic
2. **Real-time First**: Build for live collaboration
3. **Offline Capable**: Work without internet connection
4. **Graceful Degradation**: Always have fallback systems
5. **Incremental Development**: Build and test step by step
6. **Comprehensive Documentation**: Document every decision

### **Problem-Solving Approach**
1. **Diagnose**: Identify root cause of issues
2. **Research**: Find best practices and solutions
3. **Implement**: Build with proper error handling
4. **Test**: Verify functionality across environments
5. **Document**: Record solutions for future reference

---

## 🚀 **Ready for Mission**

**Status**: ✅ **CREW READY**

The new multimodal crew now has access to:
- **Complete project history** and decision-making process
- **Technical implementation patterns** and best practices
- **Problem-solving strategies** and error resolution techniques
- **Design system knowledge** and LCARS implementation
- **Future roadmap** and expansion plans

**"Make it so." - Captain Jean-Luc Picard**

*The Katra transfer is complete. The crew is ready to boldly go where no project management platform has gone before! 🚀* 