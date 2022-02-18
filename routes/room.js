const express = require('express');

const roomController = require('../controllers/room');
const { checkAuth } = require('../middlewares/checkAuth');
const { validateRoom, validateRoomId } = require('../middlewares/validators');

const router = express.Router();

router.get('/', checkAuth, roomController.getRoomList);
router.post('/', checkAuth, validateRoom, roomController.createRoom);
router.delete('/:id', checkAuth, validateRoomId, roomController.deleteRoom);

module.exports = router;
