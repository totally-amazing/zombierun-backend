const express = require('express');

const authController = require('../controllers/auth');
const { checkAuth } = require('../middlewares/checkAuth');

const router = express.Router();

router.post('/signin', authController.signIn);
router.get('/me', checkAuth, authController.me);

module.exports = router;
