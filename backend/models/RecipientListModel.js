const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/Database.js");
const Recipient = require('./RecipientModel');
const Schedule = require('./ScheduleModel');

const RecipientList = sequelize.define("RecipientList", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_schedule: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_recipient: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

// Sync the model with the database
(async () => {
  await RecipientList.sync();
})();

RecipientList.hasMany(Schedule, { foreignKey: 'id_schedule', as: 'schedule' });

module.exports = RecipientList;