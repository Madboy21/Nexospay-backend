const express = require('express');
const { requestWithdraw } = require('../controllers/withdrawController');
const router = express.Router();

router.post('/', requestWithdraw);

module.exports = router;
