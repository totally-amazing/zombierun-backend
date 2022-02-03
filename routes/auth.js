const express = require('express');

const router = express.Router();

router.get('/signin', async (req, res, next) => {}); // 콜백함수는 추후 controller 모듈의 메소드로 교체

module.exports = router;
