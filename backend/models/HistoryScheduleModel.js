const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database.js');

const HistorySchedule = sequelize.define('HistorySchedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_schedule: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    no_whatsapp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

(async () => {
    await HistorySchedule.sync();
})();

module.exports = HistorySchedule;