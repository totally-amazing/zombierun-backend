const express = require('express');

const {
  validateQuery,
  validateUpdateGameRecord,
  validateCreateGameRecord,
} = require('../middlewares/validators');
const gameController = require('../controllers/game');
const { checkAuth } = require('../middlewares/checkAuth');

const router = express.Router();

router.get('/total', checkAuth, validateQuery, gameController.getTotalRecord);
router.get('/recent', checkAuth, validateQuery, gameController.getRecentRecord);
router.post(
  '/',
  checkAuth,
  validateCreateGameRecord,
  gameController.createGameRecord
);
router.put(
  '/:id',
  checkAuth,
  validateUpdateGameRecord,
  gameController.updateGameRecord
);

module.exports = router;
