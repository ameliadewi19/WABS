'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RecipientList', {
      id_schedule: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_recipient: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      freezeTableName: true,
      timestamps: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RecipientList');
  }
};
