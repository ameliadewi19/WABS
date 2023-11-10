const express = require('express');
const router = express.Router();
const { createActivity, getActivities, getActivityById, updateActivity, deleteActivity} = require('../controllers/ActivityController.js');

router.post('/activity', createActivity);
router.get('/activity', getActivities);
router.get('/activity/:id', getActivityById);
router.put('/activity/:id', updateActivity);
router.delete('/activity/:id', deleteActivity);

module.exports = router;