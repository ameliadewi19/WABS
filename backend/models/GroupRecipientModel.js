const { DataTypes } = require('sequelize');
const sequelize = require("../config/Database.js"); // Adjust the path based on your project structure
const Recipient = require('./RecipientModel'); // Import GroupRecipient before defining associations

const GroupRecipient = sequelize.define("GroupRecipient", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_grup: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_recipient: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  freezeTableName: true,
  timestamps: false
});

(async () => {
  await sequelize.sync();
})();

GroupRecipient.belongsTo(Recipient, { foreignKey: 'id_recipient', as: 'recipients' });

module.exports = GroupRecipient;