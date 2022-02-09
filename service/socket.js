const Room = require('../models/Room');
const Game = require('../models/Game');

class SocketListener {
  constructor(io) {
    this.io = io;
  }

  joinRoom = (socket) => {
    socket.on('user/join', async (roomId, userId) => {
      if (socket.roomId) {
        console.error('이미 join된 room이 있습니다');
        return;
      }

      try {
        const room = await Room.findById(roomId);
        room.participants.push(userId);
        await room.save();

        socket.roomId = roomId;
        socket.userId = userId;

        socket.join(roomId);
        this.io.to(roomId).emit('user/join', userId);

        console.log(`socket::::: user ${userId} joined room`);
      } catch (error) {
        console.error(error);
      }
    });
  };

  ready = (socket) => {
    socket.on('user/ready', () => {
      try {
        this.checkIfJoinRoom(socket);

        this.io.to(socket.roomId).emit('user/ready', socket.userId);

        console.log(`socket::::: user ${socket.userId} is ready`);
      } catch (error) {
        console.error(error);
      }
    });
  };

  notReady = (socket) => {
    socket.on('user/notReady', () => {
      try {
        this.checkIfJoinRoom(socket);

        this.io.to(socket.roomId).emit('user/notReady', socket.userId);

        console.log(`socket::::: user ${socket.userId} is not ready`);
      } catch (error) {
        console.error(error);
      }
    });
  };

  leaveRoom = (socket) => {
    socket.on('user/leave', async () => {
      try {
        this.checkIfJoinRoom(socket);

        const room = await Room.findById(socket.roomId);
        room.participants.remove(socket.userId);
        await room.save();

        socket.roomId = null;

        this.io.to(socket.roomId).emit('user/leave', socket.userId);
        socket.leave(socket.roomId);

        console.log(`socket::::: user ${socket.userId} left room`);
      } catch (error) {
        console.error(error);
      }
    });
  };

  die = (socket) => {
    socket.on('user/die', () => {
      try {
        this.checkIfJoinRoom(socket);

        this.io.to(socket.roomId).emit('user/die', socket.userId);
        socket.leave(socket.roomId);

        console.log(`socket::::: user ${socket.userId} is dead`);
      } catch (error) {
        console.error(error);
      }
    });
  };

  startGame = (socket) => {
    socket.on('game/start', async (mode) => {
      try {
        this.checkIfJoinRoom(socket);

        const { id } = await Game.create({
          mode,
          players: [],
        });
        await Room.findByIdAndDelete(socket.roomId);

        this.io.to(socket.roomId).emit('game/start', id);

        console.log(`socket::::: game started: ${socket.roomId}`);
      } catch (error) {
        console.error(error);
      }
    });
  };

  checkIfJoinRoom = (socket) => {
    if (!socket.roomId) {
      throw new Error('socket이 room에 join되지 않았습니다');
    }
  };
}

module.exports = SocketListener;
