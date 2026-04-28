// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

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

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mechafind')
  .then(() => {
    server.listen(process.env.PORT || 5000, () =>
      console.log(`Server (with Socket.IO) running on port ${process.env.PORT || 5000}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});
