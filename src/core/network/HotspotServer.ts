// Embedded Socket.io server that runs directly in the React Native app
// This allows the host device to act as both server and client

import { Server } from 'socket.io';
import { createServer } from 'http';

export class HotspotServer {
  private io: Server | null = null;
  private httpServer: any = null;
  private rooms: Map<string, Set<string>> = new Map();

  async start(port: number = 3000): Promise<boolean> {
    try {
      // Create HTTP server
      this.httpServer = createServer();
      
      // Create Socket.io server
      this.io = new Server(this.httpServer, {
        cors: { origin: '*' },
        transports: ['websocket'],
      });

      // Handle connections
      this.io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join-room', ({ roomId, deviceId, password }) => {
          const room = this.rooms.get(roomId);
          
          if (!room) {
            this.rooms.set(roomId, new Set([deviceId]));
          } else {
            room.add(deviceId);
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
          this.io?.to(peerId).emit('sync-response', messages);
        });

        socket.on('disconnect', () => {
          const { roomId, deviceId } = socket.data;
          if (roomId && deviceId) {
            const room = this.rooms.get(roomId);
            if (room) {
              room.delete(deviceId);
              socket.to(roomId).emit('peer-disconnected', deviceId);
            }
          }
        });
      });

      // Start listening
      await new Promise<void>((resolve, reject) => {
        this.httpServer.listen(port, () => {
          console.log(`Hotspot server running on port ${port}`);
          resolve();
        }).on('error', reject);
      });

      return true;
    } catch (error) {
      console.error('Failed to start hotspot server:', error);
      return false;
    }
  }

  stop(): void {
    if (this.io) {
      this.io.close();
      this.io = null;
    }
    if (this.httpServer) {
      this.httpServer.close();
      this.httpServer = null;
    }
    this.rooms.clear();
  }

  isRunning(): boolean {
    return this.io !== null;
  }

  getConnectedDevices(roomId: string): string[] {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room) : [];
  }
}
