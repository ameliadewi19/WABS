const Recipient = require("../models/RecipientModel.js");
const GroupRecipient = require('../models/GroupRecipientModel');
const Schedule = require('../models/ScheduleModel.js');
const { Op } = require('sequelize');

const getInfo = async (req, res) => {
    try {
        const recipients = await Recipient.findAll();
        const totalRecipients = recipients.length;

        const groups = await GroupRecipient.findAll();
        totalGroups = groups.length;

        const currentDate = new Date();
        const schedules = await Schedule.findAll({
            where: {
              [Op.and]: [
                { tanggal_mulai: { [Op.lte]: currentDate } }, // Tanggal awal kurang dari atau sama dengan tanggal saat ini
                { tanggal_akhir: { [Op.gte]: currentDate } }, // Tanggal akhir lebih dari atau sama dengan tanggal saat ini
              ],
            },
        });
        totalSchedules = schedules.length;
    
        // Menambahkan informasi total ke dalam respons
        const response = {
          totalRecipients,
          totalGroups,
          totalSchedules
        };
    
        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to get dashboard info.' });
    }
};

module.exports = {
  getInfo
};
