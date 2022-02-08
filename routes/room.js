const express = require('express');

const roomController = require('../controllers/room');

const router = express.Router();

router.get('/', roomController.getRoomList);
router.post('/', roomController.createRoom);

module.exports = router;
