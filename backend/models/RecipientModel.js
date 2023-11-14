// import JadwalUjian from "JadwalModel.js";
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/Database.js");
//const JadwalUjian = require("./JadwalModel.js"); // Correct the import path

const Recipient = sequelize.define("Recipient", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    no_whatsapp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

// Define the association
// Dosen.hasMany(JadwalUjian, {
//     foreignKey: 'id_dosen',
// });
  
// Sync the model with the database
(async () => {
    await sequelize.sync();
})();

module.exports = Recipient;