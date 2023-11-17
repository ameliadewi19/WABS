const TemplateMessage = require('../models/TemplateMessageModel'); // Update the path accordingly
const {Sequelize} = require("sequelize");

// Create a new TemplateMessage
const createTemplateMessage = async (req, res) => {
  try {
    const { jenis_template, message } = req.body;
    const templateMessage = await TemplateMessage.create({ jenis_template, message });
    res.status(201).json(templateMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all TemplateMessages
const getAllTemplateMessages = async (req, res) => {
  try {
    const templateMessages = await TemplateMessage.findAll();
    res.status(200).json(templateMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific TemplateMessage by ID
const getTemplateMessageById = async (req, res) => {
  try {
    const templateMessage = await TemplateMessage.findByPk(req.params.id);
    if (templateMessage) {
      res.status(200).json(templateMessage);
    } else {
      res.status(404).json({ error: 'TemplateMessage not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTemplateMessagesByJenisTemplate = async (req, res) => {
    try {
      const { jenis_template } = req.params;
      const templateMessages = await TemplateMessage.findAll({ where: { jenis_template } });
  
      if (templateMessages.length > 0) {
        res.status(200).json(templateMessages);
      } else {
        res.status(404).json({ error: 'No TemplateMessages found for the specified jenis_template' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };  

// Update a TemplateMessage by ID
const updateTemplateMessageById = async (req, res) => {
  try {
    const { jenis_template, message } = req.body;
    const templateMessage = await TemplateMessage.findByPk(req.params.id);
    if (templateMessage) {
      await templateMessage.update({ jenis_template, message });
      res.status(200).json(templateMessage);
    } else {
      res.status(404).json({ error: 'TemplateMessage not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a TemplateMessage by ID
const deleteTemplateMessageById = async (req, res) => {
  try {
    const templateMessage = await TemplateMessage.findByPk(req.params.id);
    if (templateMessage) {
      await templateMessage.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'TemplateMessage not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createTemplateMessage,
  getAllTemplateMessages,
  getTemplateMessageById,
  updateTemplateMessageById,
  deleteTemplateMessageById,
  getTemplateMessagesByJenisTemplate
};
