// Optional Socket.io server for WiFi mode
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

const rooms = new Map(); // roomId -> { password, devices: Set }

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', ({ roomId, deviceId, password }) => {
    const room = rooms.get(roomId);

    if (room && room.password !== password) {
      socket.emit('room-error', 'Invalid password');
      return;
    }

    if (!room) {
      rooms.set(roomId, { password, devices: new Set([deviceId]) });
    } else {
      room.devices.add(deviceId);
    }

    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.deviceId = deviceId;

    socket.emit('room-joined');
    socket.to(roomId).emit('peer-connected', deviceId);
  });

  socket.on('message', ({ roomId, message }) => {
    socket.to(roomId).emit('message', message);
  });

  socket.on('sync-request', ({ roomId, lastTimestamp }) => {
    socket.to(roomId).emit('sync-request', {
      peerId: socket.data.deviceId,
      lastTimestamp,
    });
  });

  socket.on('sync-response', ({ peerId, messages }) => {
    io.to(peerId).emit('sync-response', messages);
  });

  socket.on('disconnect', () => {
    const { roomId, deviceId } = socket.data;
    if (roomId && deviceId) {
      const room = rooms.get(roomId);
      if (room) {
        room.devices.delete(deviceId);
        socket.to(roomId).emit('peer-disconnected', deviceId);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
