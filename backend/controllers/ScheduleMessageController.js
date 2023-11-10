const Schedule = require('../models/ScheduleModel.js');

const createSchedule = async (req, res) => {
    try {
        const { id_message, jenis_message, id_activity, jenis_schedule, tanggal_mulai, tanggal_akhir, waktu } = req.body;
        const newSchedule = await Schedule.create({
            id_message,
            jenis_message,
            id_activity,
            jenis_schedule,
            tanggal_mulai,
            tanggal_akhir,
            waktu
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findAll();
        res.status(200).json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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