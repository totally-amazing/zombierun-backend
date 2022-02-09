const { Server } = require('socket.io');

const config = require('../config');

class Socket {
  constructor(server, roomModel) {
    this.io = new Server(server, {
      cors: {
        origin: config.cors.allowOrigin,
      },
    });

    this.io.on('connect', (socket) => {
      console.log(`socket::::: ${socket.id} connected`);

      socket.on('user/join', async (roomId, userId) => {
        console.log(`socket::::: user ${userId} joined room`);

        socket.join(roomId);
        await roomModel.findByIdAndUpdate(roomId, {
          $push: { participants: userId },
        });

        socket.roomId = roomId;
        socket.userId = userId;

        this.io.to(roomId).emit('user/join', userId);
      });

      socket.on('user/ready', () => {
        console.log(`socket::::: user ${socket.userId} is ready`);

        this.io.to(socket.roomId).emit('user/ready', socket.userId);
      });

      socket.on('user/notReady', () => {
        console.log(`socket::::: user ${socket.userId} is not ready`);

        this.io.to(socket.roomId).emit('user/notReady', socket.userId);
      });

      socket.on('user/leave', async () => {
        console.log(`socket::::: user ${socket.userId} left room`);

        const room = await roomModel.findById(socket.roomId);
        room.participants = room.participants.filter(
          (userId) => userId !== socket.userId
        );
        await room.save();

        this.io.to(socket.roomId).emit('user/leave', socket.userId);
        socket.leave(socket.roomId);
      });

      socket.on('user/die', () => {
        console.log(`socket::::: user ${socket.userId} is dead`);

        this.io.to(socket.roomId).emit('user/die', socket.userId);
        socket.leave(socket.roomId);
      });
    });
  }
}

let socket;

exports.initSocket = (server) => {
  if (!socket) {
    socket = new Socket(server);
  }
};
