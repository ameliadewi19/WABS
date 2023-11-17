const Group = require('../models/GroupModel'); // Adjust the path based on your project structure
const GroupRecipient = require('../models/GroupRecipientModel');
const {Sequelize} = require("sequelize");
const Recipient = require('../models/RecipientModel');

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: [{
        model: GroupRecipient,
        as: 'recipients', // Specify the alias here
        include: [{
          model: Recipient,
          as: 'recipients', // Specify the alias for Recipient
        }],
      }],
    });
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findByPk(id, {
      include: [{
        model: GroupRecipient,
        as: 'recipients', // Specify the alias here
        include: [{
          model: Recipient,
          as: 'recipients', // Specify the alias for Recipient
        }],
      }],
    });

    if (group) {
      res.json(group);
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (error) {
    console.error('Error fetching group by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createGroup = async (req, res) => {
  const { nama_grup, deskripsi, recipients } = req.body;
  console.log("Request Body:", req.body);

  try {
    // Create the group
    const newGroup = await Group.create({ nama_grup, deskripsi });

    // Create recipients associated with the group
    await Promise.all(
      recipients.map(async (recipient) => {
        const { id_recipient } = recipient;
        // Ensure id_recipient is not null or undefined before creating
        if (id_recipient != null) {
          await GroupRecipient.create({ id_grup: newGroup.id, id_recipient });
        }
      })
    );

    // Fetch the group again with associated recipients
    const groupWithRecipients = await Group.findByPk(newGroup.id, {
      include: [
        {
          model: GroupRecipient,
          as: 'recipients',
          include: [{
            model: Recipient,
            as: 'recipients'
          }
          ], // Include the Recipient model
        },
      ],
    });

    res.status(201).json(groupWithRecipients);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { nama_grup, deskripsi, recipients } = req.body;

  try {
    const group = await Group.findByPk(id, {
      include: [
        {
          model: GroupRecipient,
          as: 'recipients',
        },
      ],
    });

    if (group) {
      // Update the group details
      await group.update({ nama_grup, deskripsi });

      // Get the existing recipients for the group
      const existingRecipients = group.recipients.map((recipient) => recipient.id_recipient);

      // Identify recipients to be removed
      const recipientsToRemove = existingRecipients.filter((existingRecipient) =>
        recipients.every((updatedRecipient) => updatedRecipient.id_recipient !== existingRecipient)
      );

      // Identify recipients to be added or updated
      const recipientsToAddOrUpdate = recipients.filter(
        (updatedRecipient) => !existingRecipients.includes(updatedRecipient.id_recipient)
      );

      // Remove recipients
      await GroupRecipient.destroy({
        where: {
          id_grup: group.id,
          id_recipient: recipientsToRemove,
        },
      });

      // Add or update recipients
      await Promise.all(
        recipientsToAddOrUpdate.map(async (updatedRecipient) => {
          const { id_recipient } = updatedRecipient;

          // Check if the recipient already exists for the group
          const existingRecipient = await GroupRecipient.findOne({
            where: { id_grup: group.id, id_recipient },
          });

          // If the recipient exists, update it; otherwise, create a new one
          if (existingRecipient) {
            await existingRecipient.update({ id_recipient });
          } else {
            await GroupRecipient.create({ id_grup: group.id, id_recipient });
          }
        })
      );

      res.json(group);
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findByPk(id);

    if (group) {
      // Find and delete associated GroupRecipients
      await GroupRecipient.destroy({
        where: { id_grup: group.id },
      });

      // Delete the group itself
      await group.destroy();
      
      res.json({ message: 'Group deleted successfully' });
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
};