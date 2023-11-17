
const express = require('express');
const { directMessagesGeneral } = require('../controllers/DirectMessageController');

const directMessageRouter = express.Router();

// Endpoint to handle direct message submissions
directMessageRouter.post('/direct-message', directMessagesGeneral);

module.exports = directMessageRouter;
