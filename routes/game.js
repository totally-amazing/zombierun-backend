const express = require('express');

const gameController = require('../controllers/game');

const router = express.Router();

router.post('/', (req, res, next) => {});
router.get('/total', gameController.getTotalRecord);
router.get('/recent', (req, res, next) => {});

module.exports = router;
