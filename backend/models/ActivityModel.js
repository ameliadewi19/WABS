const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/Database.js");
const Schedule = require("./ScheduleModel.js");

const Activity = sequelize.define("Activity", {
  id_activity: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  activity_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activity_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  activity_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

// Sync the model with the database
(async () => {
  await Activity.sync();
})();


module.exports = Activity;
