const express = require('express');
const { completeTask, getProgress } = require('../controllers/taskController');
const router = express.Router();

router.post('/complete', completeTask);
router.get('/:telegramId', getProgress);

module.exports = router;
