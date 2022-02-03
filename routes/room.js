const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {});
router.post('/', (req, res, next) => {});
router.put('/:id/enter', (req, res, next) => {});
router.put('/:id/exit', (req, res, next) => {});
router.delete('/:id/exit', (req, res, next) => {});

module.exports = router;
