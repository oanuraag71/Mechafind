const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/mechanics', require('./routes/mechanicRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

// Socket.io for Real-Time Chat & Tracking
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room for a specific service request
  socket.on('joinRequest', (requestId) => {
    socket.join(requestId);
    console.log(`Socket ${socket.id} joined request room ${requestId}`);
  });

  // Handle chat messages
  socket.on('sendMessage', (data) => {
    // data: { requestId, senderId, text, timestamp }
    io.to(data.requestId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const { MongoMemoryServer } = require('mongodb-memory-server');

async function startServer() {
  try {
    let mongoUri = process.env.MONGO_URI;
    let usingMemory = false;

    if (!mongoUri) {
      console.log('No MONGO_URI provided, starting in-memory MongoDB...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      usingMemory = true;
    }

    try {
      await mongoose.connect(mongoUri);
      console.log(usingMemory ? 'Connected to in-memory MongoDB' : 'Connected to MongoDB');
    } catch (dbError) {
      console.log('Failed to connect to provided MONGO_URI. Starting in-memory MongoDB instead...');
      const mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
      console.log('Connected to in-memory MongoDB (Fallback)');
    }

    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server with Socket.IO running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error('Unhandled Server error:', err);
    process.exit(1);
  }
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

startServer();
