import { NextRequest, NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';

// In-memory storage for real-time data (in production, use Redis or database)
const projectRooms = new Map();
const userPresence = new Map();

export async function GET(req: NextRequest) {
  // Handle Socket.IO upgrade
  if (req.headers.get('upgrade') === 'websocket') {
    // This will be handled by the Socket.IO middleware
    return new NextResponse(null, { status: 101 });
  }
  
  return NextResponse.json({ message: 'Socket.IO endpoint' });
}

// Socket.IO server setup function (not exported to avoid Next.js route conflicts)
function setupSocketIO(server: NetServer) {
  const io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_APP_URL 
        : 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('🖖 Client connected:', socket.id);
    
    // Track user presence
    const userData = {
      id: socket.id,
      name: `User-${socket.id.slice(-4)}`,
      status: 'online',
      lastSeen: new Date()
    };

    // Join project room
    socket.on('join_project', (data) => {
      const { projectId } = data;
      socket.join(`project-${projectId}`);
      console.log(`User ${socket.id} joined project ${projectId}`);
      
      // Notify others in the project
      socket.to(`project-${projectId}`).emit('user_joined', userData);
    });

    socket.on('leave_project', (data) => {
      const { projectId } = data;
      socket.leave(`project-${projectId}`);
      console.log(`User ${socket.id} left project ${projectId}`);
      
      // Notify others in the project
      socket.to(`project-${projectId}`).emit('user_left', socket.id);
    });

    // Task updates
    socket.on('task_update', async (data) => {
      try {
        // Here we would update the database
        // For now, just broadcast to project room
        io.to(`project-${data.projectId}`).emit('task_updated', data);
      } catch (error) {
        socket.emit('error', { message: error instanceof Error ? error.message : 'Unknown error' });
      }
    });

    // Project updates
    socket.on('project_update', async (data) => {
      try {
        // Here we would update the database
        // For now, just broadcast to project room
        io.to(`project-${data.id}`).emit('project_updated', data);
      } catch (error) {
        socket.emit('error', { message: error instanceof Error ? error.message : 'Unknown error' });
      }
    });

    // Chat messages
    socket.on('chat_message', (message) => {
      const { projectId } = message;
      if (projectId) {
        // Broadcast to all users in the project
        io.to(`project-${projectId}`).emit('chat_message', message);
      }
    });

    // User presence
    socket.on('user_presence', (userData) => {
      // Broadcast to all users in the project
      if (userData.projectId) {
        io.to(`project-${userData.projectId}`).emit('user_presence_updated', userData);
      }
    });

    // Typing indicators
    socket.on('user_typing', (data) => {
      const { projectId, userId } = data;
      if (projectId) {
        socket.to(`project-${projectId}`).emit('user_typing', userId);
      }
    });

    socket.on('user_stopped_typing', (data) => {
      const { projectId, userId } = data;
      if (projectId) {
        socket.to(`project-${projectId}`).emit('user_stopped_typing', userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('📡 Client disconnected:', socket.id);
      // Notify all projects this user was in
      socket.rooms.forEach((room) => {
        if (room.startsWith('project-')) {
          socket.to(room).emit('user_left', socket.id);
        }
      });
    });
  });

  return io;
} 