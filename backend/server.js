// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const { seedDemoData } = require('./seed/demoData');
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/mechanics',require('./routes/mechanicRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

// Socket.io for Real-Time Chat & Tracking
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room for a specific service request
  socket.on('join_request', (requestId) => {
    socket.join(requestId);
    console.log(`Socket ${socket.id} joined request room ${requestId}`);
  });

  // Handle chat messages
  socket.on('send_message', (data) => {
    // data: { requestId, senderId, text, timestamp }
    io.to(data.requestId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

MongoMemoryServer.create().then(mServer => {
  mongoServer = mServer;
  const uri = mongoServer.getUri();
  
  mongoose.connect(uri)
    .then(async () => {
      const demoSeed = await seedDemoData();
      console.log(demoSeed.seeded ? 'Demo users and mechanics seeded.' : 'Demo seed skipped, existing data found.');
      console.log('Demo credentials exported to', demoSeed.exportPath);
      server.listen(process.env.PORT, () =>
        console.log('Server (with Socket.IO) running on port', process.env.PORT));
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});
