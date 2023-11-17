const express = require('express');
const router = express.Router();
const { createSchedule, getSchedule, getScheduleById, updateSchedule, deleteSchedule} = require('../controllers/ScheduleMessageController.js');

router.post('/schedule', createSchedule);
router.get('/schedule', getSchedule);
router.get('/schedule/:id', getScheduleById);
router.put('/schedule/:id', updateSchedule);
router.delete('/schedule/:id', deleteSchedule);
module.exports = router;