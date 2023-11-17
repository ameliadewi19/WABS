const express = require('express');
const router = express.Router();
const {
  createTemplateMessage,
  getAllTemplateMessages,
  getTemplateMessageById,
  updateTemplateMessageById,
  deleteTemplateMessageById,
  getTemplateMessagesByJenisTemplate
} = require('../controllers/TemplateMessageController'); // Update the path accordingly

// Create a new TemplateMessage
router.post('/template-messages', createTemplateMessage);

// Get all TemplateMessages
router.get('/template-messages', getAllTemplateMessages);

// Get a specific TemplateMessage by ID
router.get('/template-messages/:id', getTemplateMessageById);

// Get a specific TemplateMessage by Jenis Template
router.get('/template-messages/jenis/:jenis_template', getTemplateMessagesByJenisTemplate);

// Update a TemplateMessage by ID
router.put('/template-messages/:id', updateTemplateMessageById);

// Delete a TemplateMessage by ID
router.delete('/template-messages/:id', deleteTemplateMessageById);

module.exports = router;
