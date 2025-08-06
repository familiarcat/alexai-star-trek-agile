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
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await projectManager.createProject(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = await projectManager.getDashboardStats();
    res.json({ success: true, stats });
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

app.post('/api/alexai/consultation', async (req, res) => {
  try {
    const result = await alexai.consultation(req.body.context);
    res.json({ success: true, result });
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