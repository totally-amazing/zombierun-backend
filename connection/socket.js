const { Server } = require('socket.io');

const config = require('../config');
const listener = require('./listener');

class Socket {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: config.cors.allowOrigin,
      },
    });

    this.io.on('connect', (socket) => {
      console.log(`socket::::: ${socket.id} connected`);

      socket.on('user/join', (roomId, userId) => {
        listener.joinRoom(socket, roomId, userId);
      });
      socket.on('user/ready', () => {
        listener.ready(socket);
      });
      socket.on('user/notReady', () => {
        listener.notReady(socket);
      });
      socket.on('user/leave', () => {
        listener.leaveRoom(socket);
      });
      socket.on('user/die', () => {
        listener.die(socket);
      });
      socket.on('game/start', (mode) => {
        listener.startGame(socket, mode);
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
