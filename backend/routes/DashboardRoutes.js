const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController'); // Adjust the path based on your project structure

router.get('/dashboard-info/', dashboardController.getInfo);

module.exports = router;
