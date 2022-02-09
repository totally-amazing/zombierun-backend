const { Server } = require('socket.io');

const SocketListener = require('../service/socket');
const config = require('../config');

class Socket {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: config.cors.allowOrigin,
      },
    });
    this.listener = new SocketListener(this.io);

    this.io.on('connect', (socket) => {
      console.log(`socket::::: ${socket.id} connected`);

      this.listener.joinRoom(socket);
      this.listener.ready(socket);
      this.listener.notReady(socket);
      this.listener.leaveRoom(socket);
      this.listener.die(socket);
      this.listener.startGame(socket);
    });
  }
}

let socket;

exports.initSocket = (server) => {
  if (!socket) {
    socket = new Socket(server);
  }
};
