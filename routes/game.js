const express = require('express');

const {
  validateQuery,
  validateUpdateGameRecord,
  validateCreateGameRecord,
} = require('../middlewares/validators');
const gameController = require('../controllers/game');

const router = express.Router();

router.get('/total', validateQuery, gameController.getTotalRecord);
router.get('/recent', validateQuery, gameController.getRecentRecord);
router.post('/', validateCreateGameRecord, gameController.createGameRecord);
router.put('/:id', validateUpdateGameRecord, gameController.updateGameRecord);

module.exports = router;
