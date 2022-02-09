const express = require('express');

const roomController = require('../controllers/room');
const { validateRoom } = require('../middlewares/validators');

const router = express.Router();

router.get('/', roomController.getRoomList);
router.post('/', validateRoom, roomController.createRoom);

module.exports = router;
