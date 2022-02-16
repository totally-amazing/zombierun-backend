const express = require('express');

const roomController = require('../controllers/room');
const { validateRoom, validateRoomId } = require('../middlewares/validators');

const router = express.Router();

router.get('/', roomController.getRoomList);
router.post('/', validateRoom, roomController.createRoom);
router.delete('/:id', validateRoomId, roomController.deleteRoom);

module.exports = router;
