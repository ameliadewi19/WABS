'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Schedule', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_message: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      jenis_message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_activity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      jenis_schedule: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tanggal_mulai: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      tanggal_akhir: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      waktu: {
        type: Sequelize.TIME,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Schedule');
  }
};
