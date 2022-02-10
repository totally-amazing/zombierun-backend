const Room = require('../models/Room');

exports.getRoomList = async (req, res) => {
  const roomList = await Room.find().lean();

  return res.send(roomList);
};

exports.createRoom = async (req, res) => {
  const { mode, title, speed, time } = req.body;
  const { id } = await Room.create({
    mode,
    title,
    speed,
    time,
    participants: [],
  });

  res.send({ id });
};

exports.deleteRoom = async (req, res) => {
  const { id } = req.params;

  await Room.deleteOne({ id });

  res.status(204).end();
};
