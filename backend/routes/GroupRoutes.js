const express = require('express');
const router = express.Router();
const groupController = require('../controllers/GroupController'); // Adjust the path based on your project structure

router.get('/groups/', groupController.getAllGroups);
router.get('/groups/:id', groupController.getGroupById);
router.post('/groups/', groupController.createGroup);
router.put('/groups/:id', groupController.updateGroup);
router.delete('/groups/:id', groupController.deleteGroup);

module.exports = router;
