const express = require('express');

const roomController = require('../controllers/room');

const router = express.Router();

router.get('/', roomController.getRoomList);
router.post('/', roomController.createRoom);
router.put('/:id/enter', (req, res, next) => {});
router.delete('/:id/exit', (req, res, next) => {});

module.exports = router;
