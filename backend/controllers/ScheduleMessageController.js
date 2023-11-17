const Schedule = require('../models/ScheduleModel.js');
const RecipientList = require('../models/RecipientListModel.js');
const Recipient = require('../models/RecipientModel.js');
const sequelize = require('../config/Database.js');
const Sequelize = require('sequelize');

const createSchedule = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id_message, jenis_message, id_activity, jenis_schedule, tanggal_mulai, tanggal_akhir, waktu, 'recipient_list': recipientList } = req.body;

        // Create a new schedule
        const newSchedule = await Schedule.create({
            id_message,
            jenis_message,
            id_activity,
            jenis_schedule,
            tanggal_mulai,
            tanggal_akhir,
            waktu
        }, { transaction });

        // Extract recipient list from the request and associate it with the newly created schedule
        if (recipientList && recipientList.length > 0) {
            const recipientListItems = recipientList.map((recipient) => ({
                id_schedule: newSchedule.id,
                id_recipient: recipient.id_recipient
            }));

            await RecipientList.bulkCreate(recipientListItems, { transaction });
        }

        // Commit the transaction
        await transaction.commit();

        res.status(201).json(newSchedule);
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();

        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getSchedule = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: [{
              model: RecipientList,
              as: 'recipient_list', // Specify the alias here
              include: [{
                model: Recipient,
                as: 'recipients', // Specify the alias for Recipient
              }],
            }],
          });
        res.status(200).json(schedules);
     } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) {
            res.status(404).json({ message: 'Schedule not found' });
        } else{
            res.status(200).json(schedule);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createSchedule,
    getSchedule,
    getScheduleById,
};