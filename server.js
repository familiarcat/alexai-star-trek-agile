#!/usr/bin/env node
/**
 * AlexAI Star Trek Agile System - Next.js Server with Socket.IO
 * Unified server using Next.js App Router and Socket.IO integration
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { setupSocketIO } = require('./src/app/api/socket/route');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Prepare the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Handle Socket.IO connections
      if (pathname === '/api/socket') {
        // Socket.IO will handle this route
        return;
      }

      // Let Next.js handle all other routes
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Setup Socket.IO
  const io = setupSocketIO(server);

  // Start server
  server.listen(port, () => {
    console.log(`🚀 AlexAI Star Trek Agile System running on port ${port}`);
    console.log(`📊 Dashboard: http://localhost:${port}`);
    console.log(`🔮 Observation Lounge: http://localhost:${port}/observation-lounge`);
    console.log(`📋 Projects: http://localhost:${port}/projects`);
    console.log(`🖖 Socket.IO: http://localhost:${port}/api/socket`);
  });
}); 