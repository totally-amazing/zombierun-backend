const Room = require('../models/Room');
const Game = require('../models/Game');

exports.joinRoom = async (socket, room, user) => {
  if (socket.room) {
    console.error('이미 join된 room이 있습니다');
    return;
  }

  try {
    const currentRoom = await Room.findById(room.id);
    currentRoom.participants.push(user);
    await currentRoom.save();

    socket.room = room;
    socket.user = user;

    socket.join(room.id);
    socket.to(room.id).emit('room/join', user);

    console.log(`socket::::: user ${user.id} joined room`);
  } catch (error) {
    console.error(error);
  }
};

exports.ready = async (socket) => {
  try {
    checkIfJoinRoom(socket);

    socket.to(socket.room.id).emit('room/ready', socket.user.id);

    const currentRoom = await Room.findById(socket.room.id);
    const user = currentRoom.participants.find(
      (player) => String(player.id) === socket.user.id
    );
    user.isReady = true;
    await currentRoom.save();

    console.log(`socket::::: user ${socket.user.id} is ready`);
  } catch (error) {
    console.error(error);
  }
};

exports.notReady = async (socket) => {
  try {
    checkIfJoinRoom(socket);

    socket.to(socket.room.id).emit('room/notReady', socket.user.id);

    const currentRoom = await Room.findById(socket.room.id);
    const user = currentRoom.participants.find(
      (player) => String(player.id) === socket.user.id
    );
    user.isReady = false;
    await currentRoom.save();

    console.log(`socket::::: user ${socket.user.id} is not ready`);
  } catch (error) {
    console.error(error);
  }
};

exports.leaveRoom = async (socket) => {
  try {
    checkIfJoinRoom(socket);

    const currentRoom = await Room.findById(socket.room.id);

    currentRoom.participants = currentRoom.participants.filter(
      (player) => String(player.id) !== socket.user.id
    );
    await currentRoom.save();

    socket.to(socket.room.id).emit('room/leave', socket.user.id);
    socket.leave(socket.room.id);

    socket.room = null;

    console.log(`socket::::: user ${socket.user.id} left room`);
  } catch (error) {
    console.error(error);
  }
};

exports.die = (socket) => {
  try {
    checkIfJoinRoom(socket);

    socket.to(socket.room.id).emit('game/die', socket.user.id);
    socket.leave(socket.room.id);

    console.log(`socket::::: user ${socket.user.id} is dead`);
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

    socket.to(socket.room.id).emit('game/start', id);

    console.log(`socket::::: game started: ${socket.room.id}`);
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
  if (!socket.room) {
    throw new Error('socket이 room에 join되지 않았습니다');
  }
}
