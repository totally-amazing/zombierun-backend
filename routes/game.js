const express = require('express');

const {
  validateQuery,
  validateGameHistory,
} = require('../middlewares/validators');
const gameController = require('../controllers/game');

const router = express.Router();

router.get('/total', validateQuery, gameController.getTotalRecord);
router.get('/recent', validateQuery, gameController.getRecentRecord);
router.put('/', validateGameHistory, gameController.updateGameRecord);

module.exports = router;
