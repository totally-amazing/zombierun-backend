const express = require('express');

const router = express.Router();

const roomController = require('../controllers/room');

router.get('/', roomController.getRoomList);
router.post('/', (req, res, next) => {});
router.put('/:id/enter', (req, res, next) => {});
router.put('/:id/exit', (req, res, next) => {});
router.delete('/:id/exit', (req, res, next) => {});

module.exports = router;
