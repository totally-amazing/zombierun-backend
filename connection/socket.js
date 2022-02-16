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

      socket.on('room/join', (room, user) => {
        listener.joinRoom(socket, room, user);
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
      socket.on('game/start', (mode) => {
        listener.startGame(socket, mode);
      });
      socket.on('game/userSpeed', (speed) => {
        listener.sendOpponentSpeed(socket, speed);
      });

      socket.on('game/finish', () => {
        listener.finishGame(socket);
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
