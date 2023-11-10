'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Activities', {
      id_activity: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      activity_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      activity_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      activity_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Activities');
  }
};
