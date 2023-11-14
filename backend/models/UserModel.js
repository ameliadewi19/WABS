const { DataTypes } = require('sequelize');
const sequelize = require("../config/Database.js");// Sesuaikan dengan path Anda

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refresh_token: {  // refresh token
    type: DataTypes.TEXT,
  },
},
  {
    freezeTableName: true, // This option prevents Sequelize from pluralizing the table name
});

(async () => {
    await sequelize.sync();
})();

module.exports = User;