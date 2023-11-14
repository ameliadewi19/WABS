const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/Database.js");

const RecipientList = sequelize.define("RecipientList", {
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

module.exports = RecipientList;