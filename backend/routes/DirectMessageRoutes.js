
const express = require('express');
const { 
    directMessagesGeneral, 
    directMessagesActivity } 
= require('../controllers/DirectMessageController.js');

const directMessageRouter = express.Router();

// Endpoint to handle direct message submissions
directMessageRouter.post('/direct-message', directMessagesGeneral);
// directMessageRouter.post('/direct-message-activity', directMessagesActivity);
directMessageRouter.post('/direct-message-activity', directMessagesActivity);
  

module.exports = directMessageRouter;
