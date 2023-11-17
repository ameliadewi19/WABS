const { DataTypes } = require('sequelize');
const sequelize = require("../config/Database.js");// Sesuaikan dengan path Anda
const GroupRecipient = require('./GroupRecipientModel');

const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_grup: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
},
  {
    freezeTableName: true, // This option prevents Sequelize from pluralizing the table name
    timestamps: false
});

(async () => {
    await sequelize.sync();
})();

Group.hasMany(GroupRecipient, { foreignKey: 'id_grup', as: 'recipients' });

module.exports = Group;