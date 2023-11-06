const express = require('express');
const router = express.Router();
const { createSchedule, getSchedule, getScheduleById } = require('../controllers/ScheduleMessageController.js');

router.post('/schedule', createSchedule);
router.get('/schedule', getSchedule);
router.get('/schedule/:id', getScheduleById);

module.exports = router;