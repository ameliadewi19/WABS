'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Group', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_grup: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // Add the foreign key constraint
  //   await queryInterface.addConstraint('Groups', {
  //     type: 'foreign key',
  //     fields: ['id_grup'],
  //     name: 'fk_groups_group_recipients',
  //     references: {
  //       table: 'GroupRecipient',
  //       field: 'id_grup',
  //     },
  //     onDelete: 'cascade', // Add this line if you want to cascade delete on GroupRecipient
  //     onUpdate: 'cascade', // Add this line if you want to cascade update on GroupRecipient
  //   });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the foreign key constraint first
    // await queryInterface.removeConstraint('Groups', 'fk_groups_group_recipients');

    // Then, drop the table
    await queryInterface.dropTable('Group');
  },
};
