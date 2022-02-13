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

      socket.on('room/join', (roomId, user) => {
        listener.joinRoom(socket, roomId, user);
      });
      socket.on('room/ready', () => {
        listener.ready(socket);
      });
      socket.on('room/notReady', () => {
        listener.notReady(socket);
      });
      socket.on('room/leave', () => {
        listener.leaveRoom(socket);
      });
      socket.on('game/die', () => {
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
