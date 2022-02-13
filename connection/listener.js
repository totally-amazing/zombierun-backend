const Room = require('../models/Room');
const Game = require('../models/Game');

exports.joinRoom = async (socket, roomId, user) => {
  if (socket.roomId) {
    console.error('이미 join된 room이 있습니다');
    return;
  }

  try {
    const room = await Room.findById(roomId);
    room.participants.push(user);
    await room.save();

    socket.roomId = roomId;
    socket.userId = user.id;

    socket.join(roomId);
    socket.to(roomId).emit('room/join', user);


    console.log(`socket::::: user ${user.id} joined room`);
  } catch (error) {
    console.error(error);
  }
};

exports.ready = (socket) => {
  try {
    checkIfJoinRoom(socket);

    socket.to(socket.roomId).emit('room/ready', socket.userId);

    console.log(`socket::::: user ${socket.userId} is ready`);
  } catch (error) {
    console.error(error);
  }
};

exports.notReady = (socket) => {
  try {
    checkIfJoinRoom(socket);

    socket.to(socket.roomId).emit('room/notReady', socket.userId);

    console.log(`socket::::: user ${socket.userId} is not ready`);
  } catch (error) {
    console.error(error);
  }
};

exports.leaveRoom = async (socket) => {
  try {
    checkIfJoinRoom(socket);

    const room = await Room.findById(socket.roomId);

    room.participants = room.participants.filter(
      (participant) => String(participant.id) !== socket.userId
    );
    await room.save();

    socket.roomId = null;

    socket.to(socket.roomId).emit('room/leave', socket.userId);
    socket.leave(socket.roomId);

    console.log(`socket::::: user ${socket.userId} left room`);
  } catch (error) {
    console.error(error);
  }
};

exports.die = (socket) => {
  try {
    checkIfJoinRoom(socket);

    socket.to(socket.roomId).emit('game/die', socket.userId);
    socket.leave(socket.roomId);

    console.log(`socket::::: user ${socket.userId} is dead`);
  } catch (error) {
    console.error(error);
  }
};

exports.startGame = async (socket, mode) => {
  try {
    checkIfJoinRoom(socket);

    const { id } = await Game.create({
      mode,
      players: [],
    });
    await Room.findByIdAndDelete(socket.roomId);

    socket.to(socket.roomId).emit('game/start', id);

    console.log(`socket::::: game started: ${socket.roomId}`);
  } catch (error) {
    console.error(error);
  }
};

exports.sendOpponentSpeed = (socket, speed) => {
  try {
    checkIfJoinRoom(socket);

    socket.to(socket.roomId).emit('game/opponentSpeed', speed);

    console.log(`socket::::: opponentSpeed: ${speed}`);
  } catch (error) {
    console.log(error);
  }
};

function checkIfJoinRoom(socket) {
  if (!socket.roomId) {
    throw new Error('socket이 room에 join되지 않았습니다');
  }
}
