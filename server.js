#!/usr/bin/env node
/**
 * AlexAI Star Trek Agile System - JavaScript Server
 * Express + Socket.IO backend replacing Python Flask
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import our modules
const AgileProjectManager = require('./src/core/AgileProjectManager');
const AlexAICore = require('./src/core/AlexAICore');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize managers
const projectManager = new AgileProjectManager();
const alexai = new AlexAICore();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/observation-lounge', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'observation-lounge.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

// API Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await projectManager.getProjects();
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await projectManager.createProject(req.body);
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await projectManager.getProject(req.params.id);
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/projects/:id/insights', async (req, res) => {
  try {
    const insights = await alexai.getMultiAgentInsights(req.params.id);
    res.json({ success: true, insights });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/projects/sample', async (req, res) => {
  try {
    const result = await projectManager.createMockData();
    res.json({ success: true, message: 'Sample projects created', ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await projectManager.updateProject({ id: req.params.id, ...req.body });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tasks API
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await projectManager.getTasks();
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = await projectManager.createTask(req.body);
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await projectManager.getTask(req.params.id);
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await projectManager.updateTask({ id: req.params.id, ...req.body });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await projectManager.deleteTask(req.params.id);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/tasks/:id/status', async (req, res) => {
  try {
    const task = await projectManager.updateTask({ 
      id: req.params.id, 
      status: req.body.status 
    });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard API
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = await projectManager.getDashboardStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/dashboard/recent-tasks', async (req, res) => {
  try {
    const tasks = await projectManager.getTasks();
    const recentTasks = tasks.slice(0, 5); // Get last 5 tasks
    res.json({ success: true, tasks: recentTasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AlexAI API
app.get('/api/alexai/status', async (req, res) => {
  try {
    const crewStatus = await alexai.getCrewStatus();
    const systemHealth = await alexai.getSystemHealth();
    res.json({ 
      success: true, 
      crew_status: crewStatus,
      system_health: systemHealth
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/alexai/consultation', async (req, res) => {
  try {
    const result = await alexai.consultation(req.body.context);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/alexai/mode', async (req, res) => {
  try {
    const mode = await alexai.getCurrentMode();
    res.json({ success: true, mode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/alexai/mode', async (req, res) => {
  try {
    const result = await alexai.setMode(req.body.mode);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/alexai/insights', async (req, res) => {
  try {
    const insights = await alexai.getLatestAnalysis();
    res.json({ success: true, insights });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/database/mock', async (req, res) => {
  try {
    const result = await projectManager.createMockData();
    res.json({
      success: true,
      message: 'Database mock system completed successfully!',
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    stack: 'Node.js + Express + Socket.IO'
  });
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('task_update', async (data) => {
    try {
      const updatedTask = await projectManager.updateTask(data);
      io.emit('task_updated', updatedTask);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('project_update', async (data) => {
    try {
      const updatedProject = await projectManager.updateProject(data);
      io.emit('project_updated', updatedProject);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  server.listen(PORT, () => {
    console.log(`🚀 AlexAI Star Trek Agile System running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔮 Observation Lounge: http://localhost:${PORT}/observation-lounge`);
    console.log(`📋 Projects: http://localhost:${PORT}/projects`);
  });
}

// Export for Vercel
module.exports = app; 