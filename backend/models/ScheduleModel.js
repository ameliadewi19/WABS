const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database.js');
const RecipientList = require('./RecipientListModel.js');
const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_message: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jenis_message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_activity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    jenis_schedule: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tanggal_mulai: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tanggal_akhir: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    waktu: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

(async () => {
    await Schedule.sync();
})();

Schedule.hasMany(RecipientList, { foreignKey: 'id_schedule', as: 'recipient_list' });

module.exports = Schedule;