const Schedule = require('../models/ScheduleModel.js');
const RecipientList = require('../models/RecipientListModel.js');
const Recipient = require('../models/RecipientModel.js');
const Activity = require('../models/ActivityModel.js');
const sequelize = require('../config/Database.js');
const Sequelize = require('sequelize');
const setupCronJobs = require('../controllers/SchedulerController.js');

const createSchedule = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id_message, jenis_message, id_activity, jenis_schedule, tanggal_mulai, tanggal_akhir, waktu, 'recipient_list':recipientList } = req.body;

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
    
    setupCronJobs.setupCronJobs();
};

const getSchedule = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: [{
                model: RecipientList,
                as: 'recipient_list',
                include: [{
                    model: Recipient,
                    as: 'recipients',
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
    const { id } = req.params;
    try {
        const schedule = await Schedule.findByPk(id, {
            include: [{
                model: RecipientList,
                as: 'recipient_list', // Specify the alias here
                include: [{
                    model: Recipient,
                    as: 'recipients', // Specify the alias for Recipient
                }],
            }],
        });

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        res.status(200).json(schedule);
    } catch (error) {
        console.error('Error fetching schedule by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateSchedule = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params; // Assuming you have the schedule ID in the request parameters
        const { id_message, jenis_message, id_activity, jenis_schedule, tanggal_mulai, tanggal_akhir, waktu, 'recipient_list': recipientList } = req.body;

        // Check if the schedule exists
        const existingSchedule = await Schedule.findByPk(id);
        if (!existingSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Update the schedule data
        await existingSchedule.update({
            id_message,
            jenis_message,
            id_activity,
            jenis_schedule,
            tanggal_mulai,
            tanggal_akhir,
            waktu
        }, { transaction });

        // Delete the current recipient list for the schedule
        await RecipientList.destroy({ where: { id_schedule: id } }, { transaction });

        // Bulk create the new recipient list for the schedule
        if (recipientList && recipientList.length > 0) {
            const recipientListItems = recipientList.map((recipient) => ({
                id_schedule: id,
                id_recipient: recipient.id_recipient,
            }));

            await RecipientList.bulkCreate(recipientListItems, { transaction });
        }

        // Commit the transaction
        await transaction.commit();

        // Fetch the updated schedule with associated data (optional, depending on your needs)
        const updatedSchedule = await Schedule.findByPk(id, {
            include: [{
                model: RecipientList,
                as: 'recipient_list',
                include: [{
                    model: Recipient,
                    as: 'recipients',
                }],
            }],
        });

        res.status(200).json(updatedSchedule);
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();

        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    setupCronJobs.setupCronJobs();
};

const deleteSchedule = async (req, res) => {
    const { id } = req.params; // Assuming you have the schedule ID in the request parameters
    const transaction = await sequelize.transaction();

    try {
        // Check if the schedule exists
        const existingSchedule = await Schedule.findByPk(id);
        if (!existingSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Delete the associated recipient list
        await RecipientList.destroy({ where: { id_schedule: id } }, { transaction });

        // Delete the schedule
        await existingSchedule.destroy({ transaction });

        // Commit the transaction
        await transaction.commit();

        res.status(204).send(); // 204 No Content indicates a successful deletion
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();

        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createSchedule,
    getSchedule,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
};