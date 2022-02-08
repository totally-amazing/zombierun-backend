const Room = require('../models/Room');

exports.getRoomList = async (req, res) => {
  const roomList = await Room.find().lean();

  return res.send(roomList);
};
