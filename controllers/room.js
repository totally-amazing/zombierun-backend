const Room = require('../models/Room');

exports.getRoomList = async (req, res) => {
  const initialRoomList = [];

  const roomList = await Room.find().lean();

  if (!roomList.length) {
    return res.send(initialRoomList);
  }

  return res.send(roomList);
};
