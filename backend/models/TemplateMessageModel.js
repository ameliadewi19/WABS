const { DataTypes } = require('sequelize');
const sequelize = require("../config/Database.js");// Sesuaikan dengan path Anda

const TemplateMessage = sequelize.define("TemplateMessage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jenis_template: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
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

module.exports = TemplateMessage;