const express = require('express');

const authController = require('../controllers/auth');
const { checkAuth } = require('../middlewares/checkAuth');

const router = express.Router();

router.get('/me', checkAuth, authController.me);
router.post('/signin', authController.signIn);

module.exports = router;
