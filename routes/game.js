const express = require('express');

const { validateQuery } = require('../middlewares/validators');
const gameController = require('../controllers/game');

const router = express.Router();

router.post('/', (req, res, next) => {});
router.get('/total', validateQuery, gameController.getTotalRecord);
router.get('/recent', validateQuery, (req, res, next) => {});

module.exports = router;
