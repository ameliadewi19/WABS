const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/Database.js");
const Recipient = require('./RecipientModel.js');
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

RecipientList.belongsTo(Recipient, { foreignKey: 'id_recipient', as: 'recipients' });

module.exports = RecipientList;